from django.contrib import admin
from cosite.models import DetectedParams


@admin.register(DetectedParams)
class DetectedParams(admin.ModelAdmin):
    list_display = ['add_time', 'ave_anneal_soak_t',
                    'ave_anneal_rapid_cool_outlet_t', 'ave_anneal_slow_cool_outlet_t',
                    'finishing_inlet_t', 'finishing_outlet_t', 'coiling_t',
                    'pc', 'pmn', 'pp', 'ps']
    ordering = ['-add_time']
    list_filter = ['add_time']
