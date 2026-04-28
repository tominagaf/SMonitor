'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Thermometer, 
  Activity, 
  Wind, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Store, 
  LayoutDashboard,
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useIIoTData } from '@/hooks/use-iiot-data';
import { DeviceStatus } from '@/lib/iiot/types';

// Componente de Card de Dispositivo
const DeviceCard = ({ name, type, value, unit, status }: any) => {
  const isAlarm = status === DeviceStatus.ALARM;
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-500 ${
        isAlarm 
          ? 'bg-red-950/20 border-red-500/50 shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]' 
          : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-zinc-800/50">
          {type === 'temp' && <Thermometer className="w-5 h-5 text-blue-400" />}
          {type === 'hvac' && <Wind className="w-5 h-5 text-emerald-400" />}
          {type === 'energy' && <Zap className="w-5 h-5 text-amber-400" />}
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full animate-pulse ${isAlarm ? 'bg-red-500' : 'bg-emerald-500'}`} />
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            {isAlarm ? 'Alarm' : 'Live'}
          </span>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-zinc-400 mb-1">{name}</h3>
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-bold tracking-tighter ${isAlarm ? 'text-red-400' : 'text-zinc-100'}`}>
            {value.toFixed(1)}
          </span>
          <span className="text-zinc-500 text-sm font-medium">{unit}</span>
        </div>
      </div>

      {isAlarm && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20"
        >
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="text-[11px] text-red-200 font-medium">Violação de Setpoint</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default function Dashboard() {
  const data = useIIoTData();

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-zinc-800 selection:text-white">
      {/* Sidebar - Navegação Técnica */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 border-r border-zinc-900 bg-zinc-950/50 backdrop-blur-xl flex flex-col items-center py-8 z-50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center mb-12">
          <Activity className="text-white w-6 h-6" />
        </div>
        
        <nav className="flex flex-col gap-8">
          <button className="p-3 rounded-xl bg-zinc-800 text-white shadow-lg"><LayoutDashboard className="w-5 h-5" /></button>
          <button className="p-3 rounded-xl text-zinc-600 hover:text-zinc-300 transition-colors"><Store className="w-5 h-5" /></button>
          <button className="p-3 rounded-xl text-zinc-600 hover:text-zinc-300 transition-colors"><Bell className="w-5 h-5" /></button>
          <button className="p-3 rounded-xl text-zinc-600 hover:text-zinc-300 transition-colors"><Settings className="w-5 h-5" /></button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pl-20 pr-8 py-8 lg:pr-12">
        {/* Header - SaaS Context */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 uppercase tracking-widest">Enterprise SaaS</span>
              <h1 className="text-2xl font-bold text-white tracking-tight">Supermarket Monitor</h1>
            </div>
            <p className="text-sm text-zinc-500">Unidade: <span className="text-zinc-300 font-medium">Regional São Paulo - Loja 082</span></p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4 border-r border-zinc-800 pr-4 hidden lg:flex">
              <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest px-2 py-1 rounded bg-zinc-900">Tenant: Grupo Carrefour</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input 
                type="text" 
                placeholder="Buscar equipamento..." 
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-zinc-600 w-64"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-zinc-300">CAREL Boss Online</span>
            </div>
          </div>
        </header>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DeviceCard name="Freezer Vertical 01" type="temp" value={data.temperature} unit="°C" status={data.status} />
          <DeviceCard name="Ilha Congelados B" type="temp" value={-18.4} unit="°C" status={DeviceStatus.ONLINE} />
          <DeviceCard name="Câmara Fria Laticínios" type="temp" value={2.1} unit="°C" status={DeviceStatus.ONLINE} />
          <DeviceCard name="Consumo Instantâneo" type="energy" value={142.5} unit="kW/h" status={DeviceStatus.ONLINE} />
        </div>

        {/* Main Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Historical Trend */}
          <div className="lg:col-span-2 bg-zinc-900/20 border border-zinc-900 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Tendência de Temperatura</h2>
                <p className="text-xs text-zinc-500 font-mono">Últimos 20 Ciclos de Ingestão (Polling 5s)</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs font-medium text-white">Live</button>
                <button className="px-3 py-1.5 rounded-lg hover:bg-zinc-900 text-xs font-medium text-zinc-500 transition-colors">Histórico</button>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.history}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={data.status === DeviceStatus.ALARM ? "#ef4444" : "#3b82f6"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#52525b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#52525b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tickFormatter={(val) => `${val}°C`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="temp" 
                    stroke={data.status === DeviceStatus.ALARM ? "#ef4444" : "#3b82f6"} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTemp)" 
                    animationDuration={500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* COP / Efficiency Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-zinc-900">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Set Point</p>
                <p className="text-lg font-bold text-white">4.0°C</p>
              </div>
              <div className="text-center border-l border-zinc-900">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Eficiência (COP)</p>
                <p className="text-lg font-bold text-emerald-400">3.82</p>
              </div>
              <div className="text-center border-l border-zinc-900">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Delta T</p>
                <p className="text-lg font-bold text-white">1.2°C</p>
              </div>
            </div>
          </div>

          {/* Right Panel: Alarms & AI Insights */}
          <div className="space-y-8">
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-3xl p-6">
              <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                Alertas Recentes
              </h2>
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-red-400">Alta Temperatura</span>
                    <span className="text-[9px] text-zinc-600">Agora</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Freezer Vertical 01: 6.2°C</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-800/30 border border-zinc-800">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-zinc-300">Porta Aberta</span>
                    <span className="text-[9px] text-zinc-600">12m atrás</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Câmara de Laticínios</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-950/20 to-zinc-900/20 border border-indigo-500/20 rounded-3xl p-6">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                Predição de Falha (AI)
              </h2>
              <div className="space-y-4">
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Análise de tendência sugere degradação no compressor B-02 da <span className="text-indigo-300 font-medium tracking-tight">Loja 082</span>. 
                  Probabilidade de falha em 72h: <span className="text-amber-400 font-bold">14%</span>.
                </p>
                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '14%' }}
                    className="bg-amber-400 h-full"
                  />
                </div>
                <button className="w-full py-2 rounded-xl bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 transition-colors">
                  Abrir Ordem de Serviço
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
