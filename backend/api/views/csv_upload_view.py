import csv
import hashlib
import logging

from django.core.exceptions import ValidationError
from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import CSVFile, CSVRecord
from api.serializers import CSVRecordSerializer

logger = logging.getLogger(__name__)


class CSVUploadView(APIView):

    def post(self, request, *args, **kwargs):
        file = request.FILES.get("file")

        if not file:
            return Response(
                {"error": "No file was provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not file.name.endswith(".csv"):
            return Response(
                {"error": "This is not a CSV file"}, status=status.HTTP_400_BAD_REQUEST
            )

        file_hash = self.calculate_hash(file)

        if CSVFile.objects.filter(file_hash=file_hash).exists():
            return Response(
                {"error": "This file already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        csv_file_instance = None

        try:
            with transaction.atomic():
                csv_file_instance = CSVFile(file_name=file.name, file_hash=file_hash)
                csv_file_instance.save()

                file.seek(0)
                content = file.read()
                decoded_file = content.decode("utf-8").splitlines()

                reader = csv.DictReader(decoded_file)

                records = []
                errors = []

                for row in reader:
                    serializer = CSVRecordSerializer(data=row)
                    if serializer.is_valid():
                        serializer.save(csv_file=csv_file_instance)
                        records.append(serializer.data)
                    else:
                        errors.append(serializer.errors)

                if errors:
                    raise ValidationError(
                        {"detail": errors}
                    )  # Wrap errors in a dictionary

        except ValidationError as e:
            logger.error(f"ValidationError: {e}")
            if hasattr(e, "message_dict"):
                return Response(
                    {"errors": e.message_dict}, status=status.HTTP_400_BAD_REQUEST
                )
            else:
                return Response({"errors": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Exception: {e}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({"records": records}, status=status.HTTP_201_CREATED)

    def calculate_hash(self, file):
        sha256 = hashlib.sha256()
        for chunk in file.chunks():
            sha256.update(chunk)
        return sha256.hexdigest()
