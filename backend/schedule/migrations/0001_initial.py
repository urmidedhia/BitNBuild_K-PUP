# Generated by Django 4.0.3 on 2023-01-28 21:47

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=50)),
                ('desc', models.CharField(max_length=100)),
                ('is_restock', models.BooleanField(default=False)),
                ('is_dispatch', models.BooleanField(default=False)),
                ('is_done', models.BooleanField(default=False)),
            ],
        ),
    ]
