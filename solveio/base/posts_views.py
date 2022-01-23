from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response

from .pagination import StandardResultsSetPagination
from .serializers import AnswerSerializer, PostSerializer, VoteSerializer
from .models import Answer, Post, Tag, Vote

# Create your views here.

class PostsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, many=False)
        serializer.is_valid(raise_exception=True)
        post = request.data
        tags = post.get("tags")
        saved_tags = []
        if tags != None:
            saved_tags = create_tags(tags)
        saved_post = Post.objects.create(
            title=post["title"], 
            body=post["body"],
            code_body=post.get("code_body"),
            language=post.get("language"), 
            user=request.user,
        )
        for saved_tag in saved_tags:
            saved_post.tags.add(saved_tag)
        serializer = self.serializer_class(saved_post, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_post(request, pk):
    serializer = PostSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    post_data = request.data
    try:
        post = Post.objects.get(pk=pk)
        if post.user != request.user:
            return Response({ "error": "You don't have permission to do this operation." })
        post.title=post_data["title"]
        post.body=post_data["body"]
        post.code_body=post_data.get("code_body")
        post.language=post_data.get("language")
        tags = post_data.get("tags")
        saved_tags = []
        if tags != None:
            saved_tags = create_tags(tags)
        for saved_tag in saved_tags:
            post.tags.add(saved_tag)
        post.save()
        serializer = PostSerializer(post, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_post(request, pk):
    try:
        post = Post.objects.get(pk=pk)
        if post.user != request.user:
            return Response({ "error": "You don't have permission to do this operation." })
        post.delete()
        return Response(True, status=status.HTTP_200_OK)
    except:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"])
def get_posts_for_user(request, user_id):
    posts = Post.objects.filter(user__id=user_id)
    paginator = StandardResultsSetPagination()
    result_page = paginator.paginate_queryset(posts, request=request)
    serializer = PostSerializer(result_page, many=True, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_post_by_id(request, pk):
    try:
        post = Post.objects.get(pk=pk)
        serializer = PostSerializer(post, many=False, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"])
def get_all_posts(request):
    posts = Post.objects.all()
    paginator = StandardResultsSetPagination()
    result_page = paginator.paginate_queryset(posts, request=request)
    serializer = PostSerializer(result_page, many=True, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_vote(request, pk):
    serializer = VoteSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.data
    user = request.user
    if data["type"] in ["QUESTION", "Question"]:
        try:
            post = Post.objects.get(pk=pk)
            vote = Vote.objects.filter(user=user, post=post)
            if vote.__len__() == 0:
                vote = Vote.objects.create(
                    vote=data["vote"],
                    user=user,
                    post=post,
                    type=data["type"]
                )
                serializer = PostSerializer(post, many=False, context={"request": request})
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                vote = vote[0]
                vote.vote = data["vote"]
                vote.save()
                serializer = PostSerializer(post, many=False, context={"request": request})
                return Response(serializer.data, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({ "detail": "Post not found" }, status=status.HTTP_404_NOT_FOUND)
    elif data["type"] in ["ANSWER", "Answer"]:
        try:
            answer = Answer.objects.get(pk=pk)
            vote = Vote.objects.filter(user=user, answer=answer)
            if vote.__len__() == 0:
                vote = Vote.objects.create(
                    vote=data["vote"],
                    user=user,
                    answer=answer,
                    type=data["type"]
                )
                serializer = AnswerSerializer(answer, many=False, context={"request": request})
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                vote = vote[0]
                vote.vote = data["vote"]
                vote.save()
                serializer = AnswerSerializer(answer, many=False, context={"request": request})
                return Response(serializer.data, status=status.HTTP_200_OK)
        except answer.DoesNotExist:
            return Response({ "detail": "Post not found" }, status=status.HTTP_404_NOT_FOUND)

def create_tags(tags):
    saved_tags = []
    for tag in tags:
        saved_tag = Tag.objects.get_or_create(tag=tag)
        saved_tags.append(saved_tag[0])
    return saved_tags



