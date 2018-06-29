import Silk from './Silk'
import Patterns from './Patterns'
import Colors from './Colors'

const OwnerSilk = (ownerObj, style) => {

  if (!ownerObj.avatar)
  {
    return <Silk style={style} pattern={Patterns['Default'].silk}/>
  }
  let primary = Colors[ownerObj.avatar.primary]
  let secondary = Colors[ownerObj.avatar.secondary]
  let pattern = Patterns[ownerObj.avatar.pattern].silk
  if (pattern)
  {
    return <Silk 
      primary={primary}
      secondary={secondary}
      style={style} 
      pattern={pattern} 
      darkPrimaryColorInd={ownerObj.avatar.primary==='Black'}/>
  }
  else
  {
    return <Silk primary={primary} secondary={secondary} style={style} pattern={Patterns['Default'].silk}/>
  }
}

export default OwnerSilk
