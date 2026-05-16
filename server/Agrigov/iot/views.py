from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import Avg, Min, Max
from datetime import timedelta

from .models import IoTDevice, SensorData, AlertThreshold, Alert
from .serializers import (
    IoTDeviceSerializer,
    SensorDataSerializer,
    AlertThresholdSerializer,
    AlertSerializer
)
from farms.models import Farm
from .ai_engine import AgriAIAdvisor
from missions.permissions import IsFarmer, IsAdmin

class IoTDataReceiveView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        mac_address = request.headers.get('X-ESP32-MAC', None)

        if not mac_address:
            mac_address = request.data.get('mac_address', None)

        if not mac_address:
            return Response(
                {'error': 'MAC address required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        mac_address = mac_address.strip().upper()

        print(f"📡 Received MAC: '{mac_address}'")
        print(f"📡 Request data: {request.data}")

        # Find device by MAC - AUTO-CREATE if not found
        device = IoTDevice.objects.filter(mac_address=mac_address, is_active=True).first()

        if not device:
            # AUTO-REGISTER: Create device for any new ESP32
            farm = Farm.objects.first()

            if not farm:
                return Response(
                    {'error': 'No farms exist in the system'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            device_id = f"ESP32_{mac_address.replace(':', '')[-6:]}"

            device = IoTDevice.objects.create(
                device_id=device_id,
                mac_address=mac_address,
                farm=farm,
                device_type='combined',
                is_active=True,
                is_recording=True  # Auto-start recording!
            )

            print(f"🆕 Auto-registered new device: {device_id} for farm: {farm.name}")
        from datetime import timedelta
        from django.utils import timezone
        import random
    
        if random.randint(1, 60) == 1:  # ~1.6% chance each request
            cutoff = timezone.now() - timedelta(days=3)
            deleted, _ = SensorData.objects.filter(recorded_at__lt=cutoff).delete()
            if deleted > 0:
                print(f"🧹 Auto-cleaned {deleted} old sensor readings (older than 3 days)")
                
        # Update last_seen
        device.last_seen = timezone.now()
        device.save()

        # Check if recording is ON
        if not device.is_recording:
            return Response(
                {
                    'status': 'ignored',
                    'message': 'Recording is stopped. Click Connect My ESP32 to start.'
                },
                status=status.HTTP_200_OK
            )

        # Save sensor data
        temperature = request.data.get('temperature')
        humidity = request.data.get('humidity')
        soil_moisture = request.data.get('soil_moisture')

        # 🔥 Fire detection fields
        fire_raw = request.data.get('fire_raw')
        fire_detected = request.data.get('fire_detected', False)
        if isinstance(fire_detected, str):
            fire_detected = fire_detected.lower() == 'true'
        fire_percent = request.data.get('fire_percent')

        # 💧 Rain detection fields
        rain_raw = request.data.get('rain_raw')
        rain_detected = request.data.get('rain_detected', False)
        if isinstance(rain_detected, str):
            rain_detected = rain_detected.lower() == 'true'
        rain_percent = request.data.get('rain_percent')

        sensor_data = SensorData.objects.create(
            device=device,
            temperature=temperature,
            humidity=humidity,
            soil_moisture=soil_moisture,
            fire_raw=fire_raw,
            fire_detected=fire_detected,
            fire_percent=fire_percent,
            rain_raw=rain_raw,
            rain_detected=rain_detected,
            rain_percent=rain_percent,
            recorded_at=timezone.now()
        )

        # Check thresholds for ALL sensors
        self.check_thresholds(device.farm, sensor_data)
        self.check_fire_alert(device.farm, sensor_data)
        self.check_rain_alert(device.farm, sensor_data)

        return Response(
            {
                'status': 'success',
                'message': 'Data saved',
                'device': device.device_id,
                'farm': device.farm.name,
                'recording': True
            },
            status=status.HTTP_200_OK
        )

    def check_thresholds(self, farm, sensor_data):
        """Check temperature, humidity, soil moisture thresholds"""
        try:
            thresholds = AlertThreshold.objects.get(farm=farm)
        except AlertThreshold.DoesNotExist:
            return

        if sensor_data.temperature is not None:
            if sensor_data.temperature > thresholds.temp_max:
                self.create_alert(farm, sensor_data.device, 'temperature_high',
                                  'critical', f"Temperature is {sensor_data.temperature}°C (max: {thresholds.temp_max}°C)",
                                  sensor_data.temperature, thresholds.temp_max)
            elif sensor_data.temperature < thresholds.temp_min:
                self.create_alert(farm, sensor_data.device, 'temperature_low',
                                  'warning', f"Temperature is {sensor_data.temperature}°C (min: {thresholds.temp_min}°C)",
                                  sensor_data.temperature, thresholds.temp_min)

        if sensor_data.humidity is not None:
            if sensor_data.humidity > thresholds.humidity_max:
                self.create_alert(farm, sensor_data.device, 'humidity_high',
                                  'warning', f"Humidity is {sensor_data.humidity}% (max: {thresholds.humidity_max}%)",
                                  sensor_data.humidity, thresholds.humidity_max)
            elif sensor_data.humidity < thresholds.humidity_min:
                self.create_alert(farm, sensor_data.device, 'humidity_low',
                                  'warning', f"Humidity is {sensor_data.humidity}% (min: {thresholds.humidity_min}%)",
                                  sensor_data.humidity, thresholds.humidity_min)

        if sensor_data.soil_moisture is not None:
            if sensor_data.soil_moisture < thresholds.soil_min:
                self.create_alert(farm, sensor_data.device, 'soil_dry',
                                  'critical', f"Soil moisture is {sensor_data.soil_moisture}% (min: {thresholds.soil_min}%)",
                                  sensor_data.soil_moisture, thresholds.soil_min)
            elif sensor_data.soil_moisture > thresholds.soil_max:
                self.create_alert(farm, sensor_data.device, 'soil_wet',
                                  'info', f"Soil moisture is {sensor_data.soil_moisture}% (max: {thresholds.soil_max}%)",
                                  sensor_data.soil_moisture, thresholds.soil_max)

    def check_fire_alert(self, farm, sensor_data):
        """Check if fire is detected and create critical alert"""
        if sensor_data.fire_detected:
            self.create_alert(
                farm, sensor_data.device, 'fire_detected',
                'critical',
                f"🔥 FIRE DETECTED! Flame sensor value: {sensor_data.fire_raw} (Intensity: {sensor_data.fire_percent}%). IMMEDIATE ACTION REQUIRED!",
                sensor_data.fire_percent, 50
            )
        else:
            # Resolve fire alerts when fire is gone
            Alert.objects.filter(
                farm=farm,
                alert_type='fire_detected',
                is_resolved=False
            ).update(is_resolved=True, resolved_at=timezone.now())

    def check_rain_alert(self, farm, sensor_data):
        """Check rain status and create alerts"""
        if sensor_data.rain_detected:
            if sensor_data.rain_percent and sensor_data.rain_percent > 80:
                # Heavy rain
                self.create_alert(
                    farm, sensor_data.device, 'heavy_rain',
                    'warning',
                    f"⛈️ Heavy rain detected! Intensity: {sensor_data.rain_percent}%. Protect crops from flooding. Raw value: {sensor_data.rain_raw}",
                    sensor_data.rain_percent, 80
                )
            else:
                # Light/moderate rain
                self.create_alert(
                    farm, sensor_data.device, 'rain_detected',
                    'info',
                    f"🌧️ Rain detected! Intensity: {sensor_data.rain_percent}%. Monitor field conditions. Raw value: {sensor_data.rain_raw}",
                    sensor_data.rain_percent, None
                )
        else:
            # Resolve rain alerts when rain stops
            Alert.objects.filter(
                farm=farm,
                alert_type__in=['rain_detected', 'heavy_rain'],
                is_resolved=False
            ).update(is_resolved=True, resolved_at=timezone.now())

    def create_alert(self, farm, device, alert_type, severity, message, value, threshold):
        """Create alert if one doesn't already exist"""
        existing = Alert.objects.filter(
            farm=farm,
            alert_type=alert_type,
            is_resolved=False
        ).first()

        if not existing:
            Alert.objects.create(
                farm=farm,
                device=device,
                alert_type=alert_type,
                severity=severity,
                message=message,
                value=value,
                threshold=threshold
            )
class ClaimDeviceView(APIView):
    """Start recording - assign device to farmer's farm and turn ON recording"""
    permission_classes = [permissions.IsAuthenticated, IsFarmer]

    def post(self, request):
        farm = Farm.objects.filter(farmer=request.user).first()
        if not farm:
            return Response({'error': 'No farm found'}, status=404)

        # Find the most recently active ESP32
        latest_device = IoTDevice.objects.filter(is_active=True).order_by('-last_seen').first()

        if not latest_device:
            return Response(
                {'error': 'No ESP32 found. Make sure ESP32 is running.'},
                status=404
            )

        # Assign to this farmer's farm and TURN ON recording
        latest_device.farm = farm
        latest_device.is_recording = True
        latest_device.save()

        return Response({
            'status': 'success',
            'message': f'ESP32 connected to {farm.name}. Recording started!',
            'device': IoTDeviceSerializer(latest_device).data
        })


class StopRecordingView(APIView):
    """Stop recording - turn OFF recording for the farmer's device"""
    permission_classes = [permissions.IsAuthenticated, IsFarmer]

    def post(self, request):
        farm = Farm.objects.filter(farmer=request.user).first()
        if not farm:
            return Response({'error': 'No farm found'}, status=404)

        device = IoTDevice.objects.filter(farm=farm, is_active=True).first()

        if not device:
            return Response({'error': 'No device found for your farm'}, status=404)

        device.is_recording = False
        device.save()

        return Response({
            'status': 'success',
            'message': f'Recording stopped for {farm.name}.',
            'device': IoTDeviceSerializer(device).data
        })


class FarmSensorDataView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsFarmer]

    def get(self, request):
        farm = Farm.objects.filter(farmer=request.user).first()
        if not farm:
            return Response({'error': 'No farm found'}, status=404)

        readings = SensorData.objects.filter(
            device__farm=farm
        ).select_related('device').order_by('-recorded_at')[:100]

        # Check if device is recording
        device = IoTDevice.objects.filter(farm=farm).first()
        is_recording = device.is_recording if device else False

        return Response({
            'farm_id': farm.id,
            'farm_name': farm.name,
            'is_recording': is_recording,
            'readings': SensorDataSerializer(readings, many=True).data
        })


class FarmSensorStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsFarmer]

    def get(self, request):
        farm = Farm.objects.filter(farmer=request.user).first()
        if not farm:
            return Response({'error': 'No farm found'}, status=404)

        last_24h = timezone.now() - timedelta(hours=24)

        stats = SensorData.objects.filter(
            device__farm=farm, recorded_at__gte=last_24h
        ).aggregate(
            avg_temp=Avg('temperature'), min_temp=Min('temperature'), max_temp=Max('temperature'),
            avg_humidity=Avg('humidity'), min_humidity=Min('humidity'), max_humidity=Max('humidity'),
            avg_soil=Avg('soil_moisture'), min_soil=Min('soil_moisture'), max_soil=Max('soil_moisture')
        )

        latest = SensorData.objects.filter(device__farm=farm).order_by('-recorded_at').first()
        device = IoTDevice.objects.filter(farm=farm).first()

        return Response({
            'farm_id': farm.id,
            'farm_name': farm.name,
            'is_recording': device.is_recording if device else False,
            'statistics': {
                'temperature': {
                    'avg': round(stats['avg_temp'], 1) if stats['avg_temp'] else None,
                    'min': stats['min_temp'], 'max': stats['max_temp'],
                },
                'humidity': {
                    'avg': round(stats['avg_humidity'], 1) if stats['avg_humidity'] else None,
                    'min': stats['min_humidity'], 'max': stats['max_humidity'],
                },
                'soil_moisture': {
                    'avg': round(stats['avg_soil'], 1) if stats['avg_soil'] else None,
                    'min': stats['min_soil'], 'max': stats['max_soil'],
                }
            },
            'latest': SensorDataSerializer(latest).data if latest else None,
            'thresholds': None
        })


class AlertThresholdView(generics.RetrieveUpdateAPIView):
    serializer_class = AlertThresholdSerializer
    permission_classes = [permissions.IsAuthenticated, IsFarmer]

    def get_object(self):
        farm = Farm.objects.filter(farmer=self.request.user).first()
        if not farm:
            from rest_framework.exceptions import NotFound
            raise NotFound("No farm found")
        thresholds, created = AlertThreshold.objects.get_or_create(farm=farm)
        return thresholds


class FarmAlertsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsFarmer]

    def get(self, request):
        farm = Farm.objects.filter(farmer=request.user).first()
        if not farm:
            return Response({'error': 'No farm found'}, status=404)

        alerts = Alert.objects.filter(farm=farm, is_resolved=False).order_by('-created_at')[:50]
        device = IoTDevice.objects.filter(farm=farm).first()

        return Response({
            'farm_id': farm.id,
            'farm_name': farm.name,
            'is_recording': device.is_recording if device else False,
            'alerts': AlertSerializer(alerts, many=True).data
        })


class ResolveAlertView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsFarmer]

    def patch(self, request, alert_id):
        farm = Farm.objects.filter(farmer=request.user).first()
        if not farm:
            return Response({'error': 'No farm found'}, status=404)

        try:
            alert = Alert.objects.get(id=alert_id, farm=farm)
            alert.is_resolved = True
            alert.resolved_at = timezone.now()
            alert.save()
            return Response({'status': 'success', 'message': 'Alert resolved'})
        except Alert.DoesNotExist:
            return Response({'error': 'Alert not found'}, status=404)
        
class AIRecommendationView(APIView):
    """
    GET /api/iot/recommendations/
    Get 100% AI-powered recommendations
    """
    permission_classes = [permissions.IsAuthenticated, IsFarmer]
    
    def get(self, request):
        farm = Farm.objects.filter(farmer=request.user).first()
        if not farm:
            return Response({'error': 'No farm found'}, status=404)
        
        # Get latest sensor data
        latest = SensorData.objects.filter(
            device__farm=farm
        ).order_by('-recorded_at').first()
        
        if not latest:
            return Response({
                'error': 'No sensor data yet. Start recording first.',
                'ai_analysis': None
            }, status=200)
        
        # Get 24h statistics
        last_24h = timezone.now() - timedelta(hours=24)
        history_stats = SensorData.objects.filter(
            device__farm=farm,
            recorded_at__gte=last_24h
        ).aggregate(
            avg_temp=Avg('temperature'),
            avg_humidity=Avg('humidity'),
            avg_soil=Avg('soil_moisture')
        )
        
        formatted_stats = {
            'avg_temp': round(history_stats['avg_temp'], 1) if history_stats['avg_temp'] else None,
            'avg_humidity': round(history_stats['avg_humidity'], 1) if history_stats['avg_humidity'] else None,
            'avg_soil': round(history_stats['avg_soil'], 1) if history_stats['avg_soil'] else None,
        }
        
        # Get AI recommendations - NO FALLBACK
        try:
            advisor = AgriAIAdvisor()
            ai_analysis = advisor.analyze(latest, formatted_stats, farm)
            
            return Response({
                'farm_name': farm.name,
                'generated_at': timezone.now().isoformat(),
                'ai_model': 'llama-3.1-8b-instant (via Groq)',
                'ai_analysis': ai_analysis
            })
            
        except Exception as e:
            return Response({
                'error': f'AI service temporarily unavailable: {str(e)}',
                'ai_analysis': None,
                'generated_at': timezone.now().isoformat()
            }, status=503)