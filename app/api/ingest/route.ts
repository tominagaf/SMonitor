import { NextResponse } from 'next/server';
import { CarelBossClient } from '@/lib/iiot/carel-client';
import { prisma } from '@/lib/prisma';

/**
 * API de Ingestão IIOT
 * Coleta dados do CAREL Boss e persiste no SQLite
 */
export async function POST(req: Request) {
  try {
    const { storeId } = await req.json();

    // 1. Buscar a Loja no Banco (SQLite)
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: { devices: true }
    });

    if (!store) {
      return NextResponse.json({ success: false, error: 'Loja não encontrada no cadastro' }, { status: 404 });
    }
    
    // 2. Coletar dados via CAREL Boss (Simulação para MVP)
    const carel = new CarelBossClient();
    
    // Simulação baseada nos dispositivos cadastrados na loja
    const results = [];
    for (const device of store.devices) {
      // Em produção: carel.fetchValues(store.bossEndpoint, device.addr...)
      const xmlMockResponse = CarelBossClient.simulateResponse([
        { id: '1', deviceId: device.id, code: 'temp', label: 'Temperatura', isCritical: true }
      ]);
      
      const rawData = carel.parseTelemetryResponse(xmlMockResponse, device.id);

      // 3. Salvar Telemetria no Banco
      for (const t of rawData) {
        await prisma.telemetry.create({
          data: {
            deviceId: t.deviceId,
            variableCode: t.variableCode,
            value: t.value,
          }
        });
      }
      results.push(...rawData);
    }

    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      ingested: results.length,
      store: store.name
    });

  } catch (error) {
    console.error('[INGEST_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Falha na ingestão SQLite' }, { status: 500 });
  }
}
