"use client"

import { useCallback } from "react"

// Tipos para los eventos de tracking
interface FormSubmitData {
  company?: string
  position?: string
  lead_value?: number
}

interface CTAClickData {
  button_text: string
  section: string
}

interface ScrollData {
  section: string
  percentage: number
}

export const useAnalytics = () => {
  // Facebook Pixel tracking
  const trackFacebookEvent = useCallback((eventName: string, parameters: any = {}) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", eventName, parameters)
    }
  }, [])

  // Google Analytics tracking
  const trackGoogleEvent = useCallback((eventName: string, parameters: any = {}) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, parameters)
    }
  }, [])

  // Google Ads conversion tracking
  const trackGoogleAdsConversion = useCallback((conversionLabel: string, value?: number) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: `AW-CONVERSION_ID/${conversionLabel}`,
        value: value || 1,
        currency: "CLP",
      })
    }
  }, [])

  // Tracking functions
  const trackPageView = useCallback(
    (pageTitle: string, pageLocation: string) => {
      // Google Analytics
      trackGoogleEvent("page_view", {
        page_title: pageTitle,
        page_location: pageLocation,
      })

      // Facebook Pixel
      trackFacebookEvent("PageView")
    },
    [trackGoogleEvent, trackFacebookEvent],
  )

  const trackFormSubmit = useCallback(
    (formName: string, data: FormSubmitData) => {
      // Google Analytics
      trackGoogleEvent("form_submit", {
        form_name: formName,
        company: data.company,
        position: data.position,
        value: data.lead_value || 150,
      })

      // Facebook Pixel
      trackFacebookEvent("Lead", {
        content_name: formName,
        value: data.lead_value || 150,
        currency: "CLP",
      })

      // Google Ads
      trackGoogleAdsConversion("form_submit", data.lead_value || 150)
    },
    [trackGoogleEvent, trackFacebookEvent, trackGoogleAdsConversion],
  )

  const trackCTAClick = useCallback(
    (buttonText: string, section: string) => {
      // Google Analytics
      trackGoogleEvent("cta_click", {
        button_text: buttonText,
        section: section,
      })

      // Facebook Pixel
      trackFacebookEvent("Contact", {
        content_name: buttonText,
      })
    },
    [trackGoogleEvent, trackFacebookEvent],
  )

  const trackWhatsAppClick = useCallback(
    (source: string) => {
      // Google Analytics
      trackGoogleEvent("whatsapp_click", {
        source: source,
      })

      // Facebook Pixel
      trackFacebookEvent("Contact", {
        content_name: "WhatsApp",
        content_category: source,
      })

      // Google Ads
      trackGoogleAdsConversion("whatsapp_click")
    },
    [trackGoogleEvent, trackFacebookEvent, trackGoogleAdsConversion],
  )

  const trackDemoRequest = useCallback(
    (demoType: string) => {
      // Google Analytics
      trackGoogleEvent("demo_request", {
        demo_type: demoType,
      })

      // Facebook Pixel
      trackFacebookEvent("Schedule", {
        content_name: demoType,
      })

      // Google Ads
      trackGoogleAdsConversion("demo_request")
    },
    [trackGoogleEvent, trackFacebookEvent, trackGoogleAdsConversion],
  )

  const trackSectionView = useCallback(
    (sectionName: string) => {
      // Google Analytics
      trackGoogleEvent("section_view", {
        section_name: sectionName,
      })

      // Facebook Pixel
      trackFacebookEvent("ViewContent", {
        content_name: sectionName,
        content_type: "section",
      })
    },
    [trackGoogleEvent, trackFacebookEvent],
  )

  const trackScrollDepth = useCallback(
    (section: string, percentage: number) => {
      // Google Analytics
      trackGoogleEvent("scroll", {
        section: section,
        scroll_depth: percentage,
      })

      // Facebook Pixel - solo trackear scrolls importantes
      if (percentage >= 75) {
        trackFacebookEvent("ViewContent", {
          content_name: `${section}_scroll_${percentage}`,
          content_type: "scroll_depth",
        })
      }
    },
    [trackGoogleEvent, trackFacebookEvent],
  )

  return {
    trackPageView,
    trackFormSubmit,
    trackCTAClick,
    trackWhatsAppClick,
    trackDemoRequest,
    trackSectionView,
    trackScrollDepth,
  }
}
