from django.conf.urls import url

from cosite.MainBundle.Controller import NavbarController
from cosite.MainBundle.Controller import DefaultController
__author__ = 'Jie.xu'

urlpatterns = [
    url(r'homepage', DefaultController.homepage ,name='homepage'),
]

