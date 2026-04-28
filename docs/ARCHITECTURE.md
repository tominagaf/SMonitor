# Arquitetura Técnica: Supermarket IIoT Monitor

## 1. Stack e Infraestrutura
- **Backend/Frontend:** Next.js 15 (Node.js)
- **Database (Recomendado):** PostgreSQL + TimescaleDB (para séries temporais)
- **Cache:** Redis para filas de ingestão e rate limiting.
- **Proxy:** NGINX com Hardening (SSL, Fail2ban).

## 2. Pipeline de Dados IIoT
1. **Scheduler:** Trigger periódico (ex: 30s) por loja.
2. **Request:** Client envia POST XML para o Boss (MasterXML).
3. **Engine:** `CarelBossClient` parseia a resposta, normaliza tipos.
4. **Validation:** Verifica violações de setpoint (Alarmes).
5. **Storage:** Salva telemetria e atualiza cache de "Último Estado".
6. **Real-time:** Notificação via WebSocket/Server-Sent Events para o Dashboard.

## 3. Segurança (Hardening)
- **JWT:** Tokens com tempo de vida curto e Refresh Tokens em HTTP-only cookies.
- **XML Sanitization:** Proteção contra XXE (XML External Entity) attacks durante o parsing.
- **Multi-tenancy:** Filtro obrigatório de `tenant_id` em todas as queries de banco de dados (Row Level Security - RLS).
