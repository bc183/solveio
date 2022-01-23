from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from .models import Tag

from users.serializers import UserSerializer

from .pagination import StandardResultsSetPagination
from .serializers import AnswerSerializer, CommentSerializer, PostSerializer, TagSerializer, VoteSerializer
from users.models import CustomUser

@api_view(["GET"])
def get_popular_users(request):
    users = CustomUser.objects.raw(f"SELECT * FROM users_customuser AS t1 ORDER BY(SELECT COUNT(*) FROM base_answer AS t2 WHERE t1.id = t2.user_id) DESC LIMIT 10;")
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def get_trending_tags(request):
    trending_tags = Tag.objects.raw(f"SELECT * FROM base_tag ORDER BY(SELECT COUNT(*) FROM base_post_tags WHERE tag_id = base_tag.id GROUP BY(tag_id)) DESC LIMIT 30;")
    serializer = TagSerializer(trending_tags, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
