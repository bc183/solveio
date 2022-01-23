from tkinter.tix import Tree
from django.db import models
from django.utils import module_loading
from users.models import CustomUser

# Create your models here.
class Tag(models.Model):
    tag = models.CharField(max_length=100, blank=False, unique=True)

    def __str__(self):
        return self.tag


class Post(models.Model):
    title = models.CharField(max_length=255, blank=False)
    body = models.TextField(blank=False)
    code_body = models.TextField(null=True)
    language = models.TextField(max_length=10, null=True)
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class Answer(models.Model):
    body = models.TextField(blank=False)
    code_body = models.TextField(null=True)
    post = models.ForeignKey(to=Post, on_delete=models.CASCADE)
    language = models.TextField(max_length=10, null=True)
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.body

    def save(self, *args, **kwargs):

        return super(Answer, self).save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']

class Comment(models.Model):
    QUESTION = "QUESTION"
    ANSWER = "ANSWER"
    vote_type_choices = (
        (QUESTION, "Question"),
        (ANSWER, "Answer"),
    )
    comment = models.TextField(blank=False)
    type = models.CharField(max_length=10, choices=vote_type_choices, null=False)
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(to=Post, on_delete=models.CASCADE, null=True)
    answer = models.ForeignKey(to=Answer, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

class Vote(models.Model):
    UP_VOTE = 1
    DOWN_VOTE = -1
    vote_choices = (
        (UP_VOTE, 1),
        (DOWN_VOTE, -1)
    )
    QUESTION = "QUESTION"
    ANSWER = "ANSWER"
    vote_type_choices = (
        (QUESTION, "Question"),
        (ANSWER, "Answer"),
    )
    vote = models.IntegerField(blank=False, choices=vote_choices, null=False)
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(to=Post, on_delete=models.CASCADE, null=True)
    answer = models.ForeignKey(to=Answer, on_delete=models.CASCADE, null=True)
    type = models.CharField(max_length=10, choices=vote_type_choices, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
