from cosite.BaseBundle.Controller import BaseController
from django.shortcuts import render, HttpResponseRedirect, HttpResponse
from django.utils import translation
from django.urls import reverse
from django.conf import settings

import json
def index(request):
    data = getattr(settings, 'LANGUAGES', "")
    return render(request, 'Language/index.html',{})

def set_language(req) :
    if req.method == 'POST':
        params = req.POST
        translation.activate(params['language'])
        #req.session[translation.LANGUAGE_SESSION_KEY] = params['language']
    return HttpResponseRedirect(reverse('language_index'))