import React, { useState, useEffect } from 'react';
import SerialNCIScale from '../serial-nci-scale';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';


const scale = new SerialNCIScale();
const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  spaceTop: {
    marginTop: theme.spacing(4),
  }
}));

export default function App() {
  const classes = useStyles();
  const [scaleData, setScaleData] = useState({});
  const [eventTimeStamp, setEventTimeStamp] = useState();
  const [eventType, setEventType] = useState();

  const setData = ({detail, timeStamp, type}) => {
    setScaleData(detail);
    setEventTimeStamp(new Date(timeStamp).toString());
    setEventType(type);
  };

  useEffect(() => {
    scale.addEventListener('weight', setData);
    scale.addEventListener('status', setData);
    scale.addEventListener('settled', setData);

    return () => {
      scale.removeEventListener('weight', setData);
      scale.removeEventListener('status', setData);
      scale.removeEventListener('settled', setData);
    };
  });


  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" >
            Serial NCI Scale Demo
          </Typography>
        </Toolbar>
      </AppBar>

      <Container className={classes.spaceTop} maxWidth="md">
        <Typography variant="h5">
          About this demo.
        </Typography>

        <Typography variant="body1" display="block" gutterBottom>
          To use the demo, be sure to enable the Web Serial API in chrome flags and plug in your scale.
          USB scales will need the appropriate VCP driver on Windows to virtualize a serial port.
        </Typography>

        <Divider />

        <Typography variant="h5" gutterBottom className={classes.spaceTop}>
          Controls
        </Typography>

        <Button className={classes.button} variant="contained" color="primary" onClick={() => scale.getWeight().then(weight => console.log(weight))}>
          Get Weight
        </Button>

        <Button className={classes.button} variant="contained" color="primary" onClick={() => scale.getStatus().then(status => console.log(status))}>
          Get Status
        </Button>

        <Button className={classes.button} variant="contained" color="primary" onClick={() => scale.zero()}>
          Zero
        </Button>

        <Button className={classes.button} variant="contained" color="primary" onClick={() => scale.startPolling()}>
          Start Polling
        </Button>

        <Button className={classes.button} variant="contained" color="primary" onClick={() => scale.stopPolling()}>
          Stop Polling
        </Button>

        <Button className={classes.button} variant="contained" color="primary" onClick={() => scale.disconnect()}>
          Disconnect
        </Button>

        <Card className={classes.spaceTop}>
          <CardHeader
            title="Event Log"
            subheader={eventTimeStamp}
          />
          <CardContent>
            <Typography variant="body1" display="block">
              type: {eventType}
            </Typography>
            <Typography variant="body1" display="block" component="div">
              <div><pre>{JSON.stringify(scaleData, null, 2) }</pre></div>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
