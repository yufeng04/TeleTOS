from cosite.BaseBundle.Controller import BaseController
from django.shortcuts import render, HttpResponseRedirect, HttpResponse


def login(req):
    return render(req, 'Secured/login.html')

