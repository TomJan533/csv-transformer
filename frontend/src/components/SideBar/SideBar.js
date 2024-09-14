import React, { useRef } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  IconButton,
  Toolbar,
} from '@mui/material';
import {
  InsertDriveFile as FilesIcon,
  Add as AddIcon,
  BarChart as AnalyticsIcon,
  QueryStats as StatsIcon,
  PieChart as ReportsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../FileUpload/FileUpload.js';
import PropTypes from 'prop-types';

const drawerWidth = 240;

const DrawerStyled = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
  },
});

const SideBar = ({ onUploadSuccess }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <DrawerStyled variant="permanent" anchor="left">
      <Toolbar />
      <Divider />
      <List>
        {/* Files section with Add button */}
        <ListItem disablePadding>
  <ListItemButton onClick={() => navigate('/home')}>
    <ListItemIcon>
      <FilesIcon />
    </ListItemIcon>
    <ListItemText primary="Files" />
    <IconButton
      edge="end"
      aria-label="add"
      onClick={handleFileUploadClick}
    >
      <AddIcon />
    </IconButton>
    {/* Hidden FileUpload component */}
    <FileUpload
      fileInputRef={fileInputRef}
      onUploadSuccess={onUploadSuccess}
    />
  </ListItemButton>
</ListItem>
        <Divider />
        {/* Disabled sections for other features */}
        <ListItem disabled>
          <ListItemIcon>
            <AnalyticsIcon />
          </ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItem>
        <ListItem disabled>
          <ListItemIcon>
            <StatsIcon />
          </ListItemIcon>
          <ListItemText primary="Statistics" />
        </ListItem>
        <ListItem disabled>
          <ListItemIcon>
            <ReportsIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>
        <ListItem disabled>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </DrawerStyled>
  );
};

SideBar.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
};

export default SideBar;
