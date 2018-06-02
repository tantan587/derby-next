import MainLeagueBar from './MainLeagueBar'


const layoutStyle = {
  // margin: -5,
  padding: 0,
  //border: "1px solid #DDD"
}

const Layout = (props) => (
  <div style={layoutStyle}>
    <MainLeagueBar value={props.value}/>
    {/* <Typography component="div" style={{ padding: 8 * 3 }}> */}
      {props.children}
    {/* </Typography> */}
  </div>
)

export default Layout
