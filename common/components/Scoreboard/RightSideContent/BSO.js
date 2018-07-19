import Rating from 'react-rating'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import DotIcon from '@material-ui/icons/FiberManualRecord'

const styles = (theme) => ({
  container: {
    marginTop: 15,
    marginBottom: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 25,
    borderTop: `1px solid ${theme.palette.grey.A200}`,
    borderBottom: `1px solid ${theme.palette.grey.A200}`,
  },
  letter: {
    display: 'flex',
    alignItems: 'center'
  },
  rating: {
    height: 14,
    paddingBottom: 1,
    paddingLeft: 3,
  },
  emptyColor: {
    color: theme.palette.grey.A100,
  },
  fullColor: {
    color: theme.palette.primary.main,
  },
})

const BSO = ({
  classes,
}) => (
  <div className={classes.container}>
    <Typography className={classes.letter}>
      <span className={classes.l}>B</span>
      <Rating
        start={0}
        initialRating={2}
        stop={4}
        className={classes.rating}
        readonly
        emptySymbol={<DotIcon className={classes.emptyColor} style={{ fontSize: 14 }} />}
        fullSymbol={<DotIcon className={classes.fullColor} style={{ fontSize: 14 }} />}
      />
    </Typography>
    <Typography className={classes.letter}>
      <span className={classes.l}>S</span>
      <Rating
        start={0}
        initialRating={2}
        stop={3}
        className={classes.rating}
        readonly
        emptySymbol={<DotIcon className={classes.emptyColor} style={{ fontSize: 14 }} />}
        fullSymbol={<DotIcon className={classes.fullColor} style={{ fontSize: 14 }} />}
      />
    </Typography>
    <Typography className={classes.letter}>
      <span className={classes.l}>O</span>
      <Rating
        start={0}
        initialRating={2}
        stop={3}
        className={classes.rating}
        readonly
        emptySymbol={<DotIcon className={classes.emptyColor} style={{ fontSize: 14 }} />}
        fullSymbol={<DotIcon className={classes.fullColor} style={{ fontSize: 14 }} />}
      />
    </Typography>
  </div>
)

export default withStyles(styles)(BSO)