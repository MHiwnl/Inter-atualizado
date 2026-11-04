/* Configuração pública do frontend. Nunca coloque segredos neste arquivo. */
const localHost = ['localhost', '127.0.0.1', '::1'].includes(location.hostname);
const configuredApiBase = window.TASKGO_CONFIG?.apiBaseUrl;
const API_BASE_URL = String(configuredApiBase || '').replace(/\/$/, '');
const API_ORIGIN = new URL(API_BASE_URL || location.origin, location.href).origin;
const TASKGO_DEMO_MODE = localHost && new URLSearchParams(location.search).get('demo') === '1';

if (!localHost && API_BASE_URL && new URL(API_BASE_URL, location.href).protocol !== 'https:') {
  throw new Error('A URL pública da API TaskGO deve utilizar HTTPS.');
}
if (!localHost && location.protocol !== 'https:') {
  throw new Error('O frontend TaskGO publicado deve utilizar HTTPS.');
}
