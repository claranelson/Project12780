# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from .models import Task
from .models import Category
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render
from django.core import serializers
import datetime
import json

# Create your views here.
def loadTasks(request):
    tasks = Task.objects.all()
#     values = tasks.values('id','TaskName')# 
#     print(values)
#     jsonresponse = JsonResponse({'Tasks': list(tasks)})
#     print(jsonresponse)
#     jsonthing = json.dumps(tasks)
#     print(jsonthing)
    json = serializers.serialize('json',tasks)
#     print(json)

#     result = ""# 
#     for task in tasks:
#         result = result + str(task.id) + ","
#         result = result + task.TaskName + ","
#         result = result + task.Description + ","
#         result = result + str(task.StartDate) + ","
#         result = result + str(task.DueDate) + ","
#         result = result + task.Categories + ","
#         result = result + str(task.Status) + ","
#         result = result + str(task.Progress) + ";"
# 
#     result = result[:-1] #to remove last semicolon


#     return HttpResponse(result)
    return HttpResponse(json)

def addTask(request):

    json_obj = json.loads(request.body)

    newtask = Task(TaskName = json_obj["TaskName"],
                   Description = json_obj["Description"],
                   DueDate = json_obj["DueDate"],
                   StartDate= json_obj["StartDate"],
                   Categories = json_obj["Categories"],
                   Progress = json_obj["Progress"],
                   Status = json_obj["Status"])
    newtask.save()

    return HttpResponse("")

def editTask(request):
    json_obj = json.loads(request.body)
    idget = json_obj["ID"]
    t = Task.objects.get(id=idget)
    t.TaskName = json_obj["TaskName"]
    t.Description = json_obj["Description"]
    t.DueDate = json_obj["DueDate"]
    t.StartDate = json_obj["StartDate"]
    t.Categories = json_obj["Categories"]
    t.Progress = json_obj["Progress"]
    t.Status = json_obj["Status"]
    t.save()
    #some of this from https://stackoverflow.com/questions/3681627/how-to-update-fields-in-a-model-without-creating-a-new-record-in-django

    return HttpResponse("")

def editTaskstatus(request):

    stat = request.GET["Status"]
    idget = request.GET["ID"]
    t = Task.objects.get(id=idget)
    t.Status = stat
    t.save()
    #some of this from https://stackoverflow.com/questions/3681627/how-to-update-fields-in-a-model-without-creating-a-new-record-in-django

    return HttpResponse("")

def filter(request):
    kwargs = {}
    stat = request.GET["stat"]
    if stat != "N/A":
        kwargs["Status__startswith"] = stat

    cat = request.GET["cat"]
    if cat != "N/A":
        kwargs["Categories__startswith"] = cat

    try:
        name = request.GET["namefilt"]
        kwargs["TaskName__contains"] = name
    except:
        pass
    current = request.GET["cur"]

    #for current, we need today's date to be greater than the start date and less than the end date
    if current == "Yes":
        today = datetime.date.today()
        end = "DueDate__gte"
        start = "StartDate__lte"
        kwargs[start] = today
        kwargs[end] = today

    tasks = Task.objects.filter(**kwargs)

    #now this is just like loadtasks again

    json = serializers.serialize('json',tasks)
    # result = ""
    # for task in tasks:
    #     result = result + str(task.id) + ","
    #     result = result + task.TaskName + ","
    #     result = result + task.Description + ","
    #     result = result + str(task.StartDate) + ","
    #     result = result + str(task.DueDate) + ","
    #     result = result + task.Categories + ","
    #     result = result + str(task.Status) + ","
    #     result = result + str(task.Progress) + ";"

    # result = result[:-1]  # to remove last semicolon

    return HttpResponse(json)

def loadCats(request):
    cats = Category.objects.all()
    # result = ""
    # for cat in cats:
    #     result = result + str(cat.id) + ","
    #     result = result + cat.CatName + ","
    #     result = result + cat.Color + ";"

    # result = result[:-1]  # to remove last semicolon
    json = serializers.serialize('json',cats)

    return HttpResponse(json)

def addCategory(request):
    catname = request.GET["CatName"]
    color = request.GET["Color"]

    newcat = Category(CatName = catname, Color = color)
    newcat.save()

    return HttpResponse("")
