'use client';

import { useState, useEffect } from 'react';

const API_BASE = 'http://127.0.0.1:8000/api/iot';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access');
}

interface AIAnalysis {
  overall_status: string;
  summary: string;
  recommendations: {
    priority: string;
    category: string;
    icon: string;
    title: string;
    description: string;
    action_today: string;
    action_week: string;
    risk: string | null;
  }[];
}

export default function AIRecommendations({ farmId }: { farmId?: number }) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
    const interval = setInterval(fetchRecommendations, 30000);
    return () => clearInterval(interval);
  }, []);

  const headers = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  });

  const fetchRecommendations = async () => {
    try {
      setError('');
      const res = await fetch(`${API_BASE}/recommendations/`, {
        headers: headers(),
      });

      if (res.status === 401) {
        setError('Please log in to see recommendations.');
        setLoading(false);
        return;
      }

      const data = await res.json();
      setAnalysis(data.ai_analysis);
      setLoading(false);
    } catch {
      setError('Failed to load AI recommendations.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="animate-pulse rounded-full h-8 w-8 bg-purple-200" />
          <div className="space-y-2">
            <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-60 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Replace the error return with:
if (error) {
    return (
      <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-purple-500 text-2xl">psychology</span>
          <h3 className="font-bold text-lg">🤖 AI Recommendations</h3>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg p-4 text-center">
          <span className="material-symbols-outlined text-2xl text-yellow-500">psychology_alt</span>
          <p className="text-yellow-700 dark:text-yellow-400 mt-2">{error}</p>
          <button 
            onClick={fetchRecommendations}
            className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
          >
            Retry AI Analysis
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const statusConfig = {
    critical: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', label: '🔴 Needs Attention' },
    warning: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', label: '🟡 Monitor' },
    good: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', label: '🟢 All Good' },
  };

  const status = statusConfig[analysis.overall_status as keyof typeof statusConfig] || statusConfig.good;

  const priorityConfig = {
    high: { border: 'border-red-500', bg: 'bg-red-50 dark:bg-red-900/10', badge: 'bg-red-200 text-red-800' },
    medium: { border: 'border-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/10', badge: 'bg-yellow-200 text-yellow-800' },
    low: { border: 'border-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10', badge: 'bg-blue-200 text-blue-800' },
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-500 text-2xl">psychology</span>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">🤖 AI Recommendations</h3>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>

      {/* Summary */}
      <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">{analysis.summary}</p>

      {/* Recommendations */}
      <div className="space-y-3">
        {analysis.recommendations.map((rec, i) => {
          const priority = priorityConfig[rec.priority as keyof typeof priorityConfig] || priorityConfig.low;
          
          return (
            <div key={i} className={`rounded-lg p-4 border-l-4 ${priority.border} ${priority.bg}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{rec.icon}</span>
                <div className="flex-1 min-w-0">
                  {/* Title & Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">{rec.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priority.badge}`}>
                      {rec.priority}
                    </span>
                    <span className="text-xs text-slate-400 capitalize">{rec.category}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{rec.description}</p>

                  {/* Actions */}
                  <div className="mt-3 space-y-1.5 text-sm">
                    <div className="flex items-start gap-1.5">
                      <span className="font-medium text-slate-700 dark:text-slate-300 shrink-0">📋 Today:</span>
                      <span className="text-slate-600 dark:text-slate-400">{rec.action_today}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="font-medium text-slate-700 dark:text-slate-300 shrink-0">📅 This Week:</span>
                      <span className="text-slate-600 dark:text-slate-400">{rec.action_week}</span>
                    </div>
                    {rec.risk && (
                      <div className="flex items-start gap-1.5">
                        <span className="font-medium text-red-600 dark:text-red-400 shrink-0">⚠️ Risk:</span>
                        <span className="text-red-600 dark:text-red-400">{rec.risk}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <p className="text-xs text-slate-400 text-center mt-4">
        Powered by Google Gemini AI • Updates every 60 seconds
      </p>
    </div>
  );
}