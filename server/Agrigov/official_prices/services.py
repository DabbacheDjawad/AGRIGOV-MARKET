from django.utils import timezone
from django.db.models import Q
from .models import OfficialPrice


def get_active_price(product_name, wilaya=None):
    now = timezone.now()

    queryset = OfficialPrice.objects.filter(
        product_name__iexact=product_name,
        valid_from__lte=now
    ).filter(
        Q(valid_until__isnull=True) | Q(valid_until__gte=now)
    )

    if wilaya:
        regional = queryset.filter(wilaya=wilaya).first()
        if regional:
            return regional

    national = queryset.filter(wilaya='').first()
    return national


def validate_price(product_name, price, wilaya=None):
    price_range = get_active_price(product_name, wilaya)

    if not price_range:
        return False, None, f"No official price defined for {product_name}"

    if not (price_range.min_price <= price <= price_range.max_price):
        return False, price_range, (
            f"Price must be between {price_range.min_price} "
            f"and {price_range.max_price} {price_range.unit}"
        )

    return True, price_range, "Valid price"