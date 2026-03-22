from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Farm(models.Model):
    farmer = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="farm"
    )

    name = models.CharField(max_length=255)
    wilaya = models.CharField(max_length=100)
    baladiya = models.CharField(max_length=100)
    farm_size = models.FloatField()
    address = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.farmer.email}"