'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '../lib/web-vitals';

// Component to initialize web vitals reporting
export default function WebVitals() {
  useEffect(() => {
    reportWebVitals();
  }, []);

  return null; // This component doesn't render anything
}

