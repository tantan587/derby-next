// const R = require('ramda')
import { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
// import Grid from '@material-ui/core/Grid'
// import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import Tooltip from '@material-ui/core/Tooltip'
import DateRange from '@material-ui/icons/DateRange'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import DerbySwitch from '../../UI/DerbySwitch'

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 150,
    padding: 20,
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
    width: '60%',
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
  <Tooltip id="tooltip-top" title="This gives you information" placement="top">
    <div className={style}>i</div>
  </Tooltip>

// const InfoTool = class => { <div className={class}>i</div> }
// const InfoTool = ({ class )} => <div>hi</div>

const BasicInformation = withStyles(styles)(
  class extends Component {
  state = {
    anchor: null,
    draftType: 'Online - Snake Format'
  }

  handleClick = event => {
    this.setState({ anchor: event.currentTarget })
  }
  handleClose = draftType => { this.setState({ anchor: null, draftType }) }

  render() {
    const { anchor, draftType } = this.state
    const { classes } = this.props

    return (
      <Card className={classes.container}>
        <div className={classes.field}>
          <div className={classes.label}>
            <div>Set Draft Date & Time:</div>
          </div>
          {/* <TextField fullWidth label="Commissioner's Name" /> */}
          <div className={classes.formRoot} style={{ display: 'flex' }}>
            <FormControl style={{ width: 164 }}>
              <Input className={classes.date} type="date" />
            </FormControl>
            <DateRange style={{ height: 24, width: 24,  padding: '0px 5px' }} />
            <FormControl style={{ width: 114 }}>
              <Input className={classes.time} required type="time" />
            </FormControl>
          </div>
        </div>

        <div className={classes.field}>
          <div className={classes.label}>
            <div>Draft Type:</div>
            <InfoTool style={classes.infoTool} />
          </div>
          {/* <TextField fullWidth label="Commissioner's Name" /> */}
          <div className={classes.formRoot} style={{ display: 'flex' }}>
            <Button
              aria-owns={anchor ? 'simple-menu' : null}
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              { draftType }
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchor}
              open={Boolean(anchor)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.handleClose.bind(null, 'Online - Snake Format')}>
                Online - Snake Format
              </MenuItem>
            </Menu>
          </div>
        </div>

        <div className={classes.field}>
          <div className={classes.label}>
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
      </Card>
    )
  }
})

export default BasicInformation
