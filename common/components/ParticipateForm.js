import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Link from 'next/link'
import Router from 'next/router'

import { connect } from 'react-redux'

const styles = {
  container: {
    left: '50%',
    textAlign: 'center',
    marginTop : '100px'
  },
  field: {
    textAlign: 'center',
  },
  text: {color:'black',
    marginLeft:'10%',
    marginRight:'10%'
  }
}

class ParticipateForm extends React.Component {
  
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
          <Typography type="display2" className={classes.text} gutterBottom>
            Derby. Fantasy Wins League
          </Typography>
          <br/>
          <br/>
          <Typography type="subheading" className={classes.text} gutterBottom>
            Derby: Fantasy Wins League is a new type of league that has never been seen before.
             Instead of drafting players, you are drafting teams.
              Each team earns points based upon wins, 
              and whoever earns the most points over the course of the season wins the race! 
              Learn more about it here.
          </Typography>
          <br/>
          <br/>
          <Link href ='/createleague'>
            <Button raised color="accent">
              Create New League
            </Button>
          </Link>
          <Link href ='/joinleague'>
            <Button style={{marginLeft:'20px'}} raised color="accent">
              Join Existing League
            </Button>
          </Link>
        </form>
      )
    }
  }
}

ParticipateForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(
  state =>
    ({
      user : state.user
    }),
  null)(withStyles(styles)(ParticipateForm))


