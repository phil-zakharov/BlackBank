import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const UIProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
      <CssBaseline />
    </ThemeProvider>
  );
};
