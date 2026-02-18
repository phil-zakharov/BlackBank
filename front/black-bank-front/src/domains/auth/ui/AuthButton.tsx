import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { LoginDialog } from './LoginDialog';
import { authApi } from '../api/authApi';
import { clearAuth } from '../model/authSlice';
import type { RootState, AppDispatch } from '../../../app/store';

export function AuthButton() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loginOpen, setLoginOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenLogin = () => setLoginOpen(true);
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleCloseMenu();
    try {
      await authApi.logout();
    } finally {
      dispatch(clearAuth());
    }
  };

  if (user) {
    return (
      <>
        <IconButton
          color="inherit"
          aria-label="account"
          onClick={handleOpenMenu}
          aria-controls={anchorEl ? 'account-menu' : undefined}
          aria-haspopup="true"
        >
          <AccountCircleIcon />
        </IconButton>
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem disabled>{user.email}</MenuItem>
          <MenuItem onClick={handleLogout}>Выйти</MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <>
      <IconButton color="inherit" aria-label="Войти" onClick={handleOpenLogin}>
        <PersonIcon />
      </IconButton>
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
