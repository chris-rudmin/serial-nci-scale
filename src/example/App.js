import SerialWebUSBScale from '../serial-webusb-scale';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  container: {
    marginTop: theme.spacing(4)
  }
}));

export default function App() {
  const classes = useStyles();
  let scale;

  const startScale = async () => {
    scale = new SerialWebUSBScale({});
  };

  const getWeight = () => scale.getWeight();
  const getStatus = () => scale.getStatus();
  const zero = () => scale.zero();
  const disconnect = () => scale.disconnect();

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" >
            WebUSB Scale Demo
          </Typography>
        </Toolbar>
      </AppBar>

      <Container className={classes.container}>
        <Typography variant="h6" gutterBottom>
          Controls
        </Typography>

        <Button className={classes.button} variant="contained" color="primary" onClick={startScale}>
          Start Scale
        </Button>

        <Button className={classes.button} variant="contained" color="primary" onClick={getWeight}>
          Get Weight
        </Button>

        <Button className={classes.button} variant="contained" color="primary" onClick={getStatus}>
          Get Status
        </Button>

        <Button className={classes.button} variant="contained" color="primary" onClick={zero}>
          Get Zero
        </Button>

        <Button className={classes.button} variant="contained" color="primary" onClick={disconnect}>
          Disconnect
        </Button>
      </Container>
    </div>
  );
}
