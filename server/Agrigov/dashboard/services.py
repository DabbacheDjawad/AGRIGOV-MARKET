from django.db.models import Avg, F, Sum

from orders.models import Order, OrderItem
from products.models import Product
from reviews.models import Review
from users.models import BuyerProfile


class DashboardService:

    @staticmethod
    def get_farmer_dashboard(user):
        farms = user.farmer_profile.user.farm_set.all()

        products = Product.objects.filter(farm__farmer=user)

        total_products = products.count()

        total_orders = OrderItem.objects.filter(
            product__farm__farmer=user
        ).count()

        total_revenue = OrderItem.objects.filter(
            product__farm__farmer=user,
            order__status='delivered'
        ).aggregate(total=Sum(F('price') * F('quantity')))['total'] or 0

        avg_rating = products.aggregate(
            avg=Avg('average_rating')
        )['avg'] or 0

        return {
            "total_products": total_products,
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "average_rating": round(avg_rating, 2),
        }

    @staticmethod
    def get_buyer_dashboard(user):
        buyer = user.buyer_profile

        total_orders = Order.objects.filter(buyer=buyer).count()

        total_spent = Order.objects.filter(
            buyer=buyer,
            status='delivered'
        ).aggregate(total=Sum('total_price'))['total'] or 0

        total_reviews = Review.objects.filter(buyer=buyer).count()

        return {
            "total_orders": total_orders,
            "total_spent": total_spent,
            "total_reviews": total_reviews,
        }

    @staticmethod
    def get_transporter_dashboard(user):
        transporter = user.transporter_profile

        total_deliveries = Order.objects.filter(
            transporter=transporter,
            status='delivered'
        ).count()

        active_deliveries = Order.objects.filter(
            transporter=transporter,
            status='shipped'
        ).count()

        return {
            "total_deliveries": total_deliveries,
            "active_deliveries": active_deliveries,
        }

    @staticmethod
    def get_admin_dashboard():
        from django.contrib.auth import get_user_model

        User = get_user_model()

        return {
            "total_users": User.objects.count(),
            "total_buyers": BuyerProfile.objects.count(),
            "total_products": Product.objects.count(),
            "total_orders": Order.objects.count(),
            "total_revenue": Order.objects.filter(status='delivered').aggregate(total=Sum('total_price'))['total'] or 0,
            "total_reviews": Review.objects.count(),
        }