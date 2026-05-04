import type { NextConfig } from "next";

const securityHeaders = [
  // Bloqueia o site de ser embutido em iframes (proteção contra clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Impede o browser de inferir o MIME type (proteção contra MIME sniffing)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Não envia o Referer ao navegar para outro domínio
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desativa features sensíveis do browser que não usamos
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // CSP: restringe de onde recursos podem ser carregados
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js precisa de inline scripts/styles em produção
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      // Imagens inline (data:) são usadas por ícones e charts
      "img-src 'self' data: blob:",
      // Permite chamadas de API e Realtime do Supabase
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "font-src 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
};

export default nextConfig;
