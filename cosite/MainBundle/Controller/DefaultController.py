from cosite.BaseBundle.Controller import BaseController
from django.shortcuts import render, HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect

@csrf_exempt
def homepage(req):
    return  render(req, 'homepage.html')