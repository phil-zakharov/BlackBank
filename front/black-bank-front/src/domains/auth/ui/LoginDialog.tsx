import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { setAuth } from '../model/authSlice';
import type { AppDispatch } from '../../../app/store';
import type { LoginResponse } from '../model/types';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export function LoginDialog({ open, onClose }: LoginDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation<LoginResponse, Error, { email: string; password: string }>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      dispatch(setAuth({ user: data.user, accessToken: data.accessToken }));
      onClose();
      setEmail('');
      setPassword('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Вход</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {loginMutation.isError && (
            <Typography color="error" variant="body2">
              Ошибка входа
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={loginMutation.isPending}>
            Войти
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
