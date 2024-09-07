from rest_framework import generics
from rest_framework.pagination import PageNumberPagination

from api.models import CSVFile, CSVRecord
from api.serializers import CSVRecordSerializer


# Custom Pagination class (optional)
class CSVRecordPagination(PageNumberPagination):
    page_size = 10  # Number of records per page
    page_size_query_param = (
        "page_size"  # Allow users to specify page size in the query param
    )
    max_page_size = 100  # Limit the maximum number of records per page


class CSVFileContentView(generics.ListAPIView):
    serializer_class = CSVRecordSerializer
    pagination_class = CSVRecordPagination  # Use the custom pagination class

    def get_queryset(self):
        pk = self.kwargs["pk"]  # Get the primary key from the URL
        try:
            csv_file = CSVFile.objects.get(pk=pk)  # Fetch the CSV file
            return CSVRecord.objects.filter(
                csv_file=csv_file
            )  # Filter records by CSV file
        except CSVFile.DoesNotExist:
            return []
