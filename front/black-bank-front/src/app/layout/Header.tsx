import { useState } from 'react';
import { useNavigate } from 'react-router';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { AuthButton } from '../../domains/auth/ui/AuthButton';
import { IconButton } from '@mui/material';

export function Header() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 700 }}
        >
          BlackBank
        </Typography>
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
  );
}
