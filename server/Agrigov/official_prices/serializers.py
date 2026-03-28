from rest_framework import serializers
from .models import OfficialPrice


class OfficialPriceSerializer(serializers.ModelSerializer):
    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = OfficialPrice
        fields = [
            'id',
            'product_name',
            'wilaya',
            'min_price',
            'max_price',
            'unit',
            'valid_from',
            'valid_until',
            'is_active',
        ]

    def validate(self, data):
        if data['min_price'] > data['max_price']:
            raise serializers.ValidationError("Invalid price range")
        return data