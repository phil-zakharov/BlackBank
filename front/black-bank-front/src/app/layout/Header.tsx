import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { AuthButton } from '../../domains/auth/ui/AuthButton';
import { RegisterDialog } from '../../domains/auth/ui/RegisterDialog';
import { IconButton } from '@mui/material';
import type { RootState } from '../store';

export function Header() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleOpenActions = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseActions = () => {
    setAnchorEl(null);
  };

  const handleViewBalance = () => {
    handleCloseActions();
    navigate('/cabinet');
  };

  const handleTransfer = () => {
    handleCloseActions();
    // TODO: navigate to transfer page when implemented
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700 }}
          >
            BlackBank
          </Typography>
          {!user && (
            <Button color="inherit" onClick={() => setRegisterOpen(true)}>
              Регистрация
            </Button>
          )}
          <IconButton
            color="inherit"
            onClick={handleOpenActions}
            aria-controls={open ? 'quick-actions' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <MoreHorizIcon />
          </IconButton>
          <Menu
            id="quick-actions"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseActions}
            MenuListProps={{ 'aria-labelledby': 'quick-actions-btn' }}
          >
            <MenuItem onClick={handleViewBalance}>Посмотреть баланс</MenuItem>
            <MenuItem onClick={handleTransfer}>Перевести деньги</MenuItem>
          </Menu>
          <AuthButton />
        </Toolbar>
      </AppBar>
      <RegisterDialog 
        open={registerOpen} 
        onClose={() => setRegisterOpen(false)}
      />
    </>
  );
}
