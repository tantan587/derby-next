import TopNavUser from './Navigation/TopNavUser'


const layoutStyle = {
  margin: -5,
  padding: 0,
  //border: "1px solid #DDD"
}

const LayoutUser = (props) => (
  <div style={layoutStyle}>
    <TopNavUser />
    {props.children}
  </div>
)

export default LayoutUser