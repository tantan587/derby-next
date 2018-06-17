import Horse from './Horse'
import Patterns from './Patterns'

const OwnerHorse = (ownerObj, style) => {
  
  if (Object.keys(Patterns).includes(ownerObj.silk))
  {
    console.log(ownerObj.silk)
    return <Horse st1={ownerObj.color} style={style} pattern={Patterns[ownerObj.silk].horse}/>
  }
  else
  {
    return <Horse st1={ownerObj.color} style={style} pattern={Patterns['Default'].horse}/>
  }
}

export default OwnerHorse
