import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Vollkorn, Bitter, Mohave } from 'next/font/google'
import React from 'react'
import Script from 'next/script'

import { GLightboxInit } from './GLightboxInit.client'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const vollkorn = Vollkorn({
  subsets: ['latin'],
  variable: '--font-vollkorn',
  display: 'swap',
})

const bitter = Bitter({
  subsets: ['latin'],
  variable: '--font-bitter',
  display: 'swap',
})

const mohave = Mohave({
  subsets: ['latin'],
  variable: '--font-mohave',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={cn(vollkorn.variable, bitter.variable, mohave.variable)}
      lang="en"
      data-theme="light"
    >
      <body>
        <link rel="preconnect" href="https://app.snipcart.com" />
        <link rel="preconnect" href="https://cdn.snipcart.com" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.3.3/default/snipcart.css" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
        <div hidden id="snipcart" data-api-key={process.env.NEXT_PUBLIC_SNIPCART_API_KEY} />
        <Script src="https://cdn.snipcart.com/themes/v3.3.3/default/snipcart.js" strategy="afterInteractive" />
        <Script src="https://kit.fontawesome.com/90da15346b.js" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script
          id="mailerlite-universal"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[]).push(arguments);},l=d.createElement(e),l.async=1,l.src=u,n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');ml('account','1180415');`,
          }}
        />
        <GLightboxInit />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-BM1ZCVJZ0G" strategy="afterInteractive" />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-BM1ZCVJZ0G');`,
          }}
        />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.redletterclay.com'),
  title: {
    default: 'Handmade Pottery & Ceramics - Red Letter Clay by Davey Ball - Made in Chicago',
    template: '%s | Handmade Pottery & Ceramics - Red Letter Clay by Davey Ball - Made in Chicago',
  },
  description:
    'Thoughtfully made ceramic mugs, bowls, vases & planters by Chicago artist Davey Ball. Unique stoneware pottery for everyday use. Shop online or visit at local markets.',
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
  icons: [
    { rel: 'icon', type: 'image/png', sizes: '96x96', url: '/favicon-96x96.png' },
    { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' },
    { rel: 'shortcut icon', url: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
  ],
}
