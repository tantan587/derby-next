import MainLeagueBar from './MainLeagueBar'


const layoutStyle = {
  margin: -5,
  padding: 0,
  //border: "1px solid #DDD"
}

const Layout = (props) => (
  <div style={layoutStyle}>
    <MainLeagueBar value={props.value}/>
    {props.children}
  </div>
)

export default Layout