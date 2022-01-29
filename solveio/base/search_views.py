from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from .serializers import PostSerializer
from .models import Post, Tag
from users.models import CustomUser
from users.serializers import UserSerializer
from .pagination import StandardResultsSetPagination

@api_view(["GET"])
def search(request, k):
    search_term = k.replace("+", " ")
    search_results = Post.objects.filter(title__icontains=search_term) | Post.objects.filter(body__icontains=search_term)
    paginator = StandardResultsSetPagination()
    paginated_search_results = paginator.paginate_queryset(search_results, request)
    serializer = PostSerializer(paginated_search_results, many=True, context = {"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def search_in_tags(request, k):
    search_term = k.replace("+", "_")
    tags = Tag.objects.filter(tag__contains=search_term)
    search_results = Post.objects.filter(tags__in=tags)
    paginator = StandardResultsSetPagination()
    paginated_search_results = paginator.paginate_queryset(search_results, request)
    serializer = PostSerializer(paginated_search_results, many=True, context = {"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def search_in_users(request, k):
    search_term = k.replace("+", "_")
    search_results = CustomUser.objects.filter(user_name__icontains=search_term)
    paginator = StandardResultsSetPagination()
    paginated_search_results = paginator.paginate_queryset(search_results, request)
    serializer = UserSerializer(paginated_search_results, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
