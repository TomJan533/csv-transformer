from django.contrib import admin
from django.urls import path

from api.views import HealthCheckAPIView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health-check/", HealthCheckAPIView.as_view(), name="health-check"),
]
