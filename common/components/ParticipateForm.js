import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Link from 'next/link'
import Router from 'next/router'
import {isMobile} from '../lib/mobile'
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
          <Typography variant="display2" className={classes.text} gutterBottom>
            Derby: Fantasy Wins League
          </Typography>
          <br/>
          <br/>
          <Typography variant="subheading" className={classes.text} gutterBottom>
          Pick your teams in this race and ride them to victory! 
          In Derby Fantasy Wins League, compete with your friends
           by drafting teams across multiple sports.
            Earn points when your teams win throughout their entire seasons. 
            The more games your teams win, the more points you earn.
          </Typography>
          <br/>
          <br/>
          {
            isMobile() ?
              <div>
                <Link href ='/createleague'>
                  <Button raised color="accent">
                    Create New League
                  </Button>
                </Link>
                <br/>
                <br/>
                <Link href ='/joinleague'>
                  <Button  raised color="accent">
                    Join Existing League
                  </Button>
                </Link>
              </div> 
              : 
              <div>
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
              </div> 
          }
          
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


