from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from users.models import User


class OfficialPrice(models.Model):
    UNIT_CHOICES = [
        ('kg', 'Kilogram'),
        ('ton', 'Ton'),
        ('box', 'Box'),
        ('bag', 'Bag'),
    ]

    product_name = models.CharField(max_length=255, db_index=True)

    wilaya = models.CharField(
        max_length=100,
        blank=True,
        help_text="Empty = national price"
    )

    min_price = models.DecimalField(max_digits=10, decimal_places=2)
    max_price = models.DecimalField(max_digits=10, decimal_places=2)

    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, default='kg')

    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField(null=True, blank=True)

    set_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-valid_from']
        indexes = [
            models.Index(fields=['product_name', 'wilaya']),
            models.Index(fields=['valid_from']),
        ]

    def clean(self):
        if self.min_price > self.max_price:
            raise ValidationError("min_price must be <= max_price")

        if self.valid_until and self.valid_from > self.valid_until:
            raise ValidationError("valid_from must be before valid_until")

    @property
    def is_active(self):
        now = timezone.now()
        if self.valid_from > now:
            return False
        if self.valid_until and self.valid_until < now:
            return False
        return True

    def __str__(self):
        loc = self.wilaya if self.wilaya else "National"
        return f"{self.product_name} ({loc}) {self.min_price}-{self.max_price}"