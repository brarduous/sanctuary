//Header Menu Component
import { AccountCircle, HistoryEdu } from '@mui/icons-material';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import router from 'next/router';
import React from 'react';



export const HeaderMenu: React.FC = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <HistoryEdu sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sanctuary App
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 3 }}>
            <Button color="inherit" onClick={() => router.push('/sermons')}>
              Sermons
            </Button>
            <Button color="inherit" onClick={() => router.push('/bible-studies')}>
              Bible Studies
            </Button>
          </Box>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ mr: 1 }}>
                Welcome, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}!
              </Typography>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar alt={user?.user_metadata?.full_name || 'User'} src={user?.user_metadata?.avatar_url || ''}>
                  {!user?.user_metadata?.avatar_url && <AccountCircle />}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={isMenuOpen}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
  );
}