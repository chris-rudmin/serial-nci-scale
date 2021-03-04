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
  },
  spaceTop: {
    marginTop: theme.spacing(4),
  }
}));

export default function App() {
  const classes = useStyles();
  const [eventData, setEventData] = useState({
    scaleData: {},
    eventTimeStamp: '',
    eventType: '',
  });

  const setData = ({detail, timeStamp, type}) => {
    setEventData({
      scaleData: detail,
      eventTimeStamp: timeStamp,
      eventType: type,
    });
  };

  useEffect(() => {
    console.log('binding event handlers');
    scale.addEventListener('weight', setData);
    scale.addEventListener('status', setData);
    scale.addEventListener('settled', setData);

    return () => {
      console.log('Unbinding event handlers');
      scale.removeEventListener('weight', setData);
      scale.removeEventListener('status', setData);
      scale.removeEventListener('settled', setData);
    };
  }, []);


  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" >
            Serial NCI Scale
          </Typography>
        </Toolbar>
      </AppBar>

      <Container className={classes.spaceTop} maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Connect Your Scale!
        </Typography>

        <Typography variant="body1" display="block">
          To test the serial-nci-scale library, be sure to enable the Web Serial API in chrome://flags and connect your scale.
          USB scales will need the appropriate VCP driver on Windows to virtualize a serial port.
        </Typography>

        <Typography variant="h5" gutterBottom className={classes.spaceTop}>
         Known Supported Devices
        </Typography>

        <Typography variant="body1" display="block" gutterBottom>
          - Brecknell PS-USB (70lb)
        </Typography>

        <Divider className={classes.spaceTop}/>

        { SerialNCIScale.isWebSerialSupported ? (
          <div>
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
                subheader={`Event '${eventData.eventType}' at time ${eventData.eventTimeStamp}`}
              />
              <CardContent>
                <Typography variant="body1" display="block" component="div">
                  <pre>{JSON.stringify(eventData.scaleData, null, 2) }</pre>
                </Typography>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className={classes.spaceTop}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Web Serial API is not supported in your browser
              </Typography>

              <Typography variant="body1">
                Try using Chrome with the Web Serial API enabled with flag chrome://flags/#enable-experimental-web-platform-features
              </Typography>
            </CardContent>
          </Card>
        )
      }
      </Container>
    </div>
  );
}
