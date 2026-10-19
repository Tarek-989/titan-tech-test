import TranslateIcon from '@mui/icons-material/Translate';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type AppLanguage } from '@/i18n';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const current = i18n.resolvedLanguage;

  const handleSelect = (language: AppLanguage) => {
    setAnchorEl(null);
    void i18n.changeLanguage(language);
  };

  return (
    <>
      <Tooltip title={t('language.label')}>
        <IconButton
          color="inherit"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          aria-label={t('language.label')}
          aria-haspopup="menu"
          aria-controls={anchorEl ? 'language-menu' : undefined}
        >
          <TranslateIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <MenuItem
            key={language}
            selected={language === current}
            onClick={() => handleSelect(language)}
            lang={language}
          >
            <ListItemText>{t(`language.${language}`)}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
