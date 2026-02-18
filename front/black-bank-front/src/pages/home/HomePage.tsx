import { Box, Container, Typography } from '@mui/material';

export function HomePage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          BlackBank
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Добро пожаловать в BlackBank.
        </Typography>
        <Box sx={{ mt: 4 }} />
      </Box>
    </Container>
  );
}
