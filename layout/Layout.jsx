import Sidebar from '@/components/Sidebar';
import React from 'react';
import { Toaster } from 'react-hot-toast';

function Layout({ children }) {
  return (
    <div>
      <div>
        <Sidebar />
      </div>
      {/* Toaster bileşenine Tailwind ile mor ve koyu tema ekledik */}
      <Toaster
        toastOptions={{
          style: {
            background: '#2D2A2E', // Dark arka plan
            color: '#FFFFFF', // Beyaz yazı
          },
          success: {
            iconTheme: {
              primary: '#9333EA', // Mor renkte başarı ikonu
              secondary: '#FFFFFF', // Beyaz ikon arkaplanı
            },
          },
          error: {
            iconTheme: {
              primary: '#E11D48', // Kırmızı hata ikonu
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      {children}
    </div>
  );
}

export default Layout;
