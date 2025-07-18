// Importación condicional de axios solo en el cliente
let axios: any;
if (typeof window !== 'undefined') {
  // Solo importar axios en el cliente
  import('axios').then(module => {
    axios = module.default;
  });
}

export function isEmbeddedBrowser(): boolean {
  const ua = navigator.userAgent || "";

  const embeddedIndicators = [
    "FBAN", "FBAV", "Instagram", "Line", "Snapchat",
    "Twitter", "TikTok", "com.zhiliaoapp.musically" // TikTok alternativo
  ];

  // Detección por user agent
  const isByUserAgent = embeddedIndicators.some(indicator =>
    ua.toLowerCase().includes(indicator.toLowerCase())
  );

  // Detección por estar en iframe (algunos embebidos lo hacen)
  const isFramed = window.self !== window.top;

  // Detección de limitaciones típicas de webviews
  const hasLimitedFeatures = !window.matchMedia || !window.fetch;

  // Detección por vendor/propiedades raras en TikTok (experimental)
  const isTikTok =
    ua.includes("ttWebView") || // Algunos identifican TikTok así
    (typeof (navigator as any).userAgentData !== "undefined" &&
      (navigator as any).userAgentData.brands?.some((b: any) => b.brand.includes("TikTok"))) || // Si soporta UA hints
    /\bcom\.zhiliaoapp\.musically\b/i.test(ua); // Android

  return isByUserAgent || isFramed || isTikTok || hasLimitedFeatures;
}

export async function getIp() {
  try {
    // Solo usar axios si está disponible (en el cliente)
    if (typeof window !== 'undefined' && axios) {
      const res = await axios.get("https://api.ipify.org?format=json");
      const ip = res.data.ip;
      return ip;
    } else {
      // En el servidor, retornar un valor por defecto
      return "unknown";
    }
  } catch (err) {
    console.error("Error al obtener la IP del usuario:", err);
    return "unknown";
  }
}