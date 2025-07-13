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
} from "lucide-react"

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

export default function MeikifyWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [visibleSections, setVisibleSections] = useState(new Set())
  const [visibleMethodologyCards, setVisibleMethodologyCards] = useState(new Set())
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)

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
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!recaptchaToken) {
      alert("Por favor, completa la verificación reCAPTCHA")
      return
    }

    // Here you would normally send the form data to your backend
    console.log("Form submitted with reCAPTCHA token:", recaptchaToken)
  }

  const phoneNumber = "56958995317"
  const message =
    "¡Hola! Me interesa conocer más sobre cómo la automatización inteligente transforma cada aspecto de mi operación ¿Podrían ayudarme con información?"

  const handleClick = () => {
    // Crear la URL de WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`

    // Abrir en nueva ventana
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden pt-28">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
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
                <img src="/images/meikify-logo.webp" alt="Meikify Logo" className="w-auto object-contain"
                style={{height: "36px"}}/>
              </a>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { name: "Soluciones", href: "#soluciones" },
                { name: "Metodología", href: "#metodologia" },
                { name: "Tecnologías", href: "#tecnologias" },
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
                  { name: "Tecnologías", href: "#tecnologias" },
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
                    const element = document.querySelector("#contacto")
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
                  Diagnóstico Gratis
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Revolutionary Hero */}
      <section
        id="hero"
        className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-slate-50 via-white to-cyan-50"
      >
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-18 items-center">
          {/* Left Content */}
          <div className={`space-y-8 relative z-10 ${visibleSections.has("hero") ? "animate-fade-in-left" : ""}`}>
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-black leading-none">
                <span className="block text-slate-900">Automatiza.</span>
                <span
                  className="block text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(to right, #00bce7, #0ea5e9)" }}
                >
                  Optimiza.
                </span>
                <span className="block text-yellow-500">Escala.</span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                Transformamos tu negocio con <strong>IA avanzada</strong> que libera a tu equipo de tareas repetitivas y
                multiplica su productividad.
              </p>
            </div>
          </div>

          {/* Right Visual */}
          <div id="content-robot">
            <div className="relative w-full flex items-center justify-center py-8 min-h-[400px]">
              {/* Robot GIF */}
              <div className="relative z-10 hidden md:block">
                <video
                  ref={videoRef}
                  src="/videos/video_home.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full max-w-lg md:max-w-2xl h-auto md:h-[600px] rounded-2xl shadow-2xl shadow-cyan-500/80 mx-auto"
                  style={{
                    backgroundColor: "transparent",
                    width: "100%",
                    maxHeight: "500px",
                    height: "auto",
                  }}
                />
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
              Descubre cómo la automatización inteligente transforma cada aspecto de tu operación
            </p>
          </div>

          {/* Layout con Robot a la derecha */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Cards de beneficios - 8 columnas */}
            <div className="lg:col-span-8 grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: <Shield className="w-16 h-16" />,
                  title: "Cero errores humanos",
                  description:
                    "Elimina completamente los errores manuales con sistemas que aprenden y se perfeccionan continuamente.",
                  color: "from-green-400 to-emerald-500",
                  stat: "99.9% precisión",
                },
                {
                  icon: <Rocket className="w-16 h-16" />,
                  title: "Velocidad sobrehumana",
                  description:
                    "Procesa miles de tareas en segundos. Lo que antes tomaba días, ahora se completa instantáneamente.",
                  color: "from-[#00bce7] to-blue-500",
                  stat: "1000x más rápido",
                },
                {
                  icon: <TrendingUp className="w-16 h-16" />,
                  title: "Crecimiento exponencial",
                  description:
                    "Escala sin límites. Nuestros sistemas crecen contigo, adaptándose a cualquier volumen de trabajo.",
                  color: "from-yellow-400 to-orange-500",
                  stat: "Escalabilidad infinita",
                },
                {
                  icon: <Brain className="w-16 h-16" />,
                  title: "Inteligencia adaptativa",
                  description:
                    "Sistemas que aprenden de tu negocio y se adaptan automáticamente a nuevos desafíos y oportunidades.",
                  color: "from-purple-400 to-pink-500",
                  stat: "Aprendizaje continuo",
                },
              ].map((benefit, index) => (
                <Card
                  key={index}
                  className={`bg-slate-800 border-slate-700 hover:bg-slate-750 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group ${
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

            {/* Robot - 4 columnas */}
            <div className="lg:col-span-4 flex justify-center items-start">
              <div className="relative">
                {/* Efectos de fondo para el robot */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-purple-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>

                {/* Robot */}
                <div className={`relative z-10 `}>
                  <img
                    src="/images/meikify-robot-new.png"
                    alt="Meikify AI Robot"
                    className="w-full max-w-sm h-auto object-contain opacity-90 drop-shadow-2xl"
                  />
                </div>

                
              </div>
            </div>
          </div>

          
        </div>
      </section>

      {/* Revolutionary Methodology */}
      <section id="metodologia" className="py-24 bg-gradient-to-br from-white via-cyan-50 to-yellow-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              Metodología{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text">
                revolucionaria
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Un proceso científico que garantiza resultados extraordinarios en tiempo récord
            </p>
          </div>

          <div className="relative">
            {/* Central Timeline */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#00bce7] via-blue-500 to-yellow-400 hidden lg:block"></div>

            <div className="space-y-24">
              {[
                {
                  phase: "01",
                  title: "Diagnóstico Cuántico",
                  description:
                    "Analizamos cada proceso con IA avanzada, identificando oportunidades invisibles al ojo humano.",
                  icon: <Brain className="w-12 h-12" />,
                  color: "from-purple-500 to-pink-500",
                  side: "left",
                },
                {
                  phase: "02",
                  title: "Arquitectura Inteligente",
                  description: "Diseñamos sistemas que piensan, aprenden y evolucionan automáticamente con tu negocio.",
                  icon: <Cog className="w-12 h-12" />,
                  color: "from-[#00bce7] to-blue-500",
                  side: "right",
                },
                {
                  phase: "03",
                  title: "Implementación Ninja",
                  description:
                    "Desplegamos sin interrumpir tu operación, con transiciones tan suaves que son imperceptibles.",
                  icon: <Zap className="w-12 h-12" />,
                  color: "from-green-500 to-emerald-500",
                  side: "left",
                },
                {
                  phase: "04",
                  title: "Evolución Continua",
                  description: "Tu sistema mejora solo, aprende de cada interacción y se optimiza constantemente.",
                  icon: <Target className="w-12 h-12" />,
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
                            <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                          </div>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-lg">{step.description}</p>
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

      {/* Tecnologías de Vanguardia */}
      <section
        id="tecnologias"
        className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative overflow-hidden"
      >
        {/* Robot Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <img
            src="/images/robot_esfera.png"
            alt="Meikify Robot Background"
            className="w-full max-w-2xl h-auto object-contain"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              Tecnologías de{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text">
                vanguardia
              </span>{" "}
              que impulsan tu crecimiento
            </h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Nuestro stack tecnológico combina plataformas de orquestación de contenedores, herramientas de integración
              de workflows, bases de datos avanzadas y motores de mensajería, garantizando soluciones eficientes,
              seguras y escalables.
            </p>
          </div>

          {/* Animated Logo Carousel - Full Width */}
          <div className="relative -mx-6 lg:-mx-0">
            {/* Extend carousel to full viewport width */}
            <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10"></div>

              {/* Carousel Container */}
              <div className="overflow-hidden py-8">
                <div className="flex animate-scroll-infinite">
                  {/* First Set of Logos */}
                  {[
                    { name: "Portainer", src: "images/stack/portainer_1.png", description: "Container Management" },
                    { name: "Traefik", src: "images/stack/traefik.svg", description: "Reverse Proxy" },
                    { name: "MinIO", src: "images/stack/minio.svg", description: "Object Storage" },
                    { name: "n8n", src: "images/stack/n8n.svg", description: "Workflow Automation" },
                    { name: "PostgreSQL", src: "images/stack/postgresql.svg", description: "Database" },
                    { name: "Redis", src: "images/stack/redis.svg", description: "In-Memory DB" },
                    { name: "Evolution API", src: "images/stack/evolutionapi.svg", description: "WhatsApp API" },
                    { name: "Chatwoot", src: "images/stack/chatwoot.svg", description: "Customer Support" },
                    { name: "Flowise", src: "images/stack/flowise.svg", description: "AI Workflows" },
                    { name: "RabbitMQ", src: "images/stack/rabbitmq.svg", description: "Message Broker" },
                    { name: "Qdrant", src: "images/stack/qdrant.svg", description: "Vector Database" },
                    { name: "Supabase", src: "images/stack/supabase.svg", description: "Backend Platform" },
                    { name: "NocoDB", src: "images/stack/nocodb.svg", description: "No-Code Database" },
                  ].map((tech, index) => (
                    <div key={`first-${index}`} className="flex-shrink-0 mx-6 group cursor-pointer">
                      <div className="w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center p-4 shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                        <img
                          src={tech.src || "/placeholder.svg"}
                          alt={tech.name}
                        />
                      </div>
                      <div className="text-center mt-3 space-y-1">
                        <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {tech.name}
                        </div>
                        <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                          {tech.description}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Duplicate Set for Seamless Loop */}
                  {[
                    { name: "Portainer", src: "images/stack/portainer_1.png", description: "Container Management" },
                    { name: "Traefik", src: "images/stack/traefik.svg", description: "Reverse Proxy" },
                    { name: "MinIO", src: "images/stack/minio.svg", description: "Object Storage" },
                    { name: "n8n", src: "images/stack/n8n.svg", description: "Workflow Automation" },
                    { name: "PostgreSQL", src: "images/stack/postgresql.svg", description: "Database" },
                    { name: "Redis", src: "images/stack/redis.svg", description: "In-Memory DB" },
                    { name: "Evolution API", src: "images/stack/evolutionapi.svg", description: "WhatsApp API" },
                    { name: "Chatwoot", src: "images/stack/chatwoot.svg", description: "Customer Support" },
                    { name: "Flowise", src: "images/stack/flowise.svg", description: "AI Workflows" },
                    { name: "RabbitMQ", src: "images/stack/rabbitmq.svg", description: "Message Broker" },
                    { name: "Qdrant", src: "images/stack/qdrant.svg", description: "Vector Database" },
                    { name: "Supabase", src: "images/stack/supabase.svg", description: "Backend Platform" },
                    { name: "NocoDB", src: "images/stack/nocodb.svg", description: "No-Code Database" },
                  ].map((tech, index) => (
                    <div key={`second-${index}`} className="flex-shrink-0 mx-6 group cursor-pointer">
                      <div className="w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center p-4 shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                        <img
                          src={tech.src || "/placeholder.svg"}
                          alt={tech.name}
                          
                        />
                      </div>
                      <div className="text-center mt-3 space-y-1">
                        <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {tech.name}
                        </div>
                        <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                          {tech.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Casos de Éxito
      <section id="casos" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              Casos de{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text">
                éxito reales
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Descubre cómo hemos transformado negocios como el tuyo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Onboarding automatizado",
                description:
                  "Automatizamos el proceso completo de onboarding de clientes para una empresa fintech, reduciendo el tiempo de 5 días a 2 horas.",
                impact: "90% reducción de tiempo",
                industry: "Fintech",
              },
              {
                title: "Gestión de inventario inteligente",
                description:
                  "Implementamos un sistema de reposición automática que predice demanda y optimiza stock en tiempo real.",
                impact: "40% menos costos de inventario",
                industry: "E-commerce",
              },
              {
                title: "Atención al cliente 24/7",
                description:
                  "Desarrollamos un chatbot inteligente que resuelve 80% de consultas automáticamente y deriva casos complejos.",
                impact: "80% consultas automatizadas",
                industry: "Servicios",
              },
            ].map((useCase, index) => (
              <Card
                key={index}
                className={`hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                  visibleSections.has("casos") ? `animate-fade-in-up animate-stagger-${index + 1}` : ""
                }`}
              >
                <CardContent className="p-8">
                  <div className="text-sm font-semibold mb-2" style={{ color: "#00bce7" }}>
                    {useCase.industry}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{useCase.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{useCase.description}</p>
                  <div className="text-lg font-bold text-green-600">{useCase.impact}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      */}
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
                    className={`w-full px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                      !recaptchaToken
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    } text-white`}
                  >
                    <Sparkles className="mr-3" size={20} />
                    Generar diagnóstico con IA
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
        {/* Robot centrado, con manos sobresaliendo del fondo */}
        <div className="absolute bottom-[-65px] left-1/2 transform -translate-x-1/2 z-10 pointer-events-none hidden md:block">
          <img
            src="/images/robot_pose_mano.png"
            alt="Robot Meikify"
            className="w-[800px] md:w-[900px] lg:w-[1000px] xl:w-[1100px]"
          />
        </div>

        <div className="container mx-auto px-6 text-center relative z-20">
          <div
            className={`mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-12 ${
              visibleSections.has("contacto") ? "animate-fade-in-scale" : ""
            }`}
          >
            {/* Texto alineado a la izquierda */}
            <div className="flex-1 text-left">
              <h2 className="text-6xl w-3/4 font-black leading-tight text-left">
                ¿Listo para el{" "}
                <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">
                  salto cuántico
                </span>
                ?
              </h2>
              <p className="text-2xl text-blue-100 leading-relaxed mt-6 text-left w-3/4">
                Tu competencia ya está automatizando. No te quedes atrás en la revolución de la IA.
              </p>
            </div>
            {/* Features alineados a la derecha */}
            <div className="flex-1 pt-12 md:pt-0 md:pl-12">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-8 justify-items-end">
                <h3 className="text-3xl font-bold text-cyan-300">Comienza tu transformación</h3>
                  <div className="space-y-4">
                    {[
                      { icon: <Star className="w-6 h-6" />, text: "Diagnóstico gratuito en 24h" },
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
                    onClick={handleClick}
                    size="lg"
                    variant="outline"
                    className="border-2 text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105 bg-transparent w-full sm:w-auto px-8 py-4"
                    style={{
                      borderColor: "#00bce7",
                      color: "#00bce7",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = "#00bce7";
                      (e.target as HTMLElement).style.color = "#1e293b"
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = "transparent";
                      (e.target as HTMLElement).style.color = "#00bce7"
                    }}
                  >
                    <Calendar className="mr-3" size={20} />
                    Agendar Demo VIP
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
                  <a href="#" onClick={handleClick} className="hover:text-cyan-400 transition-colors">
                    +56 9 5899 5317
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <a href="https://calendar.notion.so/meet/joanmeikify/diary" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                    Agendar diagnóstico
                  </a>
                </div>

                {/* Social Media Icons */}
                <div className="flex space-x-4 pt-4">
                  <a href="https://www.linkedin.com/company/meikifycl/" target="_blank" rel="noopener noreferrer">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <img src="/images/linkedin_logo.png" alt="Meikify Logo" className="w-auto object-contain" />
                    </div>
                  </a>
                  <a href="https://www.instagram.com/joan.meikify/" target="_blank" rel="noopener noreferrer">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                      <img src="/images/instagram_logo.png" alt="instagram" className="w-auto object-contain" />
                    </div>
                  </a>
                  <a href="https://www.youtube.com/@joan.meikify" target="_blank" rel="noopener noreferrer">
                    <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                      <span className="text-white text-sm">▶</span>
                    </div>
                  </a>
                  <a href="https://www.tiktok.com/@joan.meikify" target="_blank" rel="noopener noreferrer">
                    <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                      <img src="/images/tiktok_logo.avif" alt="instagram" className="w-auto object-contain" />
                    </div>
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
    </div>
  )
}
