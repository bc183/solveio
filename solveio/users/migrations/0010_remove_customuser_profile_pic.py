# Generated by Django 4.0 on 2022-01-27 16:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_alter_customuser_profile_pic'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='profile_pic',
        ),
    ]
