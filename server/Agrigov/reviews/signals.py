from django.db.models import Avg, Count
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Review

@receiver(post_save, sender=Review)
@receiver(post_delete, sender=Review)
def update_product_ratings(sender, instance, **kwargs):
    product = instance.product
    # Aggregate all reviews for this product
    agg = product.reviews.aggregate(
        avg=Avg('rating'),
        cnt=Count('id')
    )
    product.average_rating = agg['avg'] or 0.0
    product.review_count = agg['cnt'] or 0
    product.save(update_fields=['average_rating', 'review_count'])