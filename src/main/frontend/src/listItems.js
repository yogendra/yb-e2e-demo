import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';

import {Info} from "@mui/icons-material";


export const mainListItems = (
  <React.Fragment>
    <ListItemButton to="/">
      <ListItemIcon>
        <DashboardIcon/>
      </ListItemIcon>
      <ListItemText primary="Dashboard"/>
    </ListItemButton>
    <ListItemButton to="/about" >
        <ListItemIcon>
          <Info/>
        </ListItemIcon>
        <ListItemText primary="About"/>
    </ListItemButton>
  </React.Fragment>
);
