import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { Telemetry, Device, VariableMapping } from './types';

/**
 * CAREL Boss XML Client
 * Implementa as queries descritas no manual 'XML Query Boss Family 1.0.0'
 */
export class CarelBossClient {
  private parser: XMLParser;
  private builder: XMLBuilder;

  constructor() {
    this.parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
    this.builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: "" });
  }

  /**
   * Gera o envelope de LOGIN + REQUEST
   */
  private buildRequestEnvelope(config: { user: string; pass: string; type: string; elements: any[] }) {
    return this.builder.build({
      requests: {
        login: { userName: config.user, password: config.pass },
        request: {
          type: config.type,
          element: config.elements
        }
      }
    });
  }

  /**
   * Simula uma resposta do BOSS (Útil para testes de homologação)
   */
  public static simulateResponse(variables: VariableMapping[]): string {
    const varsXml = variables.map(v => 
      `<var value="${(Math.random() * 5 + 2).toFixed(1)}" code="${v.code}" />`
    ).join('');

    return `
      <responses>
        <header mac="00-0B-AB-AE-FD-64" xmlquery-ver="1.0.0" />
        <response type="getVariablesValues">
          <dev devmodel="mpxpro" devaddr="1.001">
            ${varsXml}
          </dev>
        </response>
      </responses>
    `;
  }

  /**
   * Parseia a resposta de telemetria
   */
  public parseTelemetryResponse(xmlText: string, deviceId: string): Telemetry[] {
    const jsonObj = this.parser.parse(xmlText);
    const response = jsonObj.responses?.response;
    
    if (!response || response.type !== 'getVariablesValues') {
      return [];
    }

    const telemetries: Telemetry[] = [];
    const devices = Array.isArray(response.dev) ? response.dev : [response.dev];

    for (const dev of devices) {
      const vars = Array.isArray(dev.var) ? dev.var : [dev.var];
      for (const v of vars) {
        telemetries.push({
          deviceId,
          variableCode: v.code,
          value: parseFloat(v.value),
          timestamp: Date.now()
        });
      }
    }

    return telemetries;
  }
}
