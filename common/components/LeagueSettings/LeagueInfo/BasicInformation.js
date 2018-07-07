// const R = require('ramda')
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
// import Grid from '@material-ui/core/Grid'
// import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import Tooltip from '@material-ui/core/Tooltip'
import DateRange from '@material-ui/icons/DateRange'

import DerbySwitch from '../../UI/DerbySwitch'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 400,
    padding: 20
  },
  formRoot: {
    width: '60%'
  },
  infoTool: {
    marginLeft: 8,
    height: 20,
    width: 20,
    fontFamily: 'museo-slab-bold',
    borderRadius: '50%',
    backgroundColor: 'green',
    color: 'white',
    textAlign: 'center',
    verticalAlign: 'middle'
  },
  rootTest: {
    marginLeft: 10
  },
  date: {
    fontSize: 15,
    height: '100%',
    '&::-webkit-clear-button': {
      display: 'none'
    },
    '&::-webkit-inner-spin-button': {
      display: 'none'
    },
  },
  time: {
    fontSize: 15,
    height: '100%'
  }
}

const InfoTool = ({ style }) =>
  <Tooltip id="tooltip-top" title="This gives you information" placement="top">
    <div className={style}>i</div>
  </Tooltip>

// const InfoTool = class => { <div className={class}>i</div> }
// const InfoTool = ({ class )} => <div>hi</div>

const BasicInformation = withStyles(styles)(({ classes }) =>
  <Card className={classes.container}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignSelf: 'flex-end', fontWeight: 600, width: '40%' }}>
        <div>Commissioner:</div>
        <InfoTool style={classes.infoTool} />
      </div>
      {/* <TextField fullWidth label="Commissioner's Name" /> */}
      <FormControl className={classes.formRoot}>
        <Input placeholder="Commissioner's Name" />
      </FormControl>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignSelf: 'flex-end', fontWeight: 600, width: '40%' }}>
        <div>Amount of Members:</div>
        <InfoTool style={classes.infoTool} />
      </div>
      {/* <TextField fullWidth label="Commissioner's Name" /> */}
      <div className={classes.formRoot} style={{ display: 'flex' }}>
        <FormControl style={{ border: '1.5px solid black', width: '20%', marginRight: '5%' }}>
          <Input classes={{ root: classes.rootTest }} disableUnderline type="number" />
        </FormControl>
        <div style={{ alignSelf: 'center' }}>Minimum of X teams to play</div>
      </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignSelf: 'flex-end', fontWeight: 600, width: '40%' }}>
        <div>Set Draft Date & Time:</div>
      </div>
      {/* <TextField fullWidth label="Commissioner's Name" /> */}
      <div className={classes.formRoot} style={{ display: 'flex' }}>
        <FormControl style={{ width: 164 }}>
          <Input className={classes.date} type="date" />
        </FormControl>
        <DateRange style={{ height: 24, width: 24, alignSelf: 'flex-end', padding: '0px 5px' }} />
        <FormControl style={{ width: 114 }}>
          <Input className={classes.time} required type="time" />
        </FormControl>
      </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignSelf: 'flex-end', fontWeight: 600, width: '40%' }}>
        <div>Seconds Per Pick:</div>
      </div>
      {/* <TextField fullWidth label="Commissioner's Name" /> */}
      <div className={classes.formRoot} style={{ display: 'flex' }}>
        <FormControl style={{ border: '1.5px solid black', width: '20%' }}>
          <Input
            classes={{ root: classes.rootTest }}
            disableUnderline
            type="number"
          />
        </FormControl>
      </div>
    </div>

    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: '-8px 0px',
      height: 35
    }}>
      <div style={{ display: 'flex', alignSelf: 'center', paddingTop: 8, fontWeight: 600, width: '40%' }}>
        <div>Add Premier League:</div>
        <InfoTool style={classes.infoTool} />
      </div>
      {/* <TextField fullWidth label="Commissioner's Name" /> */}
      <div className={classes.formRoot} style={{ display: 'flex' }}>
        <DerbySwitch />
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignSelf: 'flex-end', fontWeight: 600, width: '40%' }}>
        <div>Set Draft Date & Time:</div>
      </div>
      {/* <TextField fullWidth label="Commissioner's Name" /> */}
      <div className={classes.formRoot} style={{ display: 'flex' }}>
        <FormControl style={{ width: 164 }}>
          <Input className={classes.date} type="date" />
        </FormControl>
        <DateRange style={{ height: 24, width: 24, alignSelf: 'flex-end', padding: '0px 5px' }} />
        <FormControl style={{ width: 114 }}>
          <Input className={classes.time} required type="time" />
        </FormControl>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignSelf: 'flex-end', fontWeight: 600, width: '40%' }}>
        <div>Set Draft Date & Time:</div>
      </div>
      {/* <TextField fullWidth label="Commissioner's Name" /> */}
      <div className={classes.formRoot} style={{ display: 'flex' }}>
        <FormControl style={{ width: 164 }}>
          <Input className={classes.date} type="date" />
        </FormControl>
        <DateRange style={{ height: 24, width: 24, alignSelf: 'flex-end', padding: '0px 5px' }} />
        <FormControl style={{ width: 114 }}>
          <Input className={classes.time} required type="time" />
        </FormControl>
      </div>
    </div>
  </Card>)

export default BasicInformation
