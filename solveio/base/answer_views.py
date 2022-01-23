from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response

from .pagination import StandardResultsSetPagination
from .serializers import AnswerSerializer
from .models import Answer, Post


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_answer(request, post_id):
    serializer = AnswerSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.data
    user = request.user
    try:
        post = Post.objects.get(pk=post_id)
        answer = Answer.objects.create(
            body=data["body"],
            code_body=data.get("code_body"),
            user=user,
            post=post
        )
        serializer = AnswerSerializer(answer, many=False, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Post.DoesNotExist:
        return Response({ "detail": "Post not found" }, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({ "detail": "Something went wrong" }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_answer(request, pk):
    serializer = AnswerSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.data
    user = request.user
    try:
        answer = Answer.objects.get(pk=pk)
        if answer.user != user:
            Response({ "detail": "You don't have permission to perform this operation" }, status=status.HTTP_403_FORBIDDEN)
        answer.body=data["body"]
        answer.code_body=data.get("code_body")
        answer.save()
        serializer = AnswerSerializer(answer, many=False, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Answer.DoesNotExist:
        return Response({ "detail": "Answer not found" }, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({ "detail": "Something went wrong" }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_answers_for_post(request, post_id):
    answers = Answer.objects.raw(f"SELECT * FROM base_answer WHERE post_id = {post_id} ORDER BY(SELECT COALESCE(SUM(vote),0) FROM base_vote WHERE answer_id = base_answer.id) DESC, base_answer.created_at DESC")
    paginator = StandardResultsSetPagination()
    result_page = paginator.paginate_queryset(answers, request=request)
    serializer = AnswerSerializer(result_page, many=True, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_answer(request, pk):
    try:
        answer = Answer.objects.get(pk=pk)
        serializer = AnswerSerializer(answer, many=False, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Answer.DoesNotExist:
        return Response({ "detail": "Answer not found" }, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({ "detail": "Something went wrong" }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_answer(request, pk):
    try:
        answer = Answer.objects.get(pk=pk)
        if answer.user != request.user:
            return Response({ "error": "You don't have permission to do this operation." })
        answer.delete()
        return Response(True, status=status.HTTP_200_OK)
    except Answer.DoesNotExist:
        return Response({"error": "Answer not found"}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({ "detail": "Something went wrong" }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_answers_for_user(request, user_id):
    answers = Answer.objects.filter(user__id=user_id)
    paginator = StandardResultsSetPagination()
    result_page = paginator.paginate_queryset(answers, request=request)
    serializer = AnswerSerializer(result_page, many=True, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)
