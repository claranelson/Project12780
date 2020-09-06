"""Project12780 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.views.generic import TemplateView
from Project12780App.views import loadTasks
from Project12780App.views import addTask
from Project12780App.views import editTask
from Project12780App.views import editTaskstatus
from Project12780App.views import filter
from Project12780App.views import loadCats
from Project12780App.views import addCategory

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^listview/', TemplateView.as_view(template_name='listview.html')),
    url(r'^loadTasks/', loadTasks, name = "taskload"),
    url(r'^addTask/',addTask, name = "addtask"),
    url(r'^editTask/',editTask, name = "edittask"),
    url(r'^kanbanview/', TemplateView.as_view(template_name='kanbanview.html')),
    url(r'^editTaskstatus/',editTaskstatus, name = "edittaskstatus"),
    url(r'^filter/', filter, name = "filter"),
    url(r'^loadCats/', loadCats, name = "loadCats"),
    url(r'^categorymaker/', TemplateView.as_view(template_name='categorymaker.html')),
    url(r'^addCategory/', addCategory, name = "addCat"),
]
