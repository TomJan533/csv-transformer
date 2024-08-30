from rest_framework import generics

from api.models import CSVFile
from api.serializers import CSVFileSerializer


class CSVFileListView(generics.ListAPIView):
    queryset = CSVFile.objects.all()
    serializer_class = CSVFileSerializer
