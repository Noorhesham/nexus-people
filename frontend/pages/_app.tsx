import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import Layout from '@/components/layout'
import { IntlProvider } from 'react-intl'
import ar from "../locales/ar.json"
import en from "../locales/en.json"
import { useRouter } from 'next/router'
import Head from 'next/head'
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import AuthContextProvider from '@/helpers/AuthContext'
import Script from 'next/script'

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
  prepend: true
});

const cacheLtr = createCache({
  key: 'muiltr',
  prepend: true
});

const messages : any = {en, ar}

let theme = createTheme({
  direction: 'ltr',

  typography: {
    h1: {
      fontSize: 150
    },
    h2: {
      fontWeight: 'bolder'
    },
    allVariants: {
      // fontFamily: '',
      textTransform: 'none',
      accentColor: '#c50002'
    },
  },
  palette: {
    primary: {
      main: '#c50002',
    },
    secondary: {
      main: '#13263d',
    },
  },
});

theme = responsiveFontSizes(theme, {
  breakpoints: ['sm', 'md', 'lg', 'xs'],
  factor: 2.2,
  variants: ['h1','h2','h3','h4', 'h5', 'h6', 'subtitle1', 'subtitle2']
})


let Arabictheme = createTheme({
  direction: 'rtl',
  typography: {
    allVariants: {
      fontFamily: 'Cairo, Poppins ',
      textTransform: 'none',
      fontWeight: 800
    },
  },
  palette: {
    primary: {
      main: '#8D0507',
    },
    secondary: {
      main: '#13263d',
    },
  },
});

Arabictheme = responsiveFontSizes(Arabictheme, {
  breakpoints: ['sm', 'md', 'lg', 'xs'],
  factor: 2,
  variants: ['h1','h2','h3','h4', 'h5', 'h6', 'subtitle1', 'subtitle2']
})
function App({ Component, pageProps }: AppProps) {
  const { locale } :any= useRouter();

  return (
    <>
    <Head>
      <title>Nexus</title>
      <meta name="description" content="Discover a modern and versatile mall offering a unique blend of commercial, medical, and administrative units. Elevate your business with smart unit options, seamlessly integrating cutting-edge technologies for enhanced efficiency and connectivity. Explore endless possibilities for growth and success in a dynamic and innovative shopping and business environment." />
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-7VBBMJP12T"
      />
      
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-7VBBMJP12T');
          `,
        }}
      />
    </Head>
    <IntlProvider locale={locale} messages={messages[locale]}>
      <CacheProvider  value={locale === 'ar'? cacheRtl: cacheLtr}>
        <ThemeProvider theme={locale === 'ar'? Arabictheme : theme}>
          <AuthContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout> 
          </AuthContextProvider>
        </ThemeProvider>
      </CacheProvider>
    </IntlProvider>
    </>

  )
}

export default appWithTranslation(App);