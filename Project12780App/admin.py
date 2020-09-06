# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from .models import Task
from .models import Category
from django.contrib import admin

# Register your models here.
admin.site.register(Task)
admin.site.register(Category)