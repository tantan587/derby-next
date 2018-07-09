import TopNavUser from './Navigation/TopNavUser'
import SportsSocket from './Sockets/SportsSocket'


const layoutStyle = {
  // margin: -5,
  padding: 0,
  //border: "1px solid #DDD"
}

const LayoutUser = (props) => (
  <div style={layoutStyle}>
    <SportsSocket>
      <TopNavUser />
      {props.children}
    </SportsSocket>
  </div>
)

export default LayoutUser
