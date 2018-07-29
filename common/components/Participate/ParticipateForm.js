import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Router from 'next/router'
import { connect } from 'react-redux'

import StyledButton from '../Navigation/Buttons/StyledButton'

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginTop : '100px'
  },
  field: {
    textAlign: 'center',
  },
  title: {
    fontFamily: 'museo-slab-bold',
    color: '#299149'
  },
  text: {
    color: '#299149',
    fontSize: 19,
    fontWeight: 500,
    margin: '0px 16%'
  },
  buttons: {
    display: 'flex',
    [theme.breakpoints.only('xs')]: {
      flexDirection: 'column'
    }
  },
})

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
          <Typography variant="display2" className={classes.title} gutterBottom>
            Derby Fantasy Wins League
          </Typography>
          <Typography variant="subheading" className={classes.text} gutterBottom>
          Derby is the first of a new fantasy sports game: the multi-sport fantasy wins league. Instead of drafting individual players in a single sport, friends compete by drafting entire teams across multiple sports and earn points as your teams win games and earn playoff bonuses.
          </Typography>
          <div className={classes.buttons}>
            <StyledButton
              link="/createleague"
              text="Create New League"
              height={36}
              styles={{ fontSize: 13, fontWeight: 500, margin: '36px 22px 0px 22px' }}
            />
            <StyledButton
              link="/joinleague"
              text="Join Existing League"
              height={36}
              styles={{ fontSize: 13, fontWeight: 500, margin: '36px 22px 0px 22px' }}
            />
          </div>
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
