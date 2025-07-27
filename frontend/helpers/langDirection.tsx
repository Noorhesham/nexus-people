import { useRouter } from 'next/router';
import React, { PropsWithChildren, createContext, useState } from 'react';

interface LanguageDirectionContextProps {
  isRTL: boolean;
  setIsRTL: React.Dispatch<React.SetStateAction<boolean>>;
}

const LanguageDirectionContext = createContext<LanguageDirectionContextProps>({
  isRTL: false,
  setIsRTL: () => {},
});

interface LangProps {
  children: React.ReactNode;
}

const LanguageDirectionProvider = ({ children }:PropsWithChildren<LangProps>) => {
  const router = useRouter();
  const { locale } = router;
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [isRTL, setIsRTL] = useState(selectedLocale === 'ar');

  return (
    <LanguageDirectionContext.Provider value={{ isRTL, setIsRTL }}>
      {children}
    </LanguageDirectionContext.Provider>
  );
};

export { LanguageDirectionContext, LanguageDirectionProvider };