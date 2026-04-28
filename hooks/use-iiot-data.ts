'use client';
import { useState, useEffect } from 'react';
import { Telemetry, DeviceStatus } from '@/lib/iiot/types';

/**
 * Hook para simular fluxo de dados IIoT
 * Em produção, este hook se conectaria ao Firebase Firestore (onSnapshot)
 */
export function useIIoTData() {
  const [data, setData] = useState<{
    temperature: number;
    history: { time: string; temp: number }[];
    status: DeviceStatus;
  }>(() => {
    // Inicialização segura para o histórico
    const initialHistory = Array.from({ length: 20 }).map((_, i) => ({
      time: `${19 - i}m atrás`,
      temp: 4 + Math.random() * 2
    })).reverse();

    return {
      temperature: 4.2,
      history: initialHistory,
      status: DeviceStatus.ONLINE
    };
  });

  useEffect(() => {
    // Atualização em tempo real (Intervalo Industrial)
    const interval = setInterval(() => {
      const newVal = 3.5 + Math.random() * 2;
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      setData(prev => {
        const newHistory = [...prev.history, { time: now, temp: newVal }].slice(-20);
        return {
          temperature: newVal,
          history: newHistory,
          status: newVal > 5.5 ? DeviceStatus.ALARM : DeviceStatus.ONLINE
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return data;
}
