import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Orders from './Orders';
import Greetings from "./Greetings";

export default function DashboardMain() {
  return (
    <>
          {/* Greeting */}
          <Grid item xs={12} md={12} lg={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
              }}
            >
              <Greetings/>
            </Paper>
          </Grid>

          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
              <Orders/>
            </Paper>
          </Grid>
    </>
  );
}
