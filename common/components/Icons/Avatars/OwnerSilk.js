import Silk from './Silk'
import Patterns from './Patterns'
import Colors from './Colors'

const OwnerSilk = (avatar, style) => {
  let primary = Colors['Default']
  let secondary = Colors['Default']
  let pattern = Patterns['Default']

  if (avatar)
  {
    primary = avatar.primary ? Colors[avatar.primary] : primary
    secondary = avatar.secondary ? Colors[avatar.secondary] : secondary
    pattern = avatar.pattern ? Patterns[avatar.pattern].silk : pattern
  }
  return <Silk 
    primary={primary}
    secondary={secondary}
    style={style} 
    pattern={pattern} 
    darkPrimaryColorInd={primary==='Black'}/>

}

export default OwnerSilk
