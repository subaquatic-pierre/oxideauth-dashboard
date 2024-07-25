import * as React from 'react';
import type { Viewport } from 'next';

import 'styles/global.css';

import { AuthContextProvider } from 'contexts/AuthContext';
import NextAppDirEmotionCacheProvider from 'contexts/EmotionCacheContext';
import { LocalizationProvider } from 'contexts/LocalizationContext';
import NotificationContextProvider from 'contexts/NotificationContext';
import { ThemeProvider } from 'contexts/ThemeContext';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <LocalizationProvider>
          <AuthContextProvider>
            <ThemeProvider>
              <NotificationContextProvider>{children}</NotificationContextProvider>
            </ThemeProvider>
          </AuthContextProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
