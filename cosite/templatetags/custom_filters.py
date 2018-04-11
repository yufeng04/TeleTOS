from django import template
from django.template.defaultfilters import stringfilter
import json
from django.utils.translation import ugettext as _

register = template.Library()

@register.filter(is_safe=True)
@stringfilter
def json_decode(value):
    return json.dumps(value)

@register.filter(is_safe=True)
@stringfilter
def json_encode(value):
    return json.loads(value)


@register.filter(is_safe=True)
@stringfilter
def in_array(needle, haystack):
    if needle in haystack:
        return True
    else:
        return False


@register.filter(is_safe=True)
@stringfilter
def trans(value):
    return  _(value)

