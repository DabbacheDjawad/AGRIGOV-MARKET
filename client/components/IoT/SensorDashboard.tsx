'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_BASE = 'http://127.0.0.1:8000/api/iot';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access');
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface SensorStats {
  farm_id: number;
  farm_name: string;
  is_recording: boolean;
  statistics: {
    temperature: { avg: number | null; min: number | null; max: number | null };
    humidity: { avg: number | null; min: number | null; max: number | null };
    soil_moisture: { avg: number | null; min: number | null; max: number | null };
  };
  latest: {
    temperature: number | null;
    humidity: number | null;
    soil_moisture: number | null;
    recorded_at: string;
    device_id: string;
  } | null;
}

interface SensorReading {
  id: number;
  temperature: number | null;
  humidity: number | null;
  soil_moisture: number | null;
  recorded_at: string;
}

interface Alert {
  id: number;
  alert_type: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  is_resolved: boolean;
  created_at: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SensorDashboard() {
  const [stats, setStats] = useState<SensorStats | null>(null);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [thresholds, setThresholds] = useState({ temp_min: 10, temp_max: 35, humidity_min: 30, humidity_max: 80, soil_min: 30, soil_max: 70 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 10000);
    return () => clearInterval(interval);
  }, []);

  const headers = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  });

  const fetchAllData = async () => {
    try {
      setError('');
      const [sRes, aRes, tRes, dRes] = await Promise.all([
        fetch(`${API_BASE}/farm/stats/`, { headers: headers() }),
        fetch(`${API_BASE}/farm/alerts/`, { headers: headers() }),
        fetch(`${API_BASE}/farm/thresholds/`, { headers: headers() }),
        fetch(`${API_BASE}/farm/data/`, { headers: headers() }),
      ]);

      if (sRes.status === 401) { setError('Please log in to view sensor data.'); setLoading(false); return; }

      const sData = await sRes.json();
      setStats(sData);
      setIsRecording(sData.is_recording || false);

      const aData = await aRes.json();
      setAlerts(aData.alerts || []);

      const tData = await tRes.json();
      if (tData?.temp_min !== undefined) setThresholds(tData);

      const dData = await dRes.json();
      setReadings(dData.readings || []);

      setLoading(false);
    } catch {
      setError('Failed to connect to server. Make sure the backend is running.');
      setLoading(false);
    }
  };

  const claimDevice = async () => {
    setClaiming(true);
    try {
      const res = await fetch(`${API_BASE}/claim-device/`, {
        method: 'POST',
        headers: headers(),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ ${data.message}`);
        fetchAllData();
      } else {
        alert(`❌ ${data.error || 'Failed to connect device'}`);
      }
    } catch {
      alert('Failed to connect to server.');
    }
    setClaiming(false);
  };

  const stopRecording = async () => {
    setStopping(true);
    try {
      const res = await fetch(`${API_BASE}/stop-recording/`, {
        method: 'POST',
        headers: headers(),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`⏹️ ${data.message}`);
        fetchAllData();
      } else {
        alert(`❌ ${data.error || 'Failed'}`);
      }
    } catch {
      alert('Failed to connect to server.');
    }
    setStopping(false);
  };

  const updateThresholds = async () => {
    const res = await fetch(`${API_BASE}/farm/thresholds/`, {
      method: 'PUT', headers: headers(), body: JSON.stringify(thresholds),
    });
    alert(res.ok ? '✅ Thresholds updated!' : '❌ Failed to update.');
  };

  const resolveAlert = async (id: number) => {
    await fetch(`${API_BASE}/alerts/${id}/resolve/`, { method: 'PATCH', headers: headers() });
    fetchAllData();
  };

  // ─── Loading / Error states ─────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-slate-500 dark:text-slate-400">Loading sensor data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-8 text-center">
        <span className="material-symbols-outlined text-3xl text-yellow-500">warning</span>
        <p className="mt-3 text-yellow-700 dark:text-yellow-400 font-medium">{error}</p>
        <button onClick={fetchAllData} className="mt-4 px-5 py-2 bg-primary text-black rounded-lg hover:bg-primary-dark transition">Retry</button>
      </div>
    );
  }

  const activeAlerts = alerts.filter(a => !a.is_resolved);

  // ─── Chart Data ─────────────────────────────────────────────────────────────

  const chartData = {
    labels: readings.map(r => new Date(r.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })).reverse(),
    datasets: [
      { label: 'Temperature (°C)', data: readings.map(r => r.temperature).reverse(), borderColor: 'rgb(239,68,68)', backgroundColor: 'rgba(239,68,68,0.1)', tension: 0.3 },
      { label: 'Humidity (%)', data: readings.map(r => r.humidity).reverse(), borderColor: 'rgb(59,130,246)', backgroundColor: 'rgba(59,130,246,0.1)', tension: 0.3 },
      { label: 'Soil Moisture (%)', data: readings.map(r => r.soil_moisture).reverse(), borderColor: 'rgb(34,197,94)', backgroundColor: 'rgba(34,197,94,0.1)', tension: 0.3 },
    ],
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">sensors</span>
            Farm Sensors
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time environmental monitoring
            {isRecording && <span className="ml-2 text-green-500 font-medium">● Recording</span>}
            {!isRecording && stats?.farm_name && <span className="ml-2 text-red-500 font-medium">● Stopped</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {stats?.farm_name && (
            <span className="text-sm bg-primary/10 text-primary-dark dark:text-primary px-3 py-1 rounded-full font-medium">
              {stats.farm_name}
            </span>
          )}
          {isRecording ? (
            <button
              onClick={stopRecording}
              disabled={stopping}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">stop_circle</span>
              {stopping ? 'Stopping...' : 'Stop Recording'}
            </button>
          ) : (
            <button
              onClick={claimDevice}
              disabled={claiming}
              className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary-dark disabled:opacity-50 transition flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">link</span>
              {claiming ? 'Connecting...' : 'Connect My ESP32'}
            </button>
          )}
        </div>
      </div>

      {/* Recording status banner */}
      {!isRecording && stats?.farm_name && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center">
          <p className="text-yellow-700 dark:text-yellow-400 font-medium">
            ⏸️ Recording is currently stopped. Click &quot;Connect My ESP32&quot; to start recording data.
          </p>
        </div>
      )}

      {/* Info box when no data */}
      {!stats?.latest && !stats?.farm_name && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
          <span className="material-symbols-outlined text-3xl text-blue-500">info</span>
          <p className="mt-2 text-blue-700 dark:text-blue-400 font-medium">No sensor data yet</p>
          <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
            Make sure your ESP32 is running and click &quot;Connect My ESP32&quot; to link it to your farm.
          </p>
        </div>
      )}

      {/* Info box when device connected but no data yet */}
      {!stats?.latest && stats?.farm_name && isRecording && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
          <span className="material-symbols-outlined text-3xl text-blue-500">hourglass_top</span>
          <p className="mt-2 text-blue-700 dark:text-blue-400 font-medium">Waiting for data...</p>
          <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
            ESP32 is connected and recording. Data will appear in a few seconds.
          </p>
        </div>
      )}

      {/* Live Cards */}
      {stats?.latest && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Temperature', value: stats.latest.temperature, unit: '°C', icon: 'thermostat', color: 'red', border: 'border-red-500' },
            { label: 'Humidity', value: stats.latest.humidity, unit: '%', icon: 'humidity_percentage', color: 'blue', border: 'border-blue-500' },
            { label: 'Soil Moisture', value: stats.latest.soil_moisture, unit: '%', icon: 'grass', color: 'green', border: 'border-green-500' },
          ].map(card => (
            <div key={card.label} className={`bg-white dark:bg-surface-dark rounded-xl p-6 shadow-md border-l-4 ${card.border}`}>
              <div className="flex items-center justify-between">
                <span className={`material-symbols-outlined text-3xl text-${card.color}-500`}>{card.icon}</span>
                <span className="text-xs text-slate-400">Live</span>
              </div>
              <p className="text-3xl font-bold mt-3">{card.value != null ? `${card.value}${card.unit}` : '--'}</p>
              <p className="text-sm text-slate-500">{card.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {readings.length > 0 && (
        <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">📈 Sensor History</h3>
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: false } } }} />
        </div>
      )}

      {/* 24h Stats */}
      {stats?.statistics && (
        <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">📊 24-Hour Statistics</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {(['temperature', 'humidity', 'soil_moisture'] as const).map(key => (
              <div key={key}>
                <p className="text-sm text-slate-500 capitalize">{key.replace('_', ' ')}</p>
                <p className="font-bold text-lg">{stats.statistics[key].avg ?? '--'}{key === 'temperature' ? '°C' : '%'}</p>
                <p className="text-xs text-slate-400">{stats.statistics[key].min ?? '--'} / {stats.statistics[key].max ?? '--'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Thresholds */}
      <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-md">
        <h3 className="font-bold text-lg mb-4">⚙️ Alert Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Temperature (°C)', min: 'temp_min', max: 'temp_max' },
            { label: 'Humidity (%)', min: 'humidity_min', max: 'humidity_max' },
            { label: 'Soil Moisture (%)', min: 'soil_min', max: 'soil_max' },
          ].map(field => (
            <div key={field.label}>
              <label className="block text-sm font-medium mb-1">{field.label}</label>
              <div className="flex gap-2">
                <input type="number" value={(thresholds as any)[field.min]} onChange={e => setThresholds({ ...thresholds, [field.min]: +e.target.value })}
                  className="w-1/2 px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700" placeholder="Min" />
                <input type="number" value={(thresholds as any)[field.max]} onChange={e => setThresholds({ ...thresholds, [field.max]: +e.target.value })}
                  className="w-1/2 px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700" placeholder="Max" />
              </div>
            </div>
          ))}
        </div>
        <button onClick={updateThresholds} className="mt-4 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary-dark transition">Save Thresholds</button>
      </div>

      {/* Alerts */}
      {activeAlerts.length > 0 && (
        <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500">warning</span>
            Active Alerts ({activeAlerts.length})
          </h3>
          <div className="space-y-2">
            {activeAlerts.map(a => (
              <div key={a.id} className={`flex items-center justify-between p-3 rounded-lg ${
                a.severity === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200' :
                a.severity === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200' :
                'bg-blue-50 dark:bg-blue-900/20 border border-blue-200'
              }`}>
                <div>
                  <p className="font-medium">{a.message}</p>
                  <p className="text-xs text-slate-500">{new Date(a.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => resolveAlert(a.id)} className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">Resolve</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}