import NavAppBar from './NavAppBar'


const layoutStyle = {
  margin: -5,
  padding: 0,
  //border: "1px solid #DDD"
}

const Layout = (props) => (
  <div style={layoutStyle}>
    <NavAppBar />
    {props.children}
  </div>
)

export default Layout