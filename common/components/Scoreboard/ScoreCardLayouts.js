import Grid from '@material-ui/core/Grid'

export const LTB = ({L, T, B, classes = {}, ...rest}) => (
  <Grid
    container
    {...rest}
  >
    <Grid
      className={classes.L}
      container
      item
      xs={4}
      children={L}
      alignItems="center"
    />
    <Grid
      item
      container
      xs={8}
      alignItems="center"
    >
      <Grid
        item
        xs={12}
        children={T}
      />
      <Grid
        item
        xs={12}
        children={B}
      />
    </Grid>
  </Grid>
)

export const LeftRight = ({L, R, totalInd, classes = {}, ...rest}) => {
  let T = totalInd ? R.pop() : null
  return (
    <Grid
      container
      alignItems="center"
      {...rest}
    >
      <Grid 
        item
        className={classes.L}
        children={L}
        variant="body2"
        xs={6}
      />
      <Grid
        item
        className={classes.R}
        container
        variant="body2"
        xs={totalInd ? 4 : 6}
      >
        {R.map(oneR => {
          return <Grid
            container
            item
            className={classes.RValues}
            xs={Math.floor(12/R.length)}
            children={oneR}
            alignItems="center"
          />})}
      </Grid>
      { totalInd ? 
        <Grid 
          item
          className={classes.RValues}
          style={{textAlign:'center'}}
          children={T}
          variant="body2"
          xs={2}/> :
        null
      }
    </Grid>
  )}

