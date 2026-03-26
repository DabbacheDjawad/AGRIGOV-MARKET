from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .services import DashboardService


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == 'FARMER':
            data = DashboardService.get_farmer_dashboard(user)

        elif user.role == 'BUYER':
            data = DashboardService.get_buyer_dashboard(user)

        elif user.role == 'TRANSPORTER':
            data = DashboardService.get_transporter_dashboard(user)

        elif user.role == 'ADMIN':
            data = DashboardService.get_admin_dashboard()

        else:
            return Response({"error": "Invalid role"}, status=400)

        return Response({
            "role": user.role,
            "data": data
        })