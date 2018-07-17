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

export const LRRR = ({L, R, classes = {}, ...rest}) => (
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
      xs={7}
    />
    <Grid
      item
      className={classes.R}
      container
      variant="body2"
      xs={5}
    >
      {R.map(oneR => {
        return <Grid
          container
          item
          className={classes.RContent}
          xs={4}
          children={oneR}
          alignItems="center"
        />})}
    </Grid>
  </Grid>
)