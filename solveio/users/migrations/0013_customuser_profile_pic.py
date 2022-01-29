# Generated by Django 4.0 on 2022-01-28 15:22

import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0012_remove_customuser_profile_pic'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='profile_pic',
            field=cloudinary.models.CloudinaryField(default='https://res.cloudinary.com/solveio/image/upload/v1643299439/profiledefault_4x_w6kmiu.png', max_length=255, verbose_name='profile_pic'),
        ),
    ]
