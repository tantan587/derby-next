import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {clickedLogout} from '../actions/auth-actions'
import Router from 'next/router'

import { connect } from 'react-redux'

const styles = (theme) =>  ({
  container: {
    left: '50%',
    textAlign: 'center',
    marginTop : '100px'
  },
  field: {
    textAlign: 'center',
  },
  title: {
    fontFamily: 'museo-slab-bold',
    color: theme.palette.primary.main,
  },
})

class Logout extends React.Component {
  
  state = {
    fireRedirect : false
  }

  submitYes(e) {
    const { onLogout } = this.props
    this.setState({fireRedirect: true})
    e.preventDefault()
    onLogout()
  }

  submitNo() {
    this.setState({fireRedirect: true})
  }

  render() {
    const { classes } = this.props
    
    if(this.state.fireRedirect){
      Router.push('/')
      return(<div></div>)
    }
    else{
      return (
        <form className={classes.container} noValidate autoComplete="off">
          <Typography
            className={classes.title}
            variant="display1"
            gutterBottom
            align="center"
          >
            LOG OUT?
          </Typography>
          
          <br/>
          <br/>
          <Button style={{color:'white', backgroundColor:'#ebab38',height:50, width:125}} onClick={(event) => this.submitYes(event)}>
            Yes
          </Button>
          <Button style={{marginLeft:'20px', color:'#FFFFFF', backgroundColor:'#EBAB38', height:50, width:125}} onClick={(event) => this.submitNo(event)}>
            No
          </Button>
          <div style={{height:700}}/>
        </form>
      )
    }
  }
}

Logout.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(
  state =>
    ({
      user : state.user
    }),
  dispatch =>
    ({
      onLogout(username, password) {
        dispatch(
          clickedLogout(username,password))
      }
    }))(withStyles(styles)(Logout))


