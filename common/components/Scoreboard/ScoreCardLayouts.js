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
    // <Grid alignItems="center" container> 
    //   <Grid item style={{display:'flex', justifyContent:'center'}} xs={6}>
    //     <Typography style={{textAlign:'center'}}>{'Left'}</Typography>
    //   </Grid>
    //   <Grid item xs={6}>
    //     Right
    //   </Grid>
    // </Grid>
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
      <br/>
      <Grid alignItems='center'></Grid>
      <Grid item
        xs={2}/>
      <Grid item
        style={{display:'flex', justifyContent:'left'}}
        className={classes.L}
        children={B}
        variant="body2"
        xs={6}/>
    </Grid>
  )}

