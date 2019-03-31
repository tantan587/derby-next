import { Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import SportIcon from './SportIcon'
import SportText from './SportText'

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      '& > :nth-child(2)': {
        width: 240
      }
    },
    [theme.breakpoints.down('xs')]: {
      alignItems: 'center'
    }
  }, 
  icons: {
    display: 'flex',
    flexDirection: 'row',
    height: 55,
  }
})

const StyledDiv = ({ children }) =>
  <div style={{ display: 'flex', justifyContent: 'center', width: 80 }}>
    {children}
  </div>

const SportIconTriple = ({ sportId, text, color, iconColor, classes, style }) =>
  <div className={classes.container}>
    <div className={classes.icons}> 
      <StyledDiv>
        <SportIcon color={color ? color : 'white'} iconColor={iconColor} sportId={sportId} />
      </StyledDiv>
      <StyledDiv>
        <SportIcon color={color ? color : 'white'} iconColor={iconColor} sportId={sportId} />
      </StyledDiv>
      <StyledDiv>
        <SportIcon color={color ? color : 'white'} iconColor={iconColor} sportId={sportId} />
      </StyledDiv>
    </div>
    <SportText text={text} sportId={sportId} color={color}/>
  </div>

export default withStyles(styles)(SportIconTriple)