from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.kafka_utils.producer import send_message


class PublishMessageView(APIView):
    def post(self, request):
        message = request.data.get("message", "")
        if message:
            send_message("your_topic", message)
            return Response({"status": "Message sent"}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "No message provided"}, status=status.HTTP_400_BAD_REQUEST
            )
