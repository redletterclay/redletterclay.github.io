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

const snipcartLoaderScript =
  "window.SnipcartSettings={publicApiKey:'" +
  process.env.NEXT_PUBLIC_SNIPCART_API_KEY +
  "',loadStrategy:'on-user-interaction'};(()=>{var c,d;(d=(c=window.SnipcartSettings).version)!=null||(c.version='3.0');var s,S;(S=(s=window.SnipcartSettings).timeoutDuration)!=null||(s.timeoutDuration=2750);var l,p;(p=(l=window.SnipcartSettings).domain)!=null||(l.domain='cdn.snipcart.com');var w,u;(u=(w=window.SnipcartSettings).protocol)!=null||(w.protocol='https');var f=window.SnipcartSettings.version.includes('v3.0.0-ci')||window.SnipcartSettings.version!='3.0'&&window.SnipcartSettings.version.localeCompare('3.4.0',void 0,{numeric:!0,sensitivity:'base'})===-1,m=['focus','mouseover','touchmove','scroll','keydown'];window.LoadSnipcart=o;document.readyState==='loading'?document.addEventListener('DOMContentLoaded',r):r();function r(){window.SnipcartSettings.loadStrategy?window.SnipcartSettings.loadStrategy==='on-user-interaction'&&(m.forEach(t=>document.addEventListener(t,o)),setTimeout(o,window.SnipcartSettings.timeoutDuration)):o()}var a=!1;function o(){if(a)return;a=!0;let t=document.getElementsByTagName('head')[0],e=document.querySelector('#snipcart'),i=document.querySelector('src[src^=\"'+window.SnipcartSettings.protocol+'://'+window.SnipcartSettings.domain+'\"][src$=\"snipcart.js\"]'),n=document.querySelector('link[href^=\"'+window.SnipcartSettings.protocol+'://'+window.SnipcartSettings.domain+'\"][href$=\"snipcart.css\"]');e||(e=document.createElement('div'),e.id='snipcart',e.setAttribute('hidden','true'),document.body.appendChild(e)),v(e),i||(i=document.createElement('script'),i.src=window.SnipcartSettings.protocol+'://'+window.SnipcartSettings.domain+'/themes/v'+window.SnipcartSettings.version+'/default/snipcart.js',i.async=!0,t.appendChild(i)),n||(n=document.createElement('link'),n.rel='stylesheet',n.type='text/css',n.href=window.SnipcartSettings.protocol+'://'+window.SnipcartSettings.domain+'/themes/v'+window.SnipcartSettings.version+'/default/snipcart.css',t.prepend(n)),m.forEach(g=>document.removeEventListener(g,o))}function v(t){!f||(t.dataset.apiKey=window.SnipcartSettings.publicApiKey,window.SnipcartSettings.addProductBehavior&&(t.dataset.configAddProductBehavior=window.SnipcartSettings.addProductBehavior),window.SnipcartSettings.modalStyle&&(t.dataset.configModalStyle=window.SnipcartSettings.modalStyle),window.SnipcartSettings.currency&&(t.dataset.currency=window.SnipcartSettings.currency),window.SnipcartSettings.templatesUrl&&(t.dataset.templatesUrl=window.SnipcartSettings.templatesUrl))}})()";

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
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
        <Script
          id="snipcart-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: snipcartLoaderScript }}
        />
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
