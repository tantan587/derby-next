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

export const LeftRightOptionalBottom = ({L, R, B, totalInd, classes = {}, ...rest}) => {
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
        {R.map((oneR,i) => {
          return <Grid
            key={i}
            container
            className={classes.RValues}
            xs={Math.floor(12/R.length)}
            children={oneR}
            alignItems="center"
          />})}
      </Grid>
      { totalInd ? 
        <Grid 
          container
          className={classes.RValues}
          style={{textAlign:'center'}}
          children={T}
          variant="body2"
          alignItems="center"
          xs={2}/> :
        null
      }
      
      <Grid container alignItems='center'></Grid>
      <Grid item
        xs={2}/>
      <Grid item
        style={{display:'flex', justifyContent:'left'}}
        children={B}
        variant="body2"
        xs={10}/>
    </Grid>
  )}

