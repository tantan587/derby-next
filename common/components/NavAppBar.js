import Link from 'next/link'
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import { connect } from 'react-redux'

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
}

function NavAppBar(props) {
  const { classes } = props
  return (
    <div className={classes.root}>
      <AppBar position="static" style={{height:'60px'}}>
        <Toolbar>
          <IconButton className={classes.menuButton} color="contrast" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography type="title" color="inherit" className={classes.flex}>
            Derby. Fantasy Wins League
          </Typography>
          {props.user.loggedIn ? 
            <div>
              <Link href="/logout">
                <Button style={{float: 'right'}} color="contrast">Logout</Button>
              </Link>
            </div>
            : 
            <div>
              <Link href="/signup">
                <Button style={{float: 'right'}} color="contrast">Signup</Button>
              </Link>
              <Link href="/login">
                <Button style={{float: 'right'}} color="contrast">Login</Button>
              </Link>
            </div>}
          
        </Toolbar>
      </AppBar>
    </div>
  )
}

NavAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(({ user }) => ({ user }), { })(withStyles(styles)(NavAppBar))

// const linkStyle = {
//   marginRight: 15
// }

// const AppBar = () => (
//   <div>
//     <Link href="/">
//       <a style={linkStyle}>Home</a>
//     </Link>
//     <Link href="/about">
//       <a style={linkStyle}>About</a>
//     </Link>
//   </div>
// )

//export default AppBar