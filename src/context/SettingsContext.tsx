'use client';

import React, { createContext, useContext, useState } from 'react';

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  whatsapp: string;
  freeShippingThreshold: number;
  standardShipping: number;
  announcement: string;
  logoUrl: string;
}

interface SettingsContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings: StoreSettings;
}) {
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
