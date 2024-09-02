import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

logger = logging.getLogger(__name__)


class CSVEnrichmentView(APIView):
    def post(self, request, *args, **kwargs):
        # Extract data from request
        file_id = request.data.get("fileId")
        selected_column = request.data.get("selectedColumn")
        url = request.data.get("url")
        second_dropdown_value = request.data.get("secondDropdownValue")

        # Log the received data
        logger.info(
            f"Received enrichment request: fileId={file_id}, selectedColumn={selected_column}, url={url}, secondDropdownValue={second_dropdown_value}"
        )

        # Validate data
        if not all([file_id, selected_column, url, second_dropdown_value]):
            return Response(
                {"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Respond with success
        return Response(
            {"message": "Data received successfully"}, status=status.HTTP_200_OK
        )
