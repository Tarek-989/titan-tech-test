import { createTheme, type Direction } from '@mui/material/styles';

const LATIN_FONTS = '"Inter", "Segoe UI", Roboto, sans-serif';
const ARABIC_FONTS = '"Cairo", "Segoe UI", Tahoma, sans-serif';

export function createAppTheme(direction: Direction) {
  return createTheme({
    direction,
    palette: {
      primary: { main: '#4f46e5' },
      secondary: { main: '#0ea5e9' },
      background: { default: '#f6f7fb', paper: '#ffffff' },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: direction === 'rtl' ? `${ARABIC_FONTS}, ${LATIN_FONTS}` : LATIN_FONTS,
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'inherit' },
        styleOverrides: {
          root: ({ theme }) => ({ borderBottom: `1px solid ${theme.palette.divider}` }),
        },
      },
      MuiCard: { defaultProps: { variant: 'outlined' } },
      MuiPaper: { defaultProps: { elevation: 0 } },
      MuiTextField: { defaultProps: { size: 'small' } },
      MuiButton: { defaultProps: { disableElevation: true } },
    },
  });
}
