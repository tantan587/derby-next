import TopNavLeague from './Navigation/TopNavLeague'
import SportsSocket from './Sockets/SportsSocket'
import MobileNav from './Navigation/MobileNav'
import BottomNav from './Navigation/BottomNav'

const layoutStyle = {
  // margin: -5,
  padding: 0,
  //border: "1px solid #DDD"
}

const LayoutLeague = (props) => (
  <div id="outer-container" style={layoutStyle}>
    <SportsSocket>
      <MobileNav />
      <div id="page-wrap">
        <TopNavLeague />
        {props.children}
      </div>
      <BottomNav/>
    </SportsSocket>
  </div>
)

export default LayoutLeague