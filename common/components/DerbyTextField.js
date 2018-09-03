import PropTypes from 'prop-types'
import React from 'react'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  container: {
    left: '50%',
    // textAlign: 'center',
    //marginTop : '100px'
  },
  field: {
    width: 300,
  },
  text: {
    color:'black',
    marginLeft:'10%',
    marginRight:'10%'
  },
  menu: {
    width: 200,
  },
  underline: {
    // disableUnderline: true
    // textAlign: 'center',
    '&::before': {
      borderBottom: '2px solid #299149'
    }

  },
}

class DerbyTextField extends React.Component {
  render() {
    const { classes, ...rest } = this.props
    const parsedErrorText = this.props.errorText || ''
    return (
      <TextField
        id= {this.props.id || this.props.label }
        error={parsedErrorText !== ''}
        //className={classes.field}
        helperText = {parsedErrorText}
        label={this.props.label}
        value={this.props.value}
        style={this.props.style}
        margin="normal"
        type={this.props.type}
        InputProps={{ classes: { underline: classes.underline } }}
        onChange = {this.props.onChange}
        {...rest}/>
    )
  }
}


DerbyTextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default withStyles(styles)(DerbyTextField)
