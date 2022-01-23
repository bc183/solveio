from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from .serializers import CommentSerializer
from .models import Answer, Comment, Post


@api_view(["GET"])
def get_comments(reuqest, post_id, type):
    if type == "QUESTION":
        comments = Comment.objects.filter(post__id=post_id)
    elif type == "ANSWER":
        comments = Comment.objects.filter(answer__id=post_id)
    else:
        return Response({ "detail": "Type is not supported." }, status=status.HTTP_400_BAD_REQUEST)
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_comment(request, pk):
    serializer = CommentSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.data
    user = request.user
    print(user)
    if data["type"] == "QUESTION":
        try:
            post = Post.objects.get(pk=pk)
            saved_comment = Comment.objects.create(
                comment=data["comment"],
                type=data["type"],
                user=user,
                post=post
            )
            serializer = CommentSerializer(saved_comment, many=False)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Post.DoesNotExist:
            return Response({ "detail": "Post not found" }, status=status.HTTP_404_NOT_FOUND)
    elif data["type"] == "ANSWER":
        try:
            answer = Answer.objects.get(pk=pk)
            saved_comment = Comment.objects.create(
                comment=data["comment"],
                type=data["type"],
                user=user,
                answer=answer
            )
            serializer = CommentSerializer(saved_comment, many=False)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Answer.DoesNotExist:
            return Response({ "detail": "Answer not found" }, status=status.HTTP_404_NOT_FOUND)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_comment(request, pk):
    serializer = CommentSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.data
    user = request.user
    try:
        comment = Comment.objects.get(pk=pk)
        if comment.user != user:
            Response({ "detail": "You don't have permission to perform this operation" }, status=status.HTTP_403_FORBIDDEN)
        comment.comment = data["comment"]
        comment.save()
        serializer = CommentSerializer(comment, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Comment.DoesNotExist:
        return Response({ "detail": "Comment not found" }, status=status.HTTP_404_NOT_FOUND)    

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_comment(request, pk):
    try:
        comment = Comment.objects.get(pk=pk)
        if comment.user != request.user:
            return Response({ "error": "You don't have permission to do this operation." })
        comment.delete()
        return Response(True, status=status.HTTP_200_OK)
    except:
        return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)