from django.db import models


class Points(models.Model):
    name = models.CharField(max_length=20)
    x = models.IntegerField(max_length=5)
    y = models.IntegerField(max_length=5)
    state = models.CharField(max_length=5)
    instruction_title = models.CharField(max_length=50)
    instruction_text = models.TextField()


class Info(models.Model):
    title = models.CharField(max_length=100)
    state = models.CharField(max_length=5, null=True)
    level = models.CharField(max_length=15)
    ext1 = models.CharField(max_length=30, null=True)
    point = models.ForeignKey("Points", null=True)
