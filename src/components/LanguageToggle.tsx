import { getLanguage, setLanguage, type Language } from '../utils/i18n';
import './LanguageToggle.css';

interface LanguageToggleProps {
  onLanguageChange?: (lang: Language) => void;
}

export const LanguageToggle = ({ onLanguageChange }: LanguageToggleProps) => {
  const currentLang = getLanguage();

  const handleToggle = () => {
    const newLang: Language = currentLang === 'th' ? 'en' : 'th';
    setLanguage(newLang);
    onLanguageChange?.(newLang);
  };

  return (
    <button onClick={handleToggle} className="language-toggle">
      <span className={currentLang === 'th' ? 'active' : ''}>TH</span>
      <span className="divider">|</span>
      <span className={currentLang === 'en' ? 'active' : ''}>EN</span>
    </button>
  );
};
