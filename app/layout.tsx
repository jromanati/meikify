import type { Metadata } from 'next'
import './globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export const metadata: Metadata = {
  title: 'Meikify',
  description: "Automatiza, optimiza y escala tu negocio con inteligencia artificial.",
  generator: 'metras',
  keywords: "automatización, inteligencia artificial, IA, chatbots, procesos, eficiencia, productividad",
  authors: [{ name: "Meikify" }],
  openGraph: {
    title: "Meikify - Automatización con IA para tu negocio",
    description: "Automatiza, optimiza y escala tu negocio con inteligencia artificial.",
    url: "https://meikify.cl",
    siteName: "Meikify",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meikify - Automatización con IA para tu negocio",
    description: "Automatiza, optimiza y escala tu negocio con inteligencia artificial.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180"
        href="/images/favicon-180x180.png" />
        <link rel="icon" type="image/png" sizes="32x32"
        href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16"
        href="/images/favicon-16x16.png" />
      </head>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(d,t) {
            var BASE_URL=\"https://chatwoot.meikify.cl\";
            var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src=BASE_URL+\"/packs/js/sdk.js\";
            g.defer = true;
            g.async = true;
            s.parentNode.insertBefore(g,s);
            g.onload=function(){
              window.chatwootSDK.run({
                websiteToken: 'PjRGYXYz2DTMPx7MTjAw2jws',
                baseUrl: BASE_URL
              })
            }
          })(document,\"script\");
        `}} />
      </body>
    </html>
  )
}
