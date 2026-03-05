import { useTranslation } from 'react-i18next';

export type Language = 'ko' | 'en' | 'ja' | 'zh';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: readonly LanguageOption[] = [
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
] as const;

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: Language) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const currentLanguage = (i18n.language || 'ko') as Language;

  const currentLanguageOption = LANGUAGES.find(
    (lang) => lang.code === currentLanguage
  ) || LANGUAGES[0];

  return {
    currentLanguage,
    currentLanguageOption,
    changeLanguage,
    languages: LANGUAGES,
  };
};
