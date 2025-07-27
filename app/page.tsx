"use client"

import { useState, useEffect, useRef } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  Play,
  Sparkles,
  Target,
  Rocket,
  Shield,
  Zap,
  Brain,
  Users,
  Cog,
  TrendingUp,
  MessageSquare,
  Calendar,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
} from "lucide-react"

import { useAnalytics } from "@/hooks/use-analytics"
import { ScrollTracker } from "@/components/scroll-tracker"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLinkedin,
  faInstagram,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons"
declare global {
  interface Window {
    grecaptcha: any
  }
}

// Agregar después de los imports
const animationStyles = `
  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes slideInFromTop {
    from {
      opacity: 0;
      transform: translateY(-50px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    20%, 80% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-20px);
    }
  }

  .animate-fade-in-left {
    animation: fadeInLeft 0.8s ease-out forwards;
  }

  .animate-fade-in-right {
    animation: fadeInRight 0.8s ease-out forwards;
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .animate-fade-in-scale {
    animation: fadeInScale 0.8s ease-out forwards;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-slide-in-top {
    animation: slideInFromTop 0.5s ease-out forwards;
  }

  .animate-pulse-gentle {
    animation: pulse 2s ease-in-out infinite;
  }

  .animate-stagger-1 {
    animation-delay: 0.1s;
  }

  .animate-stagger-2 {
    animation-delay: 0.2s;
  }

  .animate-stagger-3 {
    animation-delay: 0.3s;
  }

  .animate-stagger-4 {
    animation-delay: 0.4s;
  }

  /* Elementos inicialmente ocultos */
  [class*="animate-fade-in"]:not(.animate-fade-in-scale) {
    opacity: 0;
  }

  .animate-fade-in-scale {
    opacity: 0;
    transform: scale(0.9);
  }

  @keyframes scroll-infinite {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .animate-scroll-infinite {
    animation: scroll-infinite 30s linear infinite;
  }

  .animate-scroll-infinite:hover {
    animation-play-state: paused;
  }

  @keyframes twinkle {
    0%, 100% {
      opacity: 0.2;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }
`

// Componente de notificación con el diseño exacto de la imagen
const Notification = ({ type, title, message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border-4 border-green-500 shadow-2xl max-w-md mx-4 animate-slide-in-top">
        <div className="p-8 text-center">
          {/* Emoji y título */}
          <div className="mb-6">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-2xl font-bold text-green-600">¡Solicitud enviada!</h3>
          </div>

          {/* Mensaje */}
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Gracias por confiar en Meikify. Hemos recibido tu información y te enviaremos el diagnóstico automatizado
            muy pronto.
          </p>

          {/* Botón de cerrar (opcional, se puede cerrar automáticamente) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}



export default function MeikifyWebsite() {
  const analytics = useAnalytics()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [visibleSections, setVisibleSections] = useState(new Set())
  const [visibleMethodologyCards, setVisibleMethodologyCards] = useState(new Set())
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [notification, setNotification] = useState(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  // Palabras que cambian en el hero
  const heroWords = ["crezca", "fluya", "escale", "respire", "evolucione"]

  // Efecto para rotar palabras automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % heroWords.length)
    }, 3000) // Cambia cada 3 segundos

    return () => clearInterval(interval)
  }, [])


  // Función para mostrar notificaciones
  const showNotification = (type, title, message) => {
    console.log("Notification:", type, title, message)
    setNotification({ type, title, message })
    // Auto-cerrar después de 6 segundos
    setTimeout(() => {
      setNotification(null)
    }, 6000)
  }

  const closeNotification = () => {
    setNotification(null)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    const video = videoRef.current
    const handleEnded = () => {
      setTimeout(() => {
        if (video) {
          video.currentTime = 0
          video.play()
        }
      }, 5000) // espera 5 segundos después de terminar
    }
    if (video) {
      video.addEventListener("ended", handleEnded)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => new Set([...prev, entry.target.id]))
        }
      })
    }, observerOptions)

    // Observer específico para las cards de metodología
    const methodologyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardId = entry.target.getAttribute("data-card-id")
          if (entry.isIntersecting) {
            setVisibleMethodologyCards((prev) => new Set([...prev, cardId]))
          } else {
            setVisibleMethodologyCards((prev) => {
              const newSet = new Set(prev)
              newSet.delete(cardId)
              return newSet
            })
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    // Pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll("section[id]")
      sections.forEach((section) => observer.observe(section))

      // Observar cards de metodología individualmente
      const methodologyCards = document.querySelectorAll("[data-card-id]")
      methodologyCards.forEach((card) => methodologyObserver.observe(card))
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      methodologyObserver.disconnect()
    }
  }, [])

  // Load reCAPTCHA script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://www.google.com/recaptcha/api.js"
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    // Cleanup function
    return () => {
      const existingScript = document.querySelector('script[src="https://www.google.com/recaptcha/api.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  // Listen for reCAPTCHA events
    useEffect(() => {
      const handleRecaptchaChange = (event: CustomEvent) => {
        setRecaptchaToken(event.detail)
      }

      window.addEventListener("recaptcha-change", handleRecaptchaChange as EventListener)

      return () => {
        window.removeEventListener("recaptcha-change", handleRecaptchaChange as EventListener)
      }
    }, [])

  // reCAPTCHA callback function
    const onRecaptchaChange = (token: string | null) => {
      setRecaptchaToken(token)
    }

    // Form submission handler
   const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!recaptchaToken) {
      showNotification(
        "warning",
        "Verificación requerida",
        "Por favor, completa la verificación reCAPTCHA antes de continuar.",
      )
      return
    }

    // Obtener los datos del formulario
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      nombre: formData.get("name") as string,
      correo: formData.get("email") as string,
      whatsapp: formData.get("whatsapp") as string,
      empresa: formData.get("company") as string,
      cargo: formData.get("position") as string,
      tarea_proceso: formData.get("process") as string,
    }

    // Mostrar estado de carga
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement
    const originalText = submitButton.innerHTML
    submitButton.innerHTML =
      '<div class="flex items-center justify-center"><div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>Enviando...</div>'
    submitButton.disabled = true

    const API_USERNAME = "admin"
    const API_PASSWORD = "laCLAVEes123!"
    const basicAuth = "Basic " + Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString("base64")

   /* showNotification("success", "¡Solicitud enviada!", "")

    // Resetear reCAPTCHA
    if (window.grecaptcha) {
      window.grecaptcha.reset()
    }
    setRecaptchaToken(null)*/

    try {
      const response = await fetch("https://n8nwebhook.meikify.cl/webhook/leads-diagnostico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": basicAuth,
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        showNotification("success", "¡Solicitud enviada!", "")
        ;(e.target as HTMLFormElement).reset()

        // Resetear reCAPTCHA
        if (window.grecaptcha) {
          window.grecaptcha.reset()
        }
        setRecaptchaToken(null)
      } else {
        showNotification(
          "error",
          "Error de conexión 🌐",
          `${response.status}`,
        )
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
      showNotification(
          "error",
        "Error de conexión 🌐",
        "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo o contáctanos directamente.",
      )
    } finally {
      // Restaurar el botón
      submitButton.innerHTML = originalText
      submitButton.disabled = false
    }
  }

  // Track page view on mount
  useEffect(() => {
    analytics.trackPageView("Meikify Homepage", window.location.href)
  }, [analytics])

  const phoneNumber = "56958995317"
  const message =
    "¡Hola! Me interesa conocer más sobre cómo la automatización inteligente transforma cada aspecto de mi operación ¿Podrían ayudarme con información?"

  const handleWhatsAppClick = (source = "general") => {
    // Track WhatsApp click
    analytics.trackWhatsAppClick(source)

    // Crear la URL de WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`

    // Abrir en nueva ventana
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
  }

  const handleDemoRequest = () => {
    // Track demo request
    analytics.trackDemoRequest("demo_vip")

    // Abrir calendario de citas
    window.open("https://calendar.notion.so/meet/joanmeikify/diary", "_blank", "noopener,noreferrer")
  }

  const handleCTAClick = (buttonText: string, section: string) => {
    analytics.trackCTAClick(buttonText, section)
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden pt-20">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={closeNotification}
        />
      )}
      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-cyan-400/20 rounded-full blur-3xl transition-all duration-1000"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-800/95 backdrop-blur-md  border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <a
                href="#hero"
                className="hover:text-cyan-400 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.querySelector("#hero")
                  if (element) {
                    const headerHeight = 80
                    const elementPosition = element.offsetTop - headerHeight
                    window.scrollTo({
                      top: elementPosition,
                      behavior: "smooth",
                    })
                  }
                }}
              >
                <img
                  src="/images/meikify-logo.webp"
                  alt="Meikify Logo"
                  className="w-auto object-contain"
                  style={{ height: "36px" }}
                />
              </a>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { name: "Soluciones", href: "#soluciones" },
                { name: "Metodología", href: "#metodologia" },
                { name: "Casos", href: "#casos" },
              ].map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative text-white hover:text-cyan-600 font-medium transition-all duration-300 group"
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.querySelector(item.href)
                    if (element) {
                      const headerHeight = 80 // Altura aproximada del header
                      const elementPosition = (element as HTMLElement).offsetTop - headerHeight
                      window.scrollTo({
                        top: elementPosition,
                        behavior: "smooth",
                      })
                      // Track CTA click
                      analytics.trackCTAClick(item.name, "header")
                    }
                  }}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-yellow-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
              <Button
                className="text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ background: "linear-gradient(to right, #00bce7, #0ea5e9)" }}
                onClick={() => {
                  const element = document.querySelector("#diagnostico")
                  if (element) {
                    const headerHeight = 80
                    const elementPosition = element.offsetTop - headerHeight
                    window.scrollTo({
                      top: elementPosition,
                      behavior: "smooth",
                    })
                    // Track CTA click
                    analytics.trackCTAClick("Diagnóstico Gratis", "header")
                  }
                }}
              >
                Diagnóstico Gratis
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block w-5 h-0.5 bg-[#0ea5e9] transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1" : ""}`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-[#0ea5e9] mt-1 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-[#0ea5e9] mt-1 transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1" : ""}`}
                ></span>
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 bg-white/95 backdrop-blur-md rounded-lg shadow-lg">
              <div className="flex flex-col space-y-4">
                {[
                  { name: "Soluciones", href: "#soluciones" },
                  { name: "Metodología", href: "#metodologia" },
                  { name: "Casos", href: "#casos" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-slate-700 hover:text-cyan-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsMenuOpen(false)
                      const element = document.querySelector(item.href)
                      if (element) {
                        const headerHeight = 80
                        const elementPosition = element.offsetTop - headerHeight
                        window.scrollTo({
                          top: elementPosition,
                          behavior: "smooth",
                        })
                        // Track CTA click
                        analytics.trackCTAClick(item.name, "mobile_menu")
                      }
                    }}
                  >
                    {item.name}
                  </a>
                ))}
                <Button
                  className="text-white mx-4 rounded-full font-medium shadow-lg"
                  style={{ background: "linear-gradient(to right, #00bce7, #0ea5e9)" }}
                  onClick={() => {
                    setIsMenuOpen(false)
                    const element = document.querySelector("#diagnostico")
                    if (element) {
                      const headerHeight = 80
                      const elementPosition = element.offsetTop - headerHeight
                      window.scrollTo({
                        top: elementPosition,
                        behavior: "smooth",
                      })
                      // Track CTA click
                      analytics.trackCTAClick(
                        "Solicita tu diagnóstico gratis", "mobile_menu")
                    }
                  }}
                >
                  Solicita tu diagnóstico gratis
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Revolutionary Hero */}
      <section
        id="hero"
        className="relative py-4 flex items-center bg-gradient-to-br from-slate-50 via-white to-cyan-50"
      >
        <div className="container mx-auto px-6">
          {/* Contenido centrado */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles size={16} />
              <span>Revolución en automatización</span>
            </div>
            <div className="space-y-4">
             {/* Título con rotación automática */}
              <div className="relative min-h-[240px] lg:min-h-[300px] flex items-center justify-center">
                <h1 className="text-5xl lg:text-7xl font-black leading-tight text-center">
                  <span className="block text-slate-900 mb-4">
                    Haz que tu negocio{" "}
                    <div className="relative inline-block min-w-[280px] lg:min-w-[350px] align-top">
                      {heroWords.map((word, index) => (
                        <span
                          key={index}
                          className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-transparent bg-clip-text transition-all duration-1000 ${
                            index === currentWordIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                          }`}
                          style={{ backgroundImage: "linear-gradient(to right, #00bce7, #0ea5e9)" }}
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </span>
                  <span className="block text-slate-900 mt-4">solo.</span>
                </h1>
              </div>
              <div className="max-w-2xl mx-auto space-y-6 mt-16">
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 leading-tight">
                  Con IA y automatización real, no promesas.
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Liberamos a tu equipo de lo repetitivo para que se concentre en lo que realmente importa:
                  <strong> crecer, innovar y superar a la competencia</strong>.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center py-6">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-full font-semibold transition-all duration-300 bg-transparent"
                  onClick={() => {
                      setIsMenuOpen(false)
                      const element = document.querySelector("#diagnostico")
                      if (element) {
                        const headerHeight = 80
                        const elementPosition = element.offsetTop - headerHeight
                        window.scrollTo({
                          top: elementPosition,
                          behavior: "smooth",
                        })
                        // Track CTA click
                        analytics.trackCTAClick("Diagnóstico Gratis", "mobile_menu")
                      }
                    }}
                >
                  Diagnóstico gratuito
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovative Benefits Section */}
      <section id="soluciones" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] opacity-5"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              El futuro de tu negocio es{" "}
              <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">
                ahora
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Así es cómo la automatización inteligente transforma tu operación y te coloca por delante del mercado
            </p>
          </div>

          {/* Layout con Robot a la derecha */}
          <div className="grid lg:grid-cols-3 gap-8 relative z-10">
            {/* Cards de beneficios - 8 columnas */}
            <div className="lg:col-span-8 grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: <Shield className="w-16 h-16" />,
                  title: "Precisión sin margen de error",
                  description:
                    "Adiós a las fallas manuales: nuestros sistemas aprenden y mejoran solos para alcanzar una exactitud del 99.9%.",
                  color: "from-green-400 to-emerald-500",
                  stat: "99.9% precisión",
                },
                {
                  icon: <Rocket className="w-16 h-16" />,
                  title: "Velocidad que rompe récords",
                  description:
                    "Lo que antes tomaba días, ahora sucede en segundos gracias a procesos hasta 1000x más rápidos.",
                  color: "from-[#00bce7] to-blue-500",
                  stat: "1000x más rápido",
                },
                {
                  icon: <TrendingUp className="w-16 h-16" />,
                  title: "Escala sin límites",
                  description:
                    "Crece sin preocuparte por el volumen: nuestros sistemas evolucionan contigo y no pierden calidad.",
                  color: "from-yellow-400 to-orange-500",
                  stat: "Escalabilidad infinita",
                },
                {
                  icon: <Brain className="w-16 h-16" />,
                  title: "Inteligencia que se adapta a ti",
                  description: "Los sistemas aprenden de tus procesos y se ajustan automáticamente a nuevos retos.",
                  color: "from-purple-400 to-pink-500",
                  stat: "Aprendizaje continuo",
                },
              ].map((benefit, index) => (
                <Card
                  key={index}
                  className={`bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group ${
                    visibleSections.has("soluciones") ? `animate-fade-in-up animate-stagger-${index + 1}` : ""
                  }`}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${benefit.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-300">{benefit.title}</h3>
                    <p className="text-slate-300 mb-4 leading-relaxed text-sm">{benefit.description}</p>
                    <div
                      className={`text-lg font-bold bg-gradient-to-br ${benefit.color} bg-clip-text text-transparent`}
                    >
                      {benefit.stat}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary Methodology */}
      <section id="metodologia" className="py-24 bg-gradient-to-br from-white via-cyan-50 to-yellow-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              Una metodología centrada en las{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text">
                personas y los resultados
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              En Meikify creemos que la tecnología por sí sola no transforma nada. Por eso trabajamos con un enfoque que
              pone a las personas primero y garantiza resultados reales.
            </p>
          </div>

          <div className="relative">
            {/* Central Timeline */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#00bce7] via-blue-500 to-yellow-400 hidden lg:block"></div>

            <div className="space-y-24 ">
              {[
                {
                  phase: "01",
                  title: "People — Personas primero",
                  description:
                    "Comprendemos a las personas que viven el cambio, más allá de los organigramas, para diseñar soluciones que realmente les ayuden.",
                  icon: <Users className="w-12 h-12" />,
                  color: "from-purple-500 to-pink-500",
                  side: "left",
                },
                {
                  phase: "02",
                  title: "Perception — Cómo se percibe",
                  description:
                    "Medimos cómo se siente y percibe el cambio en la organización para asegurar su aceptación y adopción.",
                  icon: <Brain className="w-12 h-12" />,
                  color: "from-[#00bce7] to-blue-500",
                  side: "right",
                },
                {
                  phase: "03",
                  title: "Performance — Enfocados en resultados",
                  description:
                    "Definimos y alineamos los objetivos antes de mover cualquier pieza, para que cada acción tenga propósito.",
                  icon: <Target className="w-12 h-12" />,
                  color: "from-green-500 to-emerald-500",
                  side: "left",
                },
                {
                  phase: "04",
                  title: "Process — Optimizar con sentido",
                  description:
                    "Solo entonces optimizamos los flujos de trabajo y sumamos tecnología donde realmente genera valor.",
                  icon: <Cog className="w-12 h-12" />,
                  color: "from-yellow-500 to-orange-500",
                  side: "right",
                },
              ].map((step, index) => (
                <div key={index} className={`flex items-center ${step.side === "right" ? "lg:flex-row-reverse" : ""}`}>
                  <div className={`lg:w-1/2 ${step.side === "right" ? "lg:pl-16" : "lg:pr-16"}`}>
                    <Card
                      data-card-id={`methodology-${index}`}
                      className={`bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
                        visibleMethodologyCards.has(`methodology-${index}`)
                          ? step.side === "left"
                            ? "animate-fade-in-left"
                            : "animate-fade-in-right"
                          : "opacity-0 " + (step.side === "left" ? "translate-x-[-50px]" : "translate-x-[50px]")
                      }`}
                      style={{
                        transition: "all 0.6s ease-out",
                      }}
                    >
                      <CardContent className="p-8">
                        <div className="flex items-center space-x-4 mb-6">
                          <div className={`p-4 rounded-2xl bg-gradient-to-br ${step.color} text-white`}>
                            {step.icon}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-500">{step.phase}</div>
                            <h3 className="text-2xl font-bold text-slate-900  ">{step.title}</h3>
                          </div>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-lg  text-center sm:text-left">{step.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline Node */}
                  <div className="hidden lg:block relative">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl transition-all duration-500 ${
                        visibleMethodologyCards.has(`methodology-${index}`)
                          ? "scale-100 opacity-100"
                          : "scale-75 opacity-50"
                      }`}
                    >
                      <span className="text-white font-bold text-lg">{step.phase}</span>
                    </div>
                  </div>

                  <div className="lg:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Casos de Éxito*/}
      <section id="casos" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              Historias reales.{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text">
                Resultados reales
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Así hemos transformado empresas como la tuya con soluciones medibles y sostenibles
            </p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Atención al cliente 24/7",
                description:
                  "Desarrollamos un chatbot que atiende de manera autónoma las consultas de los clientes las 24 horas, los 7 días de la semana, resolviendo la mayoría de las interacciones sin intervención humana. Esto permitió a la empresa liberar a su equipo para enfocarse en tareas de mayor valor.",
                metrics: [
                  "80% de las consultas resueltas automáticamente",
                  "Reducción de tiempos de respuesta a segundos",
                  "Incremento en la satisfacción de los clientes",
                ],
                industry: "Servicios",
                icon: "/images/robot_icon.png",
              },
              {
                title: "Agente calificador de leads",
                description:
                  "Automatizamos la calificación de prospectos para priorizar los más valiosos, reduciendo el tiempo de seguimiento y aumentando significativamente la efectividad del equipo comercial.",
                metrics: [
                  "50% de aumento en la tasa de cierre",
                  "Respuesta a leads en menos de 5 minutos",
                  "Mejora en la calidad de los prospectos contactados",
                ],
                industry: "Legal",
                icon: "/images/legal.png",
              },
              {
                title: "Generación automática de imágenes",
                description:
                  "Implementamos un sistema que genera fotografías de productos en minutos con IA, eliminando la necesidad de sesiones fotográficas costosas y lentas. Esto permitió lanzar nuevos productos más rápido y con menor costo.",
                metrics: [
                  "Producción de imágenes en minutos",
                  "Reducción de costos en más de 60%",
                  "Mayor velocidad en lanzamientos y campañas",
                ],
                industry: "Retail",
                icon: "/images/photo.png",
              },
            ].map((useCase, index) => (
              <Card
                key={index}
                className={`hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                  visibleSections.has("casos") ? `animate-fade-in-up animate-stagger-${index + 1}` : ""
                }`}
              >
                <CardContent className="p-8">
                  <div className="text-4xl mb-4 flex justify-center items-center">
                    <img src={useCase.icon || "/placeholder.svg"} alt="Robot Meikify" className="w-[40px] h-[40px]" />
                  </div>
                  <div className="text-sm font-semibold mb-2 text-center" style={{ color: "#00bce7" }}>
                    {useCase.industry}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">{useCase.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm  text-center sm:text-left">{useCase.description}</p>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900 text-sm  text-center sm:text-left">Métricas clave:</h4>
                    <ul className="space-y-1">
                      {useCase.metrics.map((metric, metricIndex) => (
                        <li key={metricIndex} className="text-sm text-slate-600 flex items-start  text-center sm:text-left">
                          <span className="text-green-500 mr-2">•</span>
                          <strong>{metric}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After Automation Section */}
      <section
        id="antes-despues"
        className="py-24 bg-gradient-to-br from-gray-50 via-white to-slate-50 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-100/20 to-blue-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Automatizar con IA:{" "}
              <span className="text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-blue-500 bg-clip-text">
                un antes y un después
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              La automatización no solo ahorra horas: elimina errores, mejora la experiencia de tu equipo y libera
              recursos para proyectos estratégicos.
            </p>
          </div>

          {/* Before & After Comparison */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* ANTES - Before Column */}
            <div className={`${visibleSections.has("antes-despues") ? "animate-fade-in-left" : ""}`}>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 lg:p-10 shadow-xl border border-gray-200 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200/20 to-orange-200/20 rounded-full blur-xl transform translate-x-16 -translate-y-16"></div>

                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-lg">
                      Antes
                    </div>
                  </div>

                  <div className="space-y-6">
                    {[
                      {
                        icon: "📅",
                        text: "Más de 8 horas semanales",
                        subtext: "dedicadas a tareas repetitivas",
                      },
                      {
                        icon: "🧠",
                        text: "Tu equipo consumido resolviendo imprevistos",
                        subtext: "en lugar de innovar",
                      },
                      {
                        icon: "🐢",
                        text: "Procesos manuales lentos",
                        subtext: "y propensos a errores",
                      },
                      {
                        icon: "🔌",
                        text: "Sistemas aislados",
                        subtext: "sin seguimiento claro",
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-4 group">
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-800 font-semibold text-lg leading-tight">{item.text}</p>
                          <p className="text-slate-600 mt-1">{item.subtext}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* DESPUÉS - After Column */}
            <div className={`${visibleSections.has("antes-despues") ? "animate-fade-in-right" : ""}`}>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 lg:p-10 shadow-xl border-2 border-green-200 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-xl transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-lg transform -translate-x-12 translate-y-12"></div>

                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-lg">
                      Después
                    </div>
                  </div>

                  <div className="space-y-6">
                    {[
                      {
                        icon: "⚡",
                        text: "Reducción de hasta 70%",
                        subtext: "del tiempo operativo",
                      },
                      {
                        icon: "📈",
                        text: "Procesos medibles, escalables",
                        subtext: "y predecibles",
                      },
                      {
                        icon: "🤖",
                        text: "Flujos automáticos con IA",
                        subtext: "y bots 24/7",
                      },
                      {
                        icon: "🍀",
                        text: "Integración completa entre equipos,",
                        subtext: "procesos y sistemas",
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-4 group">
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-800 font-semibold text-lg leading-tight">{item.text}</p>
                          <p className="text-slate-600 mt-1">{item.subtext}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quién está detrás de Meikify */}
      <section
        id="fundador"
        className="py-24 bg-gradient-to-br from-slate-50 via-white to-cyan-50 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              Quién está{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text">
                detrás de Meikify
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Conoce la experiencia y visión que impulsa cada transformación digital
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Imagen del fundador */}
            <div className={`${visibleSections.has("fundador") ? "animate-fade-in-left" : ""}`}>
              <div className="relative">
                {/* Placeholder para la imagen - aquí puedes agregar la foto de Joan */}
                <div className="w-full max-w-md mx-auto">
                  <div className="relative">
                    {/* Efectos decorativos alrededor de la imagen */}
                    <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-3xl blur-xl"></div>
                    <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-3xl blur-xl"></div>

                    {/* Contenedor de la imagen */}
                    <div className="relative bg-white rounded-3xl p-2 shadow-2xl">
                      <div className="w-full h-[500px] rounded-2xl overflow-hidden">
                        <img
                          src="/images/joan_toro.jpeg"
                          alt="Joan Toro - Fundador de Meikify"
                          className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido del fundador */}
            <div className={`space-y-8 ${visibleSections.has("fundador") ? "animate-fade-in-right" : ""} text-center sm:text-left`}>
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-slate-900 leading-tight">La visión detrás de Meikify</h3>

                <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
                  <p className="text-xl font-semibold text-slate-800">Soy Joan Toro, fundador de Meikify.</p>
                  <p>
                    Llevo más de <strong>12 años ayudando a empresas</strong> a transformar su forma de trabajar,
                    combinando estrategia, tecnología y personas para obtener resultados concretos y sostenibles.
                  </p>
                  <p>
                    Mi propósito es claro: <strong className="text-cyan-600">hacer que las cosas pasen</strong> con
                    soluciones ágiles, humanas y eficaces.
                  </p>

                  <p>
                    Integro mi experiencia como <strong>ejecutivo, docente y consultor</strong> para guiar a las
                    organizaciones en su evolución, alineando sus equipos y procesos con la potencia de la inteligencia
                    artificial y la automatización.
                  </p>
                </div>

                {/* Credenciales destacadas */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                  {[
                    { icon: <Brain className="w-6 h-6" />, title: "Ejecutivo", desc: "Liderazgo estratégico" },
                    { icon: <Users className="w-6 h-6" />, title: "Docente", desc: "Formación especializada" },
                    { icon: <Target className="w-6 h-6" />, title: "Consultor", desc: "Resultados medibles" },
                  ].map((credential, index) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="inline-flex p-3 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white mb-3">
                        {credential.icon}
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1">{credential.title}</h4>
                      <p className="text-sm text-slate-600">{credential.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="diagnostico" className="py-24 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Genera tu diagnóstico inteligente en menos de{" "}
                <span className="text-transparent bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text">
                  2 minutos
                </span>
              </h2>
              <div className="space-y-2 text-lg text-slate-300">
                <p>Descubre cómo automatizar tareas, ahorrar tiempo y aumentar tus ventas con IA.</p>
                <p>Recibirás un informe personalizado con análisis y recomendaciones en tu correo o WhatsApp.</p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl">
              <form className="space-y-6" onSubmit={handleFormSubmit}>
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Juan Perez"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="ejemplo@empresa.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                {/* WhatsApp Field */}
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-semibold text-slate-700 mb-2">
                    WhatsApp (con código país)
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    placeholder="+56912345678"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                {/* Company Field */}
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-slate-700 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    placeholder="ACME Ltda."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                {/* Position Field */}
                <div>
                  <label htmlFor="position" className="block text-sm font-semibold text-slate-700 mb-2">
                    Cargo
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    placeholder="Gerente de Operaciones"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                {/* Process Field */}
                <div>
                  <label htmlFor="process" className="block text-sm font-semibold text-slate-700 mb-2">
                    ¿Qué tarea o proceso te gustaría automatizar?
                  </label>
                  <textarea
                    id="process"
                    name="process"
                    rows={4}
                    placeholder="Ej: 'Responder mensajes de WhatsApp, Emitir facturas'"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 resize-none"
                    required
                  />
                </div>

                {/* reCAPTCHA - Add this before the Submit Button */}
                <div className="flex justify-center">
                  <div
                    className="g-recaptcha"
                    data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    data-callback="onRecaptchaChange"
                  ></div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!recaptchaToken}
                    className={`
                      w-full
                      px-4 sm:px-8
                      py-3 sm:py-4
                      text-base sm:text-lg
                      font-bold
                      rounded-xl
                      shadow-xl
                      hover:shadow-2xl
                      transition-all duration-300
                      transform hover:scale-[1.02]
                      flex items-center justify-center gap-2
                      ${!recaptchaToken
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      }
                      text-white
                    `}
                    onClick={() => {
                      if (recaptchaToken) {
                        analytics.trackCTAClick("Generar diagnóstico con IA", "formulario")
                      }
                    }}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span className="whitespace-nowrap">Generar diagnóstico con IA</span>
                  </Button>
                </div>

                {/* Privacy Notice */}
                <div className="flex items-start space-x-3 pt-4 text-sm text-slate-600">
                  <Shield className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>No compartimos tus datos con nadie.</strong> Solo los usamos para generar tu propuesta
                    personalizada.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Futuristic CTA */}
      <section
        id="contacto"
        className="py-24 bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-900 text-white relative overflow-hidden overflow-visible"
      >
        <div className="container mx-auto px-6 relative z-20">
          <div className={`${visibleSections.has("contacto") ? "animate-fade-in-scale" : ""}`}>
            {/* Título centrado */}
            <div className="text-center mb-16">
              <h2 className="text-6xl font-black leading-tight mb-6">
                ¿Listo para el{" "}
                <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">
                  salto cuántico
                </span>
                ?
              </h2>
              <p className="text-2xl text-blue-100 leading-relaxed">
                Tu competencia ya está automatizando. No te quedes atrás en la revolución de la IA.
              </p>
            </div>
            {/* Features alineados al centro */}
            <div className="text-center mb-16">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-8 justify-items-center">
                <h3 className="text-3xl font-bold text-cyan-300">Comienza tu transformación</h3>
                <div className="space-y-4">
                  {[
                    { icon: <Star className="w-6 h-6" />, text: "Diagnóstico express" },
                    { icon: <Shield className="w-6 h-6" />, text: "Garantía de resultados" },
                    { icon: <Users className="w-6 h-6" />, text: "Soporte 24/7 especializado" },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-4 text-cyan-300">
                      {feature.icon}
                      <span className="font-medium text-lg">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8">
                <Button
                  onClick={handleDemoRequest}
                  size="lg"
                  variant="outline"
                  className="border-2 text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105 bg-transparent w-full sm:w-auto px-8 py-4"
                  style={{
                    borderColor: "#00bce7",
                    color: "#00bce7",
                  }}
                  onMouseEnter={(e) => {
                    ;(e.target as HTMLElement).style.backgroundColor = "#00bce7"
                    ;(e.target as HTMLElement).style.color = "#1e293b"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.target as HTMLElement).style.backgroundColor = "transparent"
                    ;(e.target as HTMLElement).style.color = "#00bce7"
                  }}
                >
                  Diagnóstico Gratis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-slate-900 py-16 text-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Logo and Tagline */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src="/images/meikify-logo.webp" alt="Meikify Logo" className="h-10 w-auto object-contain" />
              </div>
              <p className="text-slate-300 leading-relaxed max-w-sm">
                Potencia tu equipo con IA y logra nuevos resultados.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Navegación</h4>
              <ul className="space-y-4 text-slate-300">
                <li>
                  <a
                    href="#hero"
                    className="hover:text-cyan-400 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault()
                      const element = document.querySelector("#hero")
                      if (element) {
                        const headerHeight = 80
                        const elementPosition = element.offsetTop - headerHeight
                        window.scrollTo({
                          top: elementPosition,
                          behavior: "smooth",
                        })
                      }
                    }}
                  >
                    Inicio
                  </a>
                </li>
                <li>
                  <a
                    href="#soluciones"
                    className="hover:text-cyan-400 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault()
                      const element = document.querySelector("#soluciones")
                      if (element) {
                        const headerHeight = 80
                        const elementPosition = element.offsetTop - headerHeight
                        window.scrollTo({
                          top: elementPosition,
                          behavior: "smooth",
                        })
                      }
                    }}
                  >
                    Soluciones
                  </a>
                </li>
                <li>
                  <a
                    href="#metodologia"
                    className="hover:text-cyan-400 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault()
                      const element = document.querySelector("#metodologia")
                      if (element) {
                        const headerHeight = 80
                        const elementPosition = element.offsetTop - headerHeight
                        window.scrollTo({
                          top: elementPosition,
                          behavior: "smooth",
                        })
                      }
                    }}
                  >
                    Metodología
                  </a>
                </li>
                <li>
                  <a
                    href="#diagnostico"
                    className="hover:text-cyan-400 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault()
                      const element = document.querySelector("#diagnostico")
                      if (element) {
                        const headerHeight = 80
                        const elementPosition = element.offsetTop - headerHeight
                        window.scrollTo({
                          top: elementPosition,
                          behavior: "smooth",
                        })
                      }
                    }}
                  >
                    Diagnóstico
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Contacto</h4>
              <div className="space-y-4 text-slate-300">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <a href="mailto:hola@meikify.cl" className="hover:text-cyan-400 transition-colors">
                    hola@meikify.cl
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400">📞</span>
                  <a
                    href="#"
                    onClick={() => handleWhatsAppClick("footer")}
                    className="hover:text-cyan-400 transition-colors"
                  >
                    +56 9 5899 5317
                  </a>
                </div>

                {/* Social Media Icons */}
                <div className="flex space-x-4 pt-4 text-white">
                  <a href="https://www.linkedin.com/company/meikifycl/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} className="text-cyan-300 hover:text-gray-400 text-2xl" />
                  </a>
                  <a href="https://www.instagram.com/joan.meikify/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faInstagram} className="text-cyan-300 hover:text-gray-400 text-2xl" />
                  </a>
                  <a href="https://www.youtube.com/@joan.meikify" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faYoutube} className="text-cyan-300 hover:text-gray-400 text-2xl" />
                  </a>
                  <a href="https://www.tiktok.com/@joan.meikify" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faTiktok} className="text-cyan-300 hover:text-gray-400 text-2xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-700 mt-12 pt-8">
            <p className="text-slate-400 text-center">© 2025 Meikify. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Scroll Tracking Component */}
      <ScrollTracker
        sections={[
          "hero",
          "soluciones",
          "metodologia",
          "casos",
          "fundador",
          "antes-despues",
          "diagnostico",
          "contacto",
        ]}
      />

      {/* reCAPTCHA Global Callback */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.onRecaptchaChange = function(token) {
              window.dispatchEvent(new CustomEvent('recaptcha-change', { detail: token }));
            };
          `,
        }}
      />
    </div>
  )
}
