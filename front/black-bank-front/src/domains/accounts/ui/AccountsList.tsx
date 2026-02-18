import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeAccount } from '../model/accountsSlice';
import type { Account } from '../model/types';
import type { RootState, AppDispatch } from '../../../app/store';

export function AccountsList() {
  const dispatch = useDispatch<AppDispatch>();
  const accounts = useSelector((state: RootState) => state.accounts);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (deleteId) {
      dispatch(removeAccount(deleteId));
      setDeleteId(null);
    }
  };

  if (accounts.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 2 }}>
        Нет счетов. Создайте счёт, чтобы начать.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
      {accounts.map((account: Account) => (
        <Card key={account.id} variant="outlined">
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">{account.name}</Typography>
              <Typography color="text.secondary">
                Баланс: {account.balance.toLocaleString()} {account.currency ?? '₽'}
              </Typography>
            </Box>
            <IconButton
              color="error"
              aria-label="Удалить счёт"
              onClick={() => setDeleteId(account.id)}
            >
              <DeleteIcon />
            </IconButton>
          </CardContent>
        </Card>
      ))}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Удалить счёт?</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить этот счёт?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
