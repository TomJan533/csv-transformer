from django.contrib import admin
from django.urls import path

from api.views import CSVUploadView, HealthCheckAPIView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health-check/", HealthCheckAPIView.as_view(), name="health-check"),
    path("api/upload-csv/", CSVUploadView.as_view(), name="upload-csv"),
]
