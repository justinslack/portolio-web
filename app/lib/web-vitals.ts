/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { onCLS, onFCP, onFID, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

// Log web vitals to console in development, send to analytics in production
function sendToAnalytics(metric: Metric) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }

  // In production, send to your analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Or send to your custom analytics endpoint
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   body: JSON.stringify(metric),
    //   headers: { 'Content-Type': 'application/json' },
    // });
  }
}

// Report all Web Vitals
export function reportWebVitals() {
  if (typeof window === 'undefined') return;

  onCLS(sendToAnalytics);  // Cumulative Layout Shift
  onFCP(sendToAnalytics);  // First Contentful Paint
  onFID(sendToAnalytics);  // First Input Delay (deprecated, use INP)
  onLCP(sendToAnalytics);  // Largest Contentful Paint
  onTTFB(sendToAnalytics); // Time to First Byte
  onINP(sendToAnalytics);  // Interaction to Next Paint
}

// Export metric thresholds for reference
export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  INP: { good: 200, needsImprovement: 500 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
} as const;

