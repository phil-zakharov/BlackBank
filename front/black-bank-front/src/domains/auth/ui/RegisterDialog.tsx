import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { registerSchema } from '../model/validation';
import type { RegisterRequest } from '../model/types';

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RegisterDialog({ open, onClose, onSuccess }: RegisterDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterRequest>({
    resolver: yupResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      reset();
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const onSubmit = (data: RegisterRequest) => {
    registerMutation.mutate(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Регистрация</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Email"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete="email"
            fullWidth
          />
          <TextField
            label="Пароль"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            autoComplete="new-password"
            fullWidth
          />
          <TextField
            label="Полное имя"
            {...register('fullName')}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            autoComplete="name"
            fullWidth
          />
          {registerMutation.isError && (
            <Typography color="error" variant="body2">
              {registerMutation.error instanceof Error 
                ? registerMutation.error.message 
                : 'Ошибка регистрации'}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting || registerMutation.isPending}
          >
            Зарегистрироваться
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
