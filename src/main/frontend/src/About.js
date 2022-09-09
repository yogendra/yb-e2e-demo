import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import {Link} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

export default function About() {

  return (
    <React.Fragment>
      <Grid item xs={12} md={12} lg={12}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          <Title>About</Title>
          <Typography component="p" variant="h4">
            Sample app to demo E2E application flow with YugabyteDB
          </Typography>
          <Link to="/">Back to Home</Link>
        </Paper>
      </Grid>

    </React.Fragment>
  );
}

