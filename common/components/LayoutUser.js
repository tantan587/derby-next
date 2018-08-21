import TopNavUser from './Navigation/TopNavUser'
import SportsSocket from './Sockets/SportsSocket'
import MobileNav from './Navigation/MobileNav'
import BottomNav from './Navigation/BottomNav'

const layoutStyle = {
  padding: 0,
}

const LayoutUser = (props) => (
  <div id="outer-container" style={layoutStyle}>
    <SportsSocket>
      <MobileNav />
      <div id="page-wrap">
        <TopNavUser />
        {props.children}
      </div>
      <BottomNav/>
    </SportsSocket>
  </div>
)

export default LayoutUser
