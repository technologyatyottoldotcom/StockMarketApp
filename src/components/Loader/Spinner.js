import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

function Spinner(props) {
  const classes = useStyles();

  return (
    <div className={classes.root} style={{
        position : 'absolute',
        top : '50%',
        left : '50%',
        transform : 'translate(-50%,-50%)'
      }}>
      <CircularProgress style={{color : '#00a0e3'}} size={props.size}/>
    </div>
  );
}

export default Spinner;
