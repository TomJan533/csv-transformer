from rest_framework import generics

from api.models import UserActionLog
from api.serializers import UserActionLogSerializer

# from rest_framework.permissions import IsAuthenticated #TODO add user in the future


class UserActionLogListView(generics.ListAPIView):
    queryset = UserActionLog.objects.all()
    serializer_class = UserActionLogSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # return UserActionLog.objects.filter(user=self.request.user)
        return UserActionLog.objects.all()
