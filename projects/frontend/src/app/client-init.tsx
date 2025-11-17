'use client';

import { useEffect } from 'react';
import { OpenAPI } from '@/lib/api/core/OpenAPI';

export function ClientInit() {
  useEffect(() => {
    // Set up OpenAPI to use localStorage token
    OpenAPI.TOKEN = async () => {
      return localStorage.getItem('accessToken') || '';
    };
    
    console.log('OpenAPI TOKEN configured'); // Debug log
  }, []);

  return null;
}