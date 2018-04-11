from django.conf.urls import url

from cosite import views

__author__ = 'Yuvv'

urlpatterns = [

    url('^$', views.index),
    url('query/$', views.data_query),
    url('show/$', views.data_show),

    # delete begin - 20170517
    # url('except/$', views.exception_detect),
    # url('analyze/$', views.relation_analyze),
    # url('test/$', views.relation_test),
    # url('commit-data/$', views.commit_data),
    # delete end - 20170517

    # join from XinRan - 20170517
    url('user_profile/$', views.user_profile),
    url('pages_sign-in/$', views.pages_sign_in),
    url('pages_forgot-password/$', views.pages_forgot_password),
    url('pages_lock-screen/$', views.pages_lock_screen),
    # url('report_vBRAS_session/$', views.report_session),
    url('report_vBRAS_frame/$', views.report_frame),

    # url('report_vBRAS_multi/$', views.report_multi),
]




