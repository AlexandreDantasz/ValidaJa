// Configuração necessária para o expo-sqlite funcionar na web:
// o SQLite roda como WebAssembly (wa-sqlite) e grava os dados no OPFS do navegador,
// o que exige servir arquivos .wasm e ativar o isolamento de origem (COOP/COEP).
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm');

config.server.enhanceMiddleware = (middleware) => (req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  middleware(req, res, next);
};

module.exports = config;
