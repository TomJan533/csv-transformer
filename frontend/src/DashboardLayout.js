import React, { useRef } from 'react';
import { AppBar, Toolbar, CssBaseline, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material';
import { InsertDriveFile as FilesIcon, Add as AddIcon, BarChart as AnalyticsIcon, QueryStats as StatsIcon, PieChart as ReportsIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { styled } from '@mui/system/index.js';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles/index.js';

const drawerWidth = 240;

const theme = createTheme();

const Root = styled('div')({
  display: 'flex',
});

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const DrawerStyled = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
  },
});

const Content = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

export default function DashboardLayout({ children, onUploadSuccess }) { // onUploadSuccess for updating file list
  const navigate = useNavigate(); 
  const fileInputRef = useRef(null);

  // Function to open file selection dialog when + button is clicked
  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger hidden file input
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return; // If no file is selected, return early
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/upload-csv/`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        console.log('File uploaded successfully!');
        if (onUploadSuccess) {
          onUploadSuccess(); // Trigger parent callback to refresh CSV list
        }
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Error occurred during file upload:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Root>
        <CssBaseline />
        <AppBarStyled position="fixed">
          <Toolbar>
            <Typography variant="h6" noWrap>
              CSV Transformer
            </Typography>
          </Toolbar>
        </AppBarStyled>
        <DrawerStyled variant="permanent" anchor="left">
          <Toolbar />
          <Divider />
          <List>
            {/* Files section with Add button */}
            <ListItem onClick={() => navigate('/home')}>
              <ListItemIcon><FilesIcon /></ListItemIcon>
              <ListItemText primary="Files" />
              <IconButton 
                edge="end" 
                aria-label="add" 
                onClick={handleFileUploadClick} // Trigger file input
              >
                <AddIcon />
              </IconButton>
              {/* Hidden file input */}
              <input 
                type="file" 
                accept=".csv" 
                ref={fileInputRef} // Reference for the input
                style={{ display: 'none' }} // Hide the input
                onChange={handleFileChange} // Handle file selection and upload
              />
            </ListItem>
            <Divider />
            {/* Disabled sections for other features */}
            <ListItem disabled>
              <ListItemIcon><AnalyticsIcon /></ListItemIcon>
              <ListItemText primary="Analytics" />
            </ListItem>
            <ListItem disabled>
              <ListItemIcon><StatsIcon /></ListItemIcon>
              <ListItemText primary="Statistics" />
            </ListItem>
            <ListItem disabled>
              <ListItemIcon><ReportsIcon /></ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>
            <ListItem disabled>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </DrawerStyled>
        <Content>
          <Toolbar />
          {children}
        </Content>
      </Root>
    </ThemeProvider>
  );
}
