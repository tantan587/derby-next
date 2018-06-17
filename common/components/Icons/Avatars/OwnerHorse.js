import Horse from './Horse'
import Patterns from './Patterns'
import Colors from './Colors'

const OwnerHorse = (ownerObj, style) => {

  let primary = Colors[ownerObj.avatar.primary]
  let secondary = Colors[ownerObj.avatar.secondary]
  let pattern = Patterns[ownerObj.avatar.pattern].horse
  if (pattern)
  {
    return <Horse primary={primary} secondary={secondary} style={style} pattern={pattern}/>
  }
  else
  {
    return <Horse primary={primary} secondary={secondary} style={style} pattern={Patterns['Default'].horse}/>
  }
}

export default OwnerHorse
