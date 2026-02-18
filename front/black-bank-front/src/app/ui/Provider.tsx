import { CssBaseline } from '@mui/material';

export const UIProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      {children}
      <CssBaseline />
    </>
  );
};
