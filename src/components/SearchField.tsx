import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';

interface SearchFieldProps {
  /** Committed search term (usually from the URL). */
  value: string;
  /** Called with the trimmed term once the user stops typing. */
  onSearch: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  fullWidth?: boolean;
}

export function SearchField({
  value,
  onSearch,
  placeholder,
  debounceMs = 400,
  fullWidth = true,
}: SearchFieldProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  const debouncedSearch = useDebouncedCallback((term: string) => {
    // Skip no-op searches (e.g. only whitespace typed) so the URL and page aren't reset.
    if (term.trim() !== value) onSearch(term.trim());
  }, debounceMs);

  // Sync the input when the committed value changes from outside (e.g. browser back button).
  if (value !== syncedValue) {
    setSyncedValue(value);
    if (value !== input.trim()) setInput(value);
  }

  const handleClear = () => {
    debouncedSearch.cancel();
    setInput('');
    onSearch('');
  };

  return (
    <TextField
      type="search"
      value={input}
      onChange={(event) => {
        setInput(event.target.value);
        debouncedSearch.run(event.target.value);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') debouncedSearch.flush();
      }}
      placeholder={placeholder ?? t('common.search')}
      fullWidth={fullWidth}
      slotProps={{
        htmlInput: { 'aria-label': placeholder ?? t('common.search') },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: input && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                edge="end"
                onClick={handleClear}
                aria-label={t('common.clearSearch')}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      sx={{
        // Hide the browser's native clear button; we render our own.
        '& input::-webkit-search-cancel-button': { display: 'none' },
      }}
    />
  );
}
