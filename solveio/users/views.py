from datetime import datetime
from smtplib import SMTPException
from django.core.mail import EmailMultiAlternatives
from django.db import IntegrityError
from django.forms import ValidationError 
from django.template.loader import render_to_string
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from solveio.settings import CLIENT_URL, EMAIL_HOST_USER
from .serializers import UserSerializer, MyTokenObtainPairSerializer
from datetime import timedelta
from .models import BlackListedPasswordResetTokens, CustomUser
import jwt
import pytz
import datetime
import environ
import cloudinary.uploader as uploader

env = environ.Env()
# reading .env file
environ.Env.read_env()
# Create your views here.
class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(APIView):

    serializer_class = UserSerializer

    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        saved_user = serializer.data
        return Response(saved_user, status=status.HTTP_201_CREATED)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_logged_in_user(request): 
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def get_user(request, pk): 
    try:
        user = CustomUser.objects.get(pk=pk)
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({ "detail": "User not found" }, status=status.HTTP_404_NOT_FOUND)

@api_view(["POST"])
def check_user_exits_and_send_mail(request):
    try:
        email = request.data.get("email")
        if email == None:
            return Response({ "detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
        user = CustomUser.objects.get(email=email)
        send_mail(user=user)
        return Response({ "email": user.email, "success": True, "error": None }, status=status.HTTP_200_OK) 
    except CustomUser.DoesNotExist:
        return Response({ "email": None, "success": False, "error": "This email is not associated with any account." }, status=status.HTTP_400_BAD_REQUEST)
    except SMTPException as e:
        print('There was an error sending an email: ', e) 
        return Response({ "email": None, "success": False, "error": "Error while sennding mail." }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(["POST"])
def update_password_forgot_password(request):
    try:
        token = request.data.get("token")
        password = request.data.get("password")
        if token == None:
            return Response({ "detail": "Token is required."}, status=status.HTTP_400_BAD_REQUEST)
        if password == None:
            return Response({ "detail": "Password is required."}, status=status.HTTP_400_BAD_REQUEST)
        blacklisted_token = BlackListedPasswordResetTokens.objects.filter(token=token)
        if blacklisted_token.__len__() != 0:
            return Response({ "detail": "Link already used."}, status=status.HTTP_400_BAD_REQUEST)
        decoded_token = jwt.decode(token, key=env("TOKEN_SECRET"), algorithms=["HS256"])
        user_name = decoded_token.get("username")
        user = CustomUser.objects.get(user_name=user_name)
        user.set_password(password)
        user.save()
        BlackListedPasswordResetTokens.objects.create(token=token)
        return Response({ "detail": "Password changed successfully", "success": True }, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({ "detail": "User not found" } , status=status.HTTP_400_BAD_REQUEST)
    except jwt.ExpiredSignatureError:
        return Response({ "detail": "Link expired", "success": False }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response({"detail": "Something went wrong"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user(request, pk):
    image = None
    try:
        if request.user.id != pk:
            return Response({ "detail": "You are not allowed to perform this operation" }, status=status.HTTP_400_BAD_REQUEST)
        if request.data.get("profile_pic") != None:
            image = request.data.get("profile_pic")
        data = request.data
        print(data["email"])
        if None in data.values():
            return Response({ "detail": "Enter all values" }, status=status.HTTP_400_BAD_REQUEST)
        user = CustomUser.objects.get(pk=pk)
        user.first_name = data["first_name"]
        user.last_name = data["last_name"]
        temp_user = CustomUser.objects.filter(user_name=data["user_name"]) | CustomUser.objects.filter(email=data["email"])
        if temp_user.__len__() != 0:
            if temp_user[0].email == data["email"] and user.email != data["email"]:
                return Response({ "detail": "Email already taken." }, status=status.HTTP_400_BAD_REQUEST)
            if temp_user[0].user_name == data["user_name"] and user.user_name != data["user_name"]:
                return Response({ "detail": "Username already taken." }, status=status.HTTP_400_BAD_REQUEST)
        user.user_name = data["user_name"]
        user.email = data["email"]
        if image != None:
            #delete image before uplopading new one.
            uploader.destroy(public_id=user.profile_pic.public_id)
            user.profile_pic = image
        user.save()
        print(user)
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(e.__class__)
        return Response({ "detail": "Something went wrong", "error": e }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def check_password(request):
    password = request.data.get("password")
    if password == None or len(password) == 0:
        return Response({ "detail": "Password should not be null" }, status=status.HTTP_400_BAD_REQUEST)
    is_password_correct = request.user.check_password(password)
    if not is_password_correct:
        return Response({ "detail": "Password not valid." }, status=status.HTTP_400_BAD_REQUEST)
    return Response({ "success": is_password_correct }, status=status.HTTP_200_OK)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_password_when_logged_in(request):
    password = request.data.get("password")
    if password == None or len(password) == 0:
        return Response({ "detail": "Password should not be null" }, status=status.HTTP_400_BAD_REQUEST)
    user_name = request.user.user_name
    try:
        user = CustomUser.objects.get(user_name=user_name)
        user.set_password(password)
        user.save()
        return Response({ "detail": "Password changed successfully", "success": True }, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({ "detail": "User not found" } , status=status.HTTP_400_BAD_REQUEST)



def send_mail(user):
    update_password_link = generate_link(user_name=user.user_name)
    template_string = render_to_string("email_template.html", { "user": user, "link": update_password_link })
    email_subject = "Solve.io: Link to change password."
    email = EmailMultiAlternatives(
        subject=email_subject,
        from_email=EMAIL_HOST_USER,
        to=[user.email]
    )
    email.attach_alternative(template_string, "text/html")
    email.fail_silently = False
    email.send()

def generate_link(user_name):
    payload = {"exp": datetime.datetime.now(tz=pytz.utc) + timedelta(seconds=3600), "username": user_name }
    token = jwt.encode(payload=payload, key=env("TOKEN_SECRET"), algorithm="HS256")
    link = f"{CLIENT_URL}/update-password/{token}"
    return link