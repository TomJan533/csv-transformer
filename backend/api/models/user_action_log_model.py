from django.db import models


class UserActionLog(models.Model):
    # TODO: add user in future
    # user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # return f"{self.user.username} - {self.action} at {self.timestamp}"
        return f"{self.action} at {self.timestamp}"
