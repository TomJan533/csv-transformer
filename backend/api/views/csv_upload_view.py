import csv

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import CSVRecord
from api.serializers import CSVRecordSerializer


class CSVUploadView(APIView):

    def post(self, request, *args, **kwargs):
        file = request.FILES["file"]
        if not file.name.endswith(".csv"):
            return Response(
                {"error": "This is not a CSV file"}, status=status.HTTP_400_BAD_REQUEST
            )

        decoded_file = file.read().decode("utf-8").splitlines()
        reader = csv.DictReader(decoded_file)

        records = []
        for row in reader:
            serializer = CSVRecordSerializer(data={"data": row})
            if serializer.is_valid():
                serializer.save()
                records.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"records": records}, status=status.HTTP_201_CREATED)
