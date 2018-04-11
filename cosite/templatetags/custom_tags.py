from django import template
from django.conf import settings
from django.template import defaulttags
register = template.Library()

@register.simple_tag(name="get_base_path")
def get_base_path():
    return getattr(settings ,'STATIC_URL')

@register.simple_tag(name="get_js_path")
def get_js_path():
    return get_base_path() + 'bundles/cosite/js/'

@register.simple_tag(name="get_setting_parameter")
def get_setting_parameter(name):
    return getattr(settings, name, "")

@register.simple_tag(name="asset")
def asset(value):
    return get_base_path() + value

