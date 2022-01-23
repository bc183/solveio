import collections
from rest_framework import serializers

from .models import CustomUser
import re
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['user_name'] = user.user_name
        # ...

        return token

class UserSerializer(serializers.ModelSerializer):

    answers = serializers.SerializerMethodField()

    def get_answers(self, data):
        if type(data) is collections.OrderedDict:
            return None
        answers = data.answer_set.all()
        return answers.__len__()

    class Meta:
        model = CustomUser
        fields = ["id", "user_name", "first_name", "last_name", "password", "start_date", "email", "answers"]
        read_only_fields=("id", "answers")
        extra_kwargs = {
            'password': {'write_only': True}
        }

    
    def is_email(self, email):
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        if re.fullmatch(regex, email):
            return True
        return False

    def create(self, validated_data):
        return CustomUser.objects.create_superuser(**validated_data)