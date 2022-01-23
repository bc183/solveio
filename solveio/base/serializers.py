import collections
from typing import OrderedDict
from rest_framework import serializers
from .models import Answer, Comment, Post, Tag, Vote
from users.serializers import UserSerializer
from users.models import CustomUser

class TagSerializer(serializers.ModelSerializer):

    no_of_posts = serializers.SerializerMethodField()

    def get_no_of_posts(self, data):
        posts = data.post_set.all()
        return posts.__len__()

    class Meta:
        model = Tag
        fields = "__all__"

class PostSerializer(serializers.ModelSerializer):

    user = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    up_votes = serializers.SerializerMethodField()
    down_votes = serializers.SerializerMethodField()
    user_vote = serializers.SerializerMethodField()
    answers = serializers.SerializerMethodField()


    def get_user(self, data): 
        if type(data) is collections.OrderedDict:
            return None
        user = CustomUser.objects.get(pk=data.user.id)
        serializer = UserSerializer(user, many=False)
        return serializer.data

    def get_comments(self, data):
        if type(data) is collections.OrderedDict:
            return None
        comments = data.comment_set.all()
        serializer = CommentSerializer(comments, many=True)
        return serializer.data.__len__()

    def get_answers(self, data):
        if type(data) is collections.OrderedDict:
            return None
        answers = data.answer_set.all()
        serializer = AnswerSerializer(answers, many=True)
        return serializer.data.__len__()

    def get_up_votes(self, data):
        if type(data) is collections.OrderedDict:
            return None
        up_votes = data.vote_set.filter(vote=1)
        return up_votes.__len__()
    
    def get_down_votes(self, data):
        if type(data) is collections.OrderedDict:
            return None
        up_votes = data.vote_set.filter(vote=-1)
        return up_votes.__len__()

    def get_rating(self, data):
        if type(data) is collections.OrderedDict:
            return None
        votes = data.vote_set.all()
        serializer = VoteSerializer(votes, many=True)
        data = serializer.data
        if len(data) == 0:
            return 0
        total_votes = 0
        for vote in votes:
            total_votes += vote.vote
        return total_votes

    def get_user_vote(self, data):
        if type(data) is collections.OrderedDict:
            return None
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
            if user.id == None:
                return None
        vote = Vote.objects.filter(user=user, post=data)
        if vote.__len__() == 0:
            return None
        else:
            return vote[0].vote

    
    class Meta:
        model = Post
        fields = "__all__"
        read_only_fields = ("user", "comments", "rating", "tags")
        depth = 1

class CommentSerializer(serializers.ModelSerializer):

    user = serializers.SerializerMethodField()

    def get_user(self, data): 
        if type(data) is collections.OrderedDict:
            return None
        user = CustomUser.objects.get(pk=data.user.id)
        serializer = UserSerializer(user, many=False)
        return serializer.data

    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = ("user", "post", "answer")

class VoteSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Vote
        fields = "__all__"
        read_only_fields = ("user", "post", "answer")

class AnswerSerializer(serializers.ModelSerializer):
    
    user = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    up_votes = serializers.SerializerMethodField()
    down_votes = serializers.SerializerMethodField()
    user_vote = serializers.SerializerMethodField()


    def get_user(self, data): 
        if type(data) is collections.OrderedDict:
            return None
        user = CustomUser.objects.get(pk=data.user.id)
        serializer = UserSerializer(user, many=False)
        return serializer.data

    def get_comments(self, data):
        if type(data) is collections.OrderedDict:
            return None
        comments = data.comment_set.all()
        serializer = CommentSerializer(comments, many=True)
        return serializer.data.__len__()

    def get_up_votes(self, data):
        if type(data) is collections.OrderedDict:
            return None
        up_votes = data.vote_set.filter(vote=1)
        return up_votes.__len__()
    
    def get_down_votes(self, data):
        if type(data) is collections.OrderedDict:
            return None
        up_votes = data.vote_set.filter(vote=-1)
        return up_votes.__len__()

    def get_rating(self, data):
        if type(data) is collections.OrderedDict:
            return None
        votes = data.vote_set.all()
        serializer = VoteSerializer(votes, many=True)
        data = serializer.data
        if len(data) == 0:
            return 0
        total_votes = 0
        for vote in votes:
            total_votes += vote.vote
        return total_votes

    def get_user_vote(self, data):
        if type(data) is collections.OrderedDict:
            return None
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
            if user.id == None:
                return None
        vote = Vote.objects.filter(user=user, answer=data)
        if vote.__len__() == 0:
            return None
        else:
            return vote[0].vote

    
    class Meta:
        model = Answer
        fields = "__all__"
        read_only_fields = ("user", "comments", "post")
