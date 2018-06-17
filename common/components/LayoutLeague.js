import TopNavLeague from './Navigation/TopNavLeague'
import SportsSocket from './Sockets/SportsSocket'

const layoutStyle = {
 // margin: -5,
  padding: 0,
  //border: "1px solid #DDD"
}

const LayoutLeague = (props) => (
  <div style={layoutStyle}>
    <SportsSocket>
      <TopNavLeague />
      {props.children}
    </SportsSocket>
  </div>
)

export default LayoutLeague