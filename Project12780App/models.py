# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Task(models.Model):
    TaskName = models.CharField(max_length = 30)
    Description = models.CharField(max_length = 30)
    StartDate = models.DateField()
    DueDate = models.DateField()
    Categories = models.CharField(max_length = 100)
    Progress = models.IntegerField()
    Status = models.CharField(max_length = 20)
    User = models.CharField(max_length = 40)

class Category(models.Model):
    CatName = models.CharField(max_length = 40)
    Color = models.CharField(max_length= 20)
