/**
 * IIoT Supermarket Domain Types
 * Arquitetura baseada em Multi-Tenancy (ThingsBoard inspiration)
 */

export enum DeviceStatus {
  OFFLINE = 0,
  ONLINE = 1,
  ALARM = 2,
  DISABLED = 3
}

export interface Tenant {
  id: string;
  name: string;
  plan: 'basic' | 'pro' | 'enterprise';
  createdAt: number;
}

export interface Store {
  id: string;
  tenantId: string;
  name: string;
  bossEndpoint: string; // IP ou URL do CAREL Boss
  bossUser: string;
  bossPass: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface Device {
  id: string;
  storeId: string;
  tenantId: string;
  name: string;
  model: string;
  addr: string; // Endereço no CAREL Boss (ex: 1.001)
  category: 'refrigeration' | 'hvac' | 'energy' | 'lighting';
}

export interface Telemetry {
  deviceId: string;
  variableCode: string;
  value: number;
  timestamp: number;
  unit?: string;
}

export interface VariableMapping {
  id: string;
  deviceId: string;
  code: string; // Tag no XML (ex: 'temp_1')
  label: string; // Nome amigável (ex: 'Temp. Retorno')
  isCritical: boolean;
  minVal?: number;
  maxVal?: number;
}
