import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import MobileStepper from '@material-ui/core/MobileStepper'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'

const tutorialSteps = [
  {
    label: 'Customize Silks',
    imgPath: '/static/images/previews/silks.png',
  },
  {
    label: 'Draft Your Teams',
    imgPath: '/static/images/previews/draft1.png',
  },
  {
    label: 'See The Roster Grid',
    imgPath: '/static/images/previews/draft2.png',
  },
  {
    label: 'See Indivudal Teams',
    imgPath: '/static/images/previews/modal.png',
  },
  {
    label: 'Check The Scores',
    imgPath: '/static/images/previews/scoreboard.png',
  },
  {
    label: 'Check The Standings',
    imgPath: '/static/images/previews/allteams.png',
  },
  {
    label: 'See All The Teams',
    imgPath: '/static/images/previews/allteams.png',
  },
  {
    label: 'Draft. Watch. Win',
    imgPath: '/static/images/previews/tagline.png',
  },
]

const styles = theme => ({
  root: {
    //maxWidth: 400,
    flexGrow: 1,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'column'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing.unit * 4,
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: theme.palette.background.default,
  },
  img: {
    maxHeight: 1000,
    //maxWidth: 400,
    overflow: 'hidden',
    width: '90%',
    borderColor:'#EBAB38'
  },
})

class PreviewPage extends React.Component {
  state = {
    activeStep: 0,
  }

  handleNext = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1,
    }))
  }

  handleBack = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1,
    }))
  }

  render() {
    const { classes, theme } = this.props
    const { activeStep } = this.state

    const maxSteps = tutorialSteps.length

    return (
      <div className={classes.root}>
        <Paper square elevation={0} className={classes.header}>
          <Typography variant='display2'>{tutorialSteps[activeStep].label}</Typography>
        </Paper>
        <img
          border='3px solid'
          className={classes.img}
          src={tutorialSteps[activeStep].imgPath}
          alt={tutorialSteps[activeStep].label}
        />
        <br/>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          className={classes.mobileStepper}
          nextButton={
            <Button size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1}>
              Next
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
        />
      </div>
    )
  }
}

PreviewPage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(PreviewPage)