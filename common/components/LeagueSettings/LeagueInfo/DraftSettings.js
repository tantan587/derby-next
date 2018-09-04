import { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Tooltip from '@material-ui/core/Tooltip'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {  DateTimePicker } from 'material-ui-pickers'

const styles = theme => ({
  container: {
    paddingTop:20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 150,
    padding: '6px 20px 20px 20px',
    [theme.breakpoints.only('sm')]: {
      width: '75%',
    },
    [theme.breakpoints.down('sm')]: {
      height: 225,
    },
  },
  formRoot: {
    width: '60%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: 8
    }
  },
  textField: {
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      width: '60%',
      marginTop: 8
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
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
  },
  field: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      margin: '10px 0px'
    }
  },
  switchField: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '-8px 0px',
    height: 35,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      marginBottom: 26
    }
  },
  label: {
    display: 'flex',
    alignSelf: 'flex-end',
    fontWeight: 600,
    width: '37%',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  
  switchLabel: {
    display: 'flex',
    alignSelf: 'flex-start',
    paddingTop: 8,
    fontWeight: 600,
    width: '37%',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  switchPosition: {
    position: 'relative',
    left: -13,
    top: -10,
    [theme.breakpoints.down('sm')]: {
      top: 2,
    }
  },
})

const InfoTool = ({ style }) =>
  <Tooltip id="tooltip-top" title="Currently, only snake draft is available" placement="top">
    <div className={style}>i</div>
  </Tooltip>

// const InfoTool = class => { <div className={class}>i</div> }
// const InfoTool = ({ class )} => <div>hi</div>

const DraftSettings = withStyles(styles)(
  class extends Component {

  handleDateChange = (date) => {
    this.setState({ selectedDate: date })
  }

  render() {
    const { classes, draftType,  pickTime, draftDate, handleChange  } = this.props
  
    const secondsArray = new Array(3).fill(0).map((arr, i) => i * 30 + 60)

    return (
      <Card className={classes.container}>
        <div className={classes.field}>
          <div className={classes.label}>
            <div>Set Draft Time (in your local timezone):</div>
          </div>
          <div className={classes.formRoot} style={{ display: 'flex' }}>

            <DateTimePicker
              keyboard
              className={classes.textField}
              value={draftDate}
              onChange={(date) => {handleChange('draftDate')(date)}}
            />

          </div>
        </div>

        <div className={classes.field}>
          <div className={classes.label}>
            <div>Draft Type:</div>
            <InfoTool style={classes.infoTool} />
          </div>
          <div className={classes.formRoot} style={{ display: 'flex' }}>

            <Select
              value={draftType}
              onChange={handleChange('draftType')}
              inputProps={{
                name: 'draftType',
                id: 'draftType',
              }}
            >
              {
                ['Online - Snake Format'].map(val =>
                  <MenuItem key={val} value={val}>
                    { val }
                  </MenuItem>)
              }
            </Select>
          </div>
        </div>

        <div className={classes.field}>
          <div className={classes.label}>
            <div>Seconds Per Pick:</div>
          </div>
          {/* <TextField fullWidth label="Commissioner's Name" /> */}
          <div className={classes.formRoot} style={{ display: 'flex' }}>

            <Select
              value={pickTime}
              onChange={handleChange('pickTime')}
              inputProps={{
                name: 'pickTime',
                id: 'pickTime',
              }}
            >
              {
                secondsArray.map(val =>
                  <MenuItem key={val} value={val}>
                    { val }
                  </MenuItem>)
              }
            </Select>
          </div>
        </div>
      </Card>
    )
  }
  })

export default DraftSettings
