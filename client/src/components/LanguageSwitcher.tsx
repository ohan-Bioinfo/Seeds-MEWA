import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background hover:bg-secondary transition-colors text-sm font-bold text-foreground"
      aria-label="Switch language"
    >
      {language === 'en' ? 'AR' : 'EN'}
    </button>
  );
}
