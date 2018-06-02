import TopNavLeague from './Navigation/TopNavLeague'


const layoutStyle = {
  margin: -5,
  padding: 0,
  //border: "1px solid #DDD"
}

const LayoutLeague = (props) => (
  <div style={layoutStyle}>
    <TopNavLeague />
    {props.children}
  </div>
)

export default LayoutLeague