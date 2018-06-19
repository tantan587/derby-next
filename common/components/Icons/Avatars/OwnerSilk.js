import Silk from './Silk'
import Patterns from './Patterns'
import Colors from './Colors'

const OwnerSilk = (ownerObj, style) => {
  let primary = Colors[ownerObj.avatar.primary]
  let secondary = Colors[ownerObj.avatar.secondary]
  let pattern = Patterns[ownerObj.avatar.pattern].silk
  if (pattern)
  {
    return <Silk primary={primary} secondary={secondary} style={style} pattern={pattern}/>
  }
  else
  {
    return <Silk primary={primary} secondary={secondary} style={style} pattern={Patterns['Default'].silk}/>
  }
}

export default OwnerSilk
