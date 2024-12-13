import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { unstable_setRequestLocale } from 'next-intl/server';
import { getMessages } from 'next-intl/server';
import React from "react";
import { ModalProvider } from "../components/Modal/ModalContext";
import GlobalModal  from "../components/Modal/GlobalModal";

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export type Locale = 'en' | 'et' | 'ru';

export function generateStaticParams(): { locale: Locale }[] {
  const locales: Locale[] = ['en', 'et', 'ru'];
  return locales.map(locale => ({ locale }));
}

const Layout = async ({ children, params: { locale } }: RootLayoutProps) => {
  const messages = await getMessages();
  unstable_setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <ModalProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
            <GlobalModal/>
          </NextIntlClientProvider>
        </ModalProvider>
      </body>
    </html>
  );
}

export default Layout;
