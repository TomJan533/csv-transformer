from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.kafka_utils.consumer import get_message


class GetKafkaMessageView(APIView):
    def get(self, request):
        message = get_message()
        if message:
            return Response({"message": message}, status=status.HTTP_200_OK)
        return Response(
            {"error": "No messages found"}, status=status.HTTP_404_NOT_FOUND
        )
