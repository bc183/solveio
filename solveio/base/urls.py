from django.urls import path

from .search_views import search, search_in_tags, search_in_users

from .statistic_views import get_popular_users, get_trending_tags

from .answer_views import create_answer, delete_answer, get_answer, get_answers_for_post, get_answers_for_user, update_answer
from .comment_views import create_comment, delete_comment, get_comments, update_comment
from .posts_views import PostsView, get_post_by_id, get_all_posts, get_posts_for_user, update_post, delete_post, create_vote

urlpatterns = [
    path("posts/", PostsView.as_view(), name="posts"),
    path("posts/all/", get_all_posts, name="get_all_posts"),
    path("posts/<int:pk>/", get_post_by_id, name="get_post_id"),
    path("posts/vote/<int:pk>/", create_vote, name="create_vote"),
    path("posts/update/<int:pk>/", update_post, name="update_post"),
    path("posts/delete/<int:pk>/", delete_post, name="delete_post"),
    path("posts/user/<int:user_id>/", get_posts_for_user, name="get_post_id"),

    path("comment/<int:pk>/", create_comment, name="create_comment"),
    path("comment/<int:post_id>/<str:type>/", get_comments, name="get_comments"),
    path("comment/update/<int:pk>/", update_comment, name="update_comment"),
    path("comment/delete/<int:pk>/", delete_comment, name="delete_comment"),

    path("answers/<int:post_id>/", create_answer, name="create_answer"),
    path("answers/get/<int:pk>/", get_answer, name="get_answer"),
    path("answers/update/<int:pk>/", update_answer, name="update_answer"),
    path("asnwers/delete/<int:pk>/", delete_answer, name="delete_answer"),
    path("answers/all/<int:post_id>/", get_answers_for_post, name="get_answers_for_post"),
    path("answers/user/<int:user_id>/", get_answers_for_user, name="get_answers_for_user"),

    path("get-popular-users/", get_popular_users, name="get_popular_users"),
    path("get-trending-tags/", get_trending_tags, name="get_trending_tags"),

    path("search/<str:k>/", search, name="search"),
    path("search-tag/<str:k>/", search_in_tags, name="search_in_tags"),
    path("search-users/<str:k>/", search_in_users, name="search_in_users"),

]