// TitleProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';

const TitleContext = createContext<(title: string) => void>(() => {});

export const useTitle = () => useContext(TitleContext);

export const TitleProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState('My App');

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <TitleContext.Provider value={setTitle}>
      {children}
    </TitleContext.Provider>
  );
};
