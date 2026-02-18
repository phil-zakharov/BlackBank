import { Container, Typography } from '@mui/material';
import { AccountsList } from '../../domains/accounts/ui/AccountsList';
import { CreateAccountDialog } from '../../domains/accounts/ui/CreateAccountDialog';

export function CabinetPage() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" sx={{ py: 2 }}>
        Личный кабинет
      </Typography>
      <AccountsList />
      <CreateAccountDialog />
    </Container>
  );
}
