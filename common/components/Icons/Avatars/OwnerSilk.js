import Silk from './Silk'
import Patterns from './Patterns'

const OwnerSilk = (ownerObj, style) => {
  console.log(ownerObj, style)
  if (Object.keys(Patterns).includes(ownerObj.silk))
  {
    return <Silk st1={ownerObj.color} style={style} pattern={Patterns[ownerObj.silk].silk}/>
  }
  else
  {
    return <Silk st1={ownerObj.color} style={style} pattern={Patterns['Default'].silk}/>
  }
}

export default OwnerSilk
