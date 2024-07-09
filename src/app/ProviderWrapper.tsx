'use client';

import { ReactNode } from 'react';

// next

// project import
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
// import RTLLayout from 'components/RTLLayout';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';
import { AuthContextProvider } from 'contexts/AuthContext';

// import { ConfigProvider } from 'contexts/ConfigContext';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function ProviderWrapper({ children }: { children: ReactNode }) {
  return (
    // <ConfigProvider>
    <ThemeCustomization>
      {/* <RTLLayout> */}
      <Locales>
        <ScrollTop>
          <AuthContextProvider>
            <Notistack>
              <Snackbar />
              {children}
            </Notistack>
          </AuthContextProvider>
        </ScrollTop>
      </Locales>
      {/* </RTLLayout> */}
    </ThemeCustomization>
    // {/* </ConfigProvider> */}
  );
}
