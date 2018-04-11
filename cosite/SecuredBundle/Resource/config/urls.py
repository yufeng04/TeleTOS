from django.conf.urls import url

from cosite.SecuredBundle.Controller import SecuredController
from cosite.SecuredBundle.Controller import LanguageController
__author__ = 'Jie.xu'

urlpatterns = [
    url(r'language/set', LanguageController.set_language ,name='set_language'),
    url(r'language/index$', LanguageController.index ,name='language_index'),
    url(r'login/$',SecuredController.login ,name='secured_login'),
]

