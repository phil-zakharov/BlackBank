import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import { addAccount } from '../model/accountsSlice';
import type { Account } from '../model/types';
import type { AppDispatch } from '../../../app/store';

export function CreateAccountDialog() {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState<string>('0');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName('');
    setInitialBalance('0');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = Number(initialBalance) || 0;
    const account: Account = {
      id: crypto.randomUUID(),
      name: name.trim() || 'Новый счёт',
      balance,
      currency: '₽',
    };
    dispatch(addAccount(account));
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        sx={{ mt: 1 }}
      >
        Создать счёт
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Новый счёт</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Название счёта"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <TextField
              label="Начальный баланс"
              type="number"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              inputProps={{ step: 0.01, min: 0 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="submit" variant="contained">
              Создать
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
