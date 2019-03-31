import { Component } from 'react'
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Card from '@material-ui/core/Card'
import { withStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import { handleCloseDraftRef } from '../../actions/draftRef-actions'
import { organizeData } from './tableData'
import SportIconText from '../Icons/SportIconText'
import Checklist from './withIcons/Checklist'

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Roboto',
    color: '#6d6d6d',
    [theme.breakpoints.down('xl')]: {
      width: '80vw',
      padding: 30,
    },
    [theme.breakpoints.down('md')]: {
      width: '85vw',
      padding: 25,
    },
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
      padding: 15,
    },
  },
  gridItem: {
    [theme.breakpoints.only('lg')]: {
      flexBasis: '30%'
    },
    [theme.breakpoints.only('md')]: {
      flexBasis: '32%'
    },
    [theme.breakpoints.down('sm')]: {
      padding: 16,
    },
  },
  gridContainer: {
    fontSize: 14,
  },
  dialog: { margin: 0 },
  content: {
    padding: 0,
    '&:first-child': { paddingTop: 0 }
},
  selector: { cursor: 'pointer' },
  card: {
    [theme.breakpoints.down('sm')]: {
      padding: 4,
      boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)'
    }
  },
  close: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    color: '#606060',
    fontWeight: 600,
  },
  title: {
    marginBottom: 14,
    fontFamily: 'HorsebackSlab',
    color: '#229246',
    [theme.breakpoints.down('xl')]: {
      fontSize: '34px',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '25px',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
    },
  },
  H2: {
    marginBottom: 8,
    marginTop: 20,
    fontFamily: 'HorsebackSlab',
    color: '#229246',
    fontSize: 16
  },
  H3: { marginBottom: 8, fontWeight: 500 },
  // dialog: { maxHeight: 'none' }
})

class TeamsDialog extends Component {
  render() {
    const { draftRefDialog, handleCloseDraftRef, classes } = this.props
    const { open } = draftRefDialog
    const {
      container, dialog, selector, close,
      title, howToBox, H2, H3, card,
      gridItem, gridContainer, content
    } = classes

    return (open ?
      <Dialog
        open={open}
        onClose={handleCloseDraftRef}
        maxWidth={false}
        sroll="body"
        classes={{  paper: dialog }}
      >
      <DialogContent className={content} classes={{ root: content }}>
        <div className={container}>
          <div className={`${selector} ${close}`} onClick={handleCloseDraftRef}>
            Close Window <CloseIcon />
          </div>
          <div className={title}>Draft Reference Guide</div>
          <div className={H2}>How To</div>
          <Grid container justify="space-between" classes={{ container: gridContainer }}>
            <Grid item sm={12} md={4} classes={{ item: gridItem }} >
              <div className={card}>
                <div className={H3}>View Available Teams to Draft</div>
                <div>30 pixel padding on photo. Text wraps around photos. Paragraph Style -- Lorem ipsum dolor</div>
                <div style={{ height: 60, textAlign: 'center', lineHeight: '60px' }}>Photo</div>
                <div className={H3}>Add Teams to Your Draft Queue</div>
                <div>30 pixel padding on photo. Text wraps around photos. Paragraph Style -- Lorem ipsum dolor</div>
                <div style={{ height: 60, textAlign: 'center', lineHeight: '60px' }}>Photo</div>
                <div>Once added to the Draft Queue, you can rearrange the draft order by dragging teams up and down or delete by clicking the "x" to the right of the team in the Draft Queue</div>
              </div>
            </Grid>
            <Grid item sm={12} md={4} classes={{ item: gridItem }} >
              <div className={card}>
                <div className={H3}>Draft Teams</div>
                <div>30 pixel padding on photo. Text wraps around photos. Paragraph Style -- Lorem ipsum dolor</div>
                <div style={{ height: 60, textAlign: 'center', lineHeight: '60px' }}>Photo</div>
                <div className={H3}>Add Teams to Your Draft Queue</div>
                <div>30 pixel padding on photo. Text wraps around photos. Paragraph Style -- Lorem ipsum dolor</div>
                <div style={{ height: 60, textAlign: 'center', lineHeight: '60px' }}>Photo</div>
                <div>Once added to the Draft Queue, you can rearrange the draft order by dragging teams up and down or delete by clicking the "x" to the right of the team in the Draft Queue</div>
              </div>
            </Grid>
            <Grid item sm={12} md={4} classes={{ item: gridItem }} >
              <div className={card}>
                <div className={H3}>View Your Drafted Teams</div>
                <div>30 pixel padding on photo. Text wraps around photos. Paragraph Style -- Lorem ipsum dolor</div>
                <div style={{ height: 60, textAlign: 'center', lineHeight: '60px' }}>Photo</div>
                <div className={H3}>Add Teams to Your Draft Queue</div>
                <div>30 pixel padding on photo. Text wraps around photos. Paragraph Style -- Lorem ipsum dolor</div>
                <div style={{ height: 60, textAlign: 'center', lineHeight: '60px' }}>Photo</div>
                <div>Once added to the Draft Queue, you can rearrange the draft order by dragging teams up and down or delete by clicking the "x" to the right of the team in the Draft Queue</div>
              </div>
            </Grid>
          </Grid>
          <div className={H2}>Who do I need to draft?</div>
          <div className={H3}>H3 Subheadline</div>
          <div>30 pixel padding on photo. Text wraps around photos. Paragraph Style -- Once the draft slot is full the team will be ckecked off the Roster Checklist</div>
          <div className={H2}>How are points calulated?</div>
          <div className={H3}>H3 Subheadline</div>
          <div>30 pixel padding on photo. Text wraps around photos. Paragraph Style -- Once the draft slot is full the team will be ckecked off the Roster Checklist Lorem ipsum dolor sit clicking the "x" to the right of</div>    
          <div className={H2}>Who do I need to draft?</div>
          <div className={H3}>H3 Subheadline</div>
          <div>30 pixel padding on photo. Text wraps around photos. Paragraph Style -- Once the draft slot is full the team will be ckecked off the Roster Checklist</div>
          <div className={H2}>How are points calulated?</div>
          <div className={H3}>H3 Subheadline</div>
          <div>30 pixel padding on photo. Text wraps around photos. Paragraph Style -- Once the draft slot is full the team will be ckecked off the Roster Checklist Lorem ipsum dolor sit clicking the "x" to the right of</div>    
        {/* Icons section here */}
          <Checklist />
          <div className={H2}>How are points calulated?</div>
          <div className={H3}>H3 Subheadline</div>
          <div>30 pixel padding on photo. Text wraps around photos. Paragraph Style -- Once the draft slot is full the team will be ckecked off the Roster Checklist Lorem ipsum dolor sit clicking the "x" to the right of</div>    
          
          
          
          <div style={{
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'center'
          }}>
            {
              [[101, 'NFL', 100],
               [102, 'NBA', 100],
               [103, 'MLB', 100],
               [104, 'NHL', 100],
               [105, 'EPL', 100],
               [106, 'NCAAM BASKETBALL', 100],
               [107, 'NCAAM FOOTBALL', 100]]
              .map(
                data => <SportIconText
                  idx={data[0]}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: 140,
                    margin: 5
                  }}
                  sportId={data[0]}
                  text={[data[1], `${data[2]} points per win`]}
                  color="#666666"
                />
              )
            }
          </div>



        </div>
        </DialogContent>
      </Dialog>
      :
      <div/>
    )
  }
}

const mapStateToProps = state => ({
  draftRefDialog: state.draftRefDialog,
})

const mapDispatchToProps = { handleCloseDraftRef }

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TeamsDialog))
