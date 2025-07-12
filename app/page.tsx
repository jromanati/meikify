"use client"

import { useState, useEffect, useRef } from "react"
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
              <img src="/images/meikify-logo.webp" alt="Meikify Logo" className="w-auto object-contain" />
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { name: "Soluciones", href: "#soluciones" },
                { name: "Metodología", href: "#metodologia" },
                { name: "Casos", href: "#casos" },
                { name: "Contacto", href: "#contacto" },
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
                      const elementPosition = element.offsetTop - headerHeight
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
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1" : ""}`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-slate-700 mt-1 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-slate-700 mt-1 transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1" : ""}`}
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
                  { name: "Contacto", href: "#contacto" },
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
          <div 
            id="content-robot" style={{
              height: "92%",
            }}>
            <div className="relative w-full  flex items-center justify-center">
              {/* Animated Background Elements
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-20 h-20 rounded-2xl bg-gradient-to-br ${
                      i % 3 === 0
                        ? "from-cyan-400 to-blue-500"
                        : i % 3 === 1
                          ? "from-yellow-400 to-orange-500"
                          : "from-purple-400 to-pink-500"
                    } opacity-20 animate-pulse`}
                    style={{
                      left: `${(i * 15) % 80}%`,
                      top: `${(i * 20) % 70}%`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                ))}
              </div> */}

              {/* Robot GIF */}
              <div className="relative z-10">
                <video
                ref={videoRef}
                src="/videos/video_home.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-[500px] rounded-2xl shadow-2xl shadow-cyan-500/50"
                style={{
    backgroundColor: "transparent",
    width: "100%",
    height: "500px",
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

        {/* Animated Stars Background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 1}s`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          ))}

          {/* Larger twinkling stars */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 2}px`,
                height: `${Math.random() * 2 + 2}px`,
                animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}

          {/* Yellow twinkling stars */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`yellow-star-${i}`}
              className="absolute bg-yellow-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                animation: `twinkle ${Math.random() * 4 + 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
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
                    { name: "Docker", icon: "🐳", color: "from-blue-400 to-blue-600" },
                    { name: "Kubernetes", icon: "⚙️", color: "from-blue-500 to-purple-600" },
                    { name: "Python", icon: "🐍", color: "from-yellow-400 to-blue-500" },
                    { name: "Node.js", icon: "🟢", color: "from-green-400 to-green-600" },
                    { name: "React", icon: "⚛️", color: "from-cyan-400 to-blue-500" },
                    { name: "PostgreSQL", icon: "🐘", color: "from-blue-600 to-indigo-600" },
                    { name: "Redis", icon: "🔴", color: "from-red-500 to-red-600" },
                    { name: "AWS", icon: "☁️", color: "from-orange-400 to-yellow-500" },
                    { name: "OpenAI", icon: "🤖", color: "from-green-400 to-teal-500" },
                    { name: "Zapier", icon: "⚡", color: "from-orange-500 to-red-500" },
                    { name: "Slack", icon: "💬", color: "from-purple-500 to-pink-500" },
                    { name: "GitHub", icon: "🐙", color: "from-gray-600 to-gray-800" },
                    { name: "TensorFlow", icon: "🧠", color: "from-orange-500 to-red-600" },
                    { name: "MongoDB", icon: "🍃", color: "from-green-500 to-green-700" },
                    { name: "Firebase", icon: "🔥", color: "from-yellow-500 to-orange-600" },
                  ].map((tech, index) => (
                    <div key={`first-${index}`} className="flex-shrink-0 mx-8 group cursor-pointer">
                      <div
                        className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${tech.color} flex items-center justify-center text-4xl shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}
                      >
                        {tech.icon}
                      </div>
                      <div className="text-center mt-4 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                        {tech.name}
                      </div>
                    </div>
                  ))}

                  {/* Duplicate Set for Seamless Loop */}
                  {[
                    { name: "Docker", icon: "🐳", color: "from-blue-400 to-blue-600" },
                    { name: "Kubernetes", icon: "⚙️", color: "from-blue-500 to-purple-600" },
                    { name: "Python", icon: "🐍", color: "from-yellow-400 to-blue-500" },
                    { name: "Node.js", icon: "🟢", color: "from-green-400 to-green-600" },
                    { name: "React", icon: "⚛️", color: "from-cyan-400 to-blue-500" },
                    { name: "PostgreSQL", icon: "🐘", color: "from-blue-600 to-indigo-600" },
                    { name: "Redis", icon: "🔴", color: "from-red-500 to-red-600" },
                    { name: "AWS", icon: "☁️", color: "from-orange-400 to-yellow-500" },
                    { name: "OpenAI", icon: "🤖", color: "from-green-400 to-teal-500" },
                    { name: "Zapier", icon: "⚡", color: "from-orange-500 to-red-500" },
                    { name: "Slack", icon: "💬", color: "from-purple-500 to-pink-500" },
                    { name: "GitHub", icon: "🐙", color: "from-gray-600 to-gray-800" },
                    { name: "TensorFlow", icon: "🧠", color: "from-orange-500 to-red-600" },
                    { name: "MongoDB", icon: "🍃", color: "from-green-500 to-green-700" },
                    { name: "Firebase", icon: "🔥", color: "from-yellow-500 to-orange-600" },
                  ].map((tech, index) => (
                    <div key={`second-${index}`} className="flex-shrink-0 mx-8 group cursor-pointer">
                      <div
                        className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${tech.color} flex items-center justify-center text-4xl shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}
                      >
                        {tech.icon}
                      </div>
                      <div className="text-center mt-4 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                        {tech.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>


          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50+", label: "Tecnologías integradas" },
              { number: "99.9%", label: "Uptime garantizado" },
              { number: "24/7", label: "Monitoreo activo" },
              { number: "∞", label: "Escalabilidad" },
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text">
                  {stat.number}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Casos de Éxito */}
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

      {/* Futuristic CTA */}
      <section
        id="contacto"
        className="py-24 bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-900 text-white relative overflow-hidden overflow-visible"
      >
        {/* Robot centrado, con manos sobresaliendo del fondo */}
        <div className="absolute bottom-[-65px] left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
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
            </div>
          </div>
        </div>
      </section>
      {/* Contact Form Section */}
      <section className="py-24 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white">
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
              <form className="space-y-6">
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

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
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


      {/* Modern Footer */}
      <footer className="bg-white py-16 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img src="/images/meikify-logo.webp" alt="Meikify Logo" className="w-auto object-contain" />
              </div>
              <p className="text-slate-600 leading-relaxed max-w-md mb-6">
                Pioneros en automatización inteligente. Transformamos negocios con IA de vanguardia que libera el
                potencial humano.
              </p>
              <div className="flex space-x-4">
                {["LinkedIn", "Twitter", "YouTube"].map((social) => (
                  <Button key={social} variant="outline" size="sm" className="rounded-full bg-transparent">
                    {social}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Soluciones</h4>
              <ul className="space-y-3 text-slate-600">
                <li>
                  <a
                    href="#"
                    className="hover:transition-colors"
                    style={{ color: "inherit" }}
                    onMouseEnter={(e) => (e.target.style.color = "#00bce7")}
                    onMouseLeave={(e) => (e.target.style.color = "inherit")}
                  >
                    Automatización RPA
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:transition-colors"
                    style={{ color: "inherit" }}
                    onMouseEnter={(e) => (e.target.style.color = "#00bce7")}
                    onMouseLeave={(e) => (e.target.style.color = "inherit")}
                  >
                    IA Conversacional
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:transition-colors"
                    style={{ color: "inherit" }}
                    onMouseEnter={(e) => (e.target.style.color = "#00bce7")}
                    onMouseLeave={(e) => (e.target.style.color = "inherit")}
                  >
                    Integración de Sistemas
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:transition-colors"
                    style={{ color: "inherit" }}
                    onMouseEnter={(e) => (e.target.style.color = "#00bce7")}
                    onMouseLeave={(e) => (e.target.style.color = "inherit")}
                  >
                    Analytics Predictivo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Contacto</h4>
              <ul className="space-y-3 text-slate-600">
                <li>hola@meikify.cl</li>
                <li>+56 9 XXXX XXXX</li>
                <li>Santiago, Chile</li>
                <li>Lun-Vie 9:00-18:00</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500">&copy; 2024 Meikify. Revolucionando el futuro del trabajo.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-500 hover:text-cyan-600 transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-slate-500 hover:text-cyan-600 transition-colors">
                Términos
              </a>
              <a href="#" className="text-slate-500 hover:text-cyan-600 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
