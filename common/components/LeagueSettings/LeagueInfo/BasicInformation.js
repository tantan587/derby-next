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
import Button from '@material-ui/core/Button'

import DerbySwitch from '../../UI/DerbySwitch'

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 280,
    padding: '6px 20px 20px 20px',
    [theme.breakpoints.only('sm')]: {
      width: '75%',
    },
    [theme.breakpoints.down('sm')]: {
      height: 400,
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
    alignSelf: 'flex-end',
    fontWeight: 600,
    width: '40%',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  switchLabel: {
    display: 'flex',
    alignSelf: 'flex-end',
    paddingTop: 8,
    fontWeight: 600,
    width: '40%',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  switchPosition: {
    position: 'relative',
    left: -13,
    top: -5,
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

const BasicInformation = withStyles(styles)(class extends Component {
  state = {
    memberAnchor: null,
    memberVal: 8
  }

  handleClick = event => { this.setState({ memberAnchor: event.currentTarget }) }
  handleClose = () => { this.setState({ memberAnchor: null }) }
  handleSelect = value => { this.setState({ memberAnchor: null, memberVal: value }) }


  render() {
    const { classes } = this.props
    const { memberAnchor, memberVal } = this.state

    const memberArray = new Array(8).fill(0).map((arr, i) => i + 8)

    return (
      <Card className={classes.container}>
        <div className={classes.field}>
          <div className={classes.label}>
            <div>Commissioner:</div>
          </div>
          {/* <TextField fullWidth label="Commissioner's Name" /> */}
          <FormControl className={classes.textField}>
            <Input placeholder="Commissioner's Name" />
          </FormControl>
        </div>

        <div className={classes.field}>
          <div className={classes.label}>
            <div>League Name:</div>
          </div>
          {/* <TextField fullWidth label="Commissioner's Name" /> */}
          <FormControl className={classes.textField}>
            <Input placeholder="League Name Here" />
          </FormControl>
        </div>

        <div className={classes.field}>
          <div className={classes.label}>
            <div>League Password:</div>
            <InfoTool style={classes.infoTool} />
          </div>
          <FormControl className={classes.textField}>
            <Input placeholder="Minimum of 8 characters" />
          </FormControl>
        </div>

        <div className={classes.field}>
          <div className={classes.label}>
            <div>Verify Password:</div>
          </div>
          <FormControl className={classes.textField}>
            <Input placeholder="Must match Password" />
          </FormControl>
        </div>

        <div className={classes.field}>
          <div className={classes.label}>
            <div>Amount of Members:</div>
          </div>
          <div className={classes.formRoot} style={{ display: 'flex' }}>
            <Button
              variant="raised"
              aria-owns={memberAnchor ? 'simple-menu' : null}
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              { memberVal }
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={memberAnchor}
              open={Boolean(memberAnchor)}
              onClose={this.handleClose}
            >
              {
                memberArray.map(val =>
                  <MenuItem onClick={this.handleSelect.bind(null, val)}>
                    { val }
                  </MenuItem>)
              }
            </Menu>
          </div>
        </div>

        <div className={classes.switchField}>
          <div className={classes.switchLabel}>
            <div>Add Premier League:</div>
            <InfoTool style={classes.infoTool} />
          </div>
          <div className={`${classes.formRoot} ${classes.switchPosition}`} style={{ alignSelf: 'flex-start' }}>
            <DerbySwitch />
          </div>
        </div>
      </Card>
    )
  }
})

export default BasicInformation
