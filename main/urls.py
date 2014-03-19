__author__ = 'murad'

from django.conf.urls import patterns, include, url
from main.views import *

ADMIN_URL = "admin/"

urlpatterns = patterns('main.views',
                       url(r"^$", index),
                       url(r"^"+ADMIN_URL+"$", admin),
                       url(r"^"+ADMIN_URL+"points/read/$", Points.read),
                       url(r"^"+ADMIN_URL+"points/create/$", Points.create),
                       url(r"^"+ADMIN_URL+"points/update/$", Points.update),
                       url(r"^"+ADMIN_URL+"points/destroy/$", Points.destroy),
                       url(r"^"+ADMIN_URL+"points/set_instruction/$", Points.set_instruction),

                       url(r"^"+ADMIN_URL+"info/read/$", Info.read),
                       url(r"^"+ADMIN_URL+"info/create/$", Info.create),
                       url(r"^"+ADMIN_URL+"info/update/$", Info.update),
                       url(r"^"+ADMIN_URL+"info/destroy/$", Info.destroy),

                       url(r"^"+ADMIN_URL+"point/read/$", Point.read),
)
