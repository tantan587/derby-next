import React from 'react'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const styles = () => ({
  title : {
    textAlign : 'left',
    color:'white',
    fontFamily:'museo-slab-bold',
    textTransform: 'uppercase',
    zIndex:2,
    height:'45px',
    paddingTop:10,
    paddingBottom:45,
    marginBottom:0,
    paddingLeft:'3%',
    paddingRight:'3%',
  },
  subheading: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: '"Roboto", sans-serif',
  },
  button: {
    cursor: 'pointer',
    fontFamily:'museo-slab-bold',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  appBar : {

    boxShadow: ['none']}
})

class Title extends React.Component {

  render() {
    const {backgroundColor, title, subheading, color, classes, button, styles} = this.props
    return (
      <Typography className={classes.title}
        style={{
          backgroundColor: backgroundColor,
          color: color,
          ...button && {display: 'flex', justifyContent: 'space-between'},
          ...styles,
        }}
        variant="display1"
      >
        {title}
        {subheading && <span className={classes.subheading}>{subheading}</span>}
        {button && <div className={classes.button} onClick={button.onClick}>{button.text}</div>}
      </Typography>
    )
  }
}
export default withStyles(styles)(Title)
