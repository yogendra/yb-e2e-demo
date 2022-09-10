import * as React from 'react';
import {useEffect, useState} from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

export default function Greetings() {
  const [greetings, setGreetings] = useState(
    {message: "Loading...", timestamp: "2022-09-09T15:41:59.832146"});
  const refreshGreetings = () => {
    fetch("/api/v1/greetings")
    .then((resp) => {
      return resp.json();
    })
    .then(json => {
      setGreetings(json);
    });
  };
  useEffect(() => {
    refreshGreetings();
  }, []);
  return (
    <React.Fragment>
      <Title>Greetings</Title>
      <Typography component="p" variant="h2">
        {greetings.message}
      </Typography>
      <Typography color="text.secondary" sx={{flex: 1}}>
        <b>At:</b> {new Date(greetings.timestamp).toLocaleTimeString()}
      </Typography>
      {greetings.backend? (
        greetings.backend.split(",").map( item => {
          const parts = item.split(/=(.*)/s)
          const key = parts[0].trim();
          const value = parts[1].trim();
          return (
          <Typography color="text.secondary" sx={{flex: 1}}>
             <b>{key}</b>: {value}
          </Typography>
          );

        })
      ): <></>}
      <Typography color="text.secondary" sx={{flex: 1}}>
        <Link color="primary" href="#" onClick={refreshGreetings}>
          Refresh Greetings
        </Link>
      </Typography>
    </React.Fragment>
  );
}
