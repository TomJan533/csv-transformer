import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/system';

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const TopNavBar = () => {
  return (
    <AppBarStyled position="fixed">
      <Toolbar>
        <Typography variant="h6" noWrap>
          CSV Transformer
        </Typography>
      </Toolbar>
    </AppBarStyled>
  );
};

export default TopNavBar;
