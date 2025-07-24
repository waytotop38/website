import { createContext, type Dispatch, type SetStateAction, use, useState } from 'react';

import { DEFAULT_LANGUAGE, LANGUAGES } from '~/common/constants';

import type { Route } from '../routes/apis/+types/language';
import { useFetcherWithCallback } from './use-fetcher-with-callback';

// * language 검증
export const isLanguage = (language: string) =>
  LANGUAGES.map((lang) => lang.split('-')[0]).includes(language);

type LanguageContextType = [string, Dispatch<SetStateAction<string>>];
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
LanguageContext.displayName = 'LanguageContext';

export interface LanguageProviderProps {
  children: React.ReactNode;
  specifiedLanguage?: string;
  languageAction: string;
}

export const LanguageProvider = ({
  children,
  specifiedLanguage,
  languageAction,
}: LanguageProviderProps) => {
  const [language, setLanguage] = useState<string>(() => {
    if (specifiedLanguage && isLanguage(specifiedLanguage)) {
      return specifiedLanguage;
    }
    return DEFAULT_LANGUAGE.split('-')[0];
  });

  const fetcher = useFetcherWithCallback<Route.ComponentProps['actionData']>(
    ({ message, language }) => {
      if (message) console.error(message);
      if (language) setLanguage(language);
    },
  );

  const handleChange = (lang: string) => {
    if (isLanguage(lang)) {
      fetcher.submit({ language: lang }, { action: languageAction, method: 'POST' });
    }
  };

  return (
    <LanguageContext.Provider value={[language, handleChange]}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = use(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageContext');
  }
  return context;
};
