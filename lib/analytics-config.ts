// Configuración centralizada de tracking
export const ANALYTICS_CONFIG = {
  // Google Analytics 4
  GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "GA_MEASUREMENT_ID",

  // Facebook Pixel
  FB_PIXEL_ID: process.env.NEXT_PUBLIC_FB_PIXEL_ID || "FB_PIXEL_ID",

  // Google Ads
  GOOGLE_ADS_ID: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-CONVERSION_ID",

  // Conversion Labels para Google Ads
  CONVERSION_LABELS: {
    FORM_SUBMIT: "form_submit_label",
    WHATSAPP_CLICK: "whatsapp_click_label",
    DEMO_REQUEST: "demo_request_label",
    PHONE_CALL: "phone_call_label",
    EMAIL_CLICK: "email_click_label",
  },

  // Eventos personalizados
  CUSTOM_EVENTS: {
    // Google Analytics Events
    GA: {
      FORM_SUBMIT: "form_submit",
      CTA_CLICK: "cta_click",
      WHATSAPP_CLICK: "whatsapp_click",
      DEMO_REQUEST: "demo_request",
      SECTION_VIEW: "section_view",
      SCROLL_DEPTH: "scroll",
      PHONE_CLICK: "phone_click",
      EMAIL_CLICK: "email_click",
    },

    // Facebook Pixel Events
    FB: {
      LEAD: "Lead",
      CONTACT: "Contact",
      SCHEDULE: "Schedule",
      VIEW_CONTENT: "ViewContent",
      PAGE_VIEW: "PageView",
    },
  },

  // Configuración de scroll tracking
  SCROLL_THRESHOLDS: [25, 50, 75, 90, 100],

  // Secciones a trackear
  TRACKED_SECTIONS: [
    "hero",
    "soluciones",
    "metodologia",
    "casos",
    "fundador",
    "antes-despues",
    "tecnologias",
    "contacto",
  ],
}

// Valores por defecto para conversiones
export const DEFAULT_CONVERSION_VALUES = {
  FORM_SUBMIT: 150,
  DEMO_REQUEST: 200,
  WHATSAPP_CLICK: 50,
  PHONE_CALL: 75,
  EMAIL_CLICK: 25,
}
