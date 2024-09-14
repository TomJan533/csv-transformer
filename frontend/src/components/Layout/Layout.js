import React from 'react';
import { CssBaseline, Toolbar } from '@mui/material';
import { styled } from '@mui/system';
import { ThemeProvider, createTheme } from '@mui/material/styles/index.js';
import TopNavBar from '../TopNavBar/TopNavBar.js';
import SideBar from '../SideBar/SideBar.js';

const theme = createTheme();

const Root = styled('div')({
  display: 'flex',
});

const Content = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const Layout = ({ children, onUploadSuccess }) => {
  return (
    <ThemeProvider theme={theme}>
      <Root>
        <CssBaseline />
        <TopNavBar />
        <SideBar onUploadSuccess={onUploadSuccess} />
        <Content>
          <Toolbar />
          {children}
        </Content>
      </Root>
    </ThemeProvider>
  );
};

export default Layout;
