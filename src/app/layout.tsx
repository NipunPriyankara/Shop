import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SettingsProvider, StoreSettings } from "@/context/SettingsContext";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionWrapper from "@/components/SessionWrapper";
import { Toaster } from "react-hot-toast";
import MobileBottomNav from "@/components/MobileBottomNav";
import prisma from "@/lib/db";

import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "GlowLK — Beauty & Skincare Sri Lanka",
  description: "Premium international skincare brands delivered to your door in Sri Lanka. Shop The Ordinary, CeraVe, COSRX, Laneige and more.",
  keywords: "skincare sri lanka, beauty products sri lanka, The Ordinary Sri Lanka, CeraVe Sri Lanka",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  // Fetch settings directly from database on server side
  let dbSettings = null;
  try {
    dbSettings = await prisma.storeSetting.findUnique({
      where: { id: 'default' },
    });
  } catch (err) {
    console.error("Failed to fetch layout settings:", err);
  }

  const initialSettings: StoreSettings = {
    storeName: dbSettings?.storeName || 'GlowLK',
    storeEmail: dbSettings?.storeEmail || 'hello@glowlk.com',
    storePhone: dbSettings?.storePhone || '+94 70 229 9696',
    whatsapp: dbSettings?.whatsapp || '+94702299696',
    freeShippingThreshold: dbSettings?.freeShippingThreshold !== undefined ? Number(dbSettings.freeShippingThreshold) : 5000,
    standardShipping: dbSettings?.standardShipping !== undefined ? Number(dbSettings.standardShipping) : 350,
    announcement: dbSettings?.announcement || '🌟 Free delivery on orders above Rs. 5,000 | Cash on Delivery Available Island-wide',
    logoUrl: dbSettings?.logoUrl || '',
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <SessionWrapper session={session}>
          <SettingsProvider initialSettings={initialSettings}>
            <CartProvider>
              <WishlistProvider>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: '#ffffff',
                      color: '#121212',
                      border: '1px solid rgba(18,18,18,0.08)',
                      boxShadow: '0 4px 20px rgba(18,18,18,0.06)',
                      fontSize: '12px',
                      fontWeight: '600',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      borderRadius: '0px',
                    },
                  }}
                />
                <div className="pb-16 md:pb-0">
                  {children}
                </div>
                <MobileBottomNav />
              </WishlistProvider>
            </CartProvider>
          </SettingsProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}

