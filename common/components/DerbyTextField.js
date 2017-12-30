import PropTypes from 'prop-types'
import React from 'react'
import TextField from 'material-ui/TextField'
import { withStyles } from 'material-ui/styles'

const styles = {
  container: {
    left: '50%',
    textAlign: 'center',
    marginTop : '100px'
  },
  field: {
    textAlign: 'center',
    width: 300,
  },
  text: {color:'black',
    marginLeft:'10%',
    marginRight:'10%'
  },
  menu: {
    width: 200,
  },
  centeredText: {
    textAlign: 'center',
  },
}

class DerbyTextField extends React.Component {
  render() {
    const { classes } = this.props
    const InputProps = {
      inputProps: {
        className: classes.centeredText,
      }
    }
    const parsedErrorText = this.props.errorText || ''
    return (
      <TextField
        id= {this.props.id || this.props.label }
        error={parsedErrorText !== ''}
        className={classes.field}
        helperText = {parsedErrorText}
        label={this.props.label}
        value={this.props.value}
        margin="normal"
        type={this.props.type}
        InputProps={InputProps}
        onChange = {this.props.onChange}/>
    )
  }
}


DerbyTextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default withStyles(styles)(DerbyTextField)


