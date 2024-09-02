from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import CSVFile, CSVRecord
from api.serializers import CSVRecordSerializer


class CSVFileContentView(APIView):
    def get(self, request, pk):
        try:
            csv_file = CSVFile.objects.get(pk=pk)
            records = CSVRecord.objects.filter(csv_file=csv_file)
            serializer = CSVRecordSerializer(records, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except CSVFile.DoesNotExist:
            return Response(
                {"error": "CSV file not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
