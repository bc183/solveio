# Generated by Django 4.0 on 2022-01-27 15:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_customuser_profile_pic'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='about',
        ),
    ]
