import type React from 'react';
import { createContext, useContext, useState } from 'react';

import type { RuntimeThemeTokens } from './runtimeTheme';
import type { LayoutTab } from '../types/domain';

interface RuntimeThemeContextValue {
  activeTheme: RuntimeThemeTokens | null;
  setActiveTheme: (theme: RuntimeThemeTokens) => void;
  activeTabs: readonly LayoutTab[];
  setActiveTabs: (tabs: LayoutTab[]) => void;
}

const RuntimeThemeContext = createContext<RuntimeThemeContextValue | null>(null);

export const RuntimeThemeProvider = ({ children }: React.PropsWithChildren): React.ReactElement => {
  const [activeTheme, setActiveTheme] = useState<RuntimeThemeTokens | null>(null);
  const [activeTabs, setActiveTabs] = useState<LayoutTab[]>([]);
  return (
    <RuntimeThemeContext.Provider value={{ activeTheme, setActiveTheme, activeTabs, setActiveTabs }}>
      {children}
    </RuntimeThemeContext.Provider>
  );
};

export const useRuntimeThemeContext = (): RuntimeThemeContextValue => {
  const context = useContext(RuntimeThemeContext);
  if (context === null) throw new Error('RuntimeThemeProvider is missing from the navigation tree.');
  return context;
};
