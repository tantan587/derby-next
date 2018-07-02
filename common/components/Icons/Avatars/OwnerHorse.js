import Horse from './Horse'
import Patterns from './Patterns'
import Colors from './Colors'

const OwnerHorse = (avatar, style) => {
  let primary = Colors['Default']
  let secondary = Colors['Default']
  let pattern = Patterns['Default']

  if (avatar)
  {
    primary = avatar.primary ? Colors[avatar.primary] : primary
    secondary = avatar.secondary ? Colors[avatar.secondary] : secondary
    pattern = avatar.pattern ? Patterns[avatar.pattern].horse : pattern
  }

  return <Horse 
    primary={primary}
    secondary={secondary}
    style={style} 
    pattern={pattern}/>
}

export default OwnerHorse
