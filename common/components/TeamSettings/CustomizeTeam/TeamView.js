import OwnerSilk from '../../Icons/Avatars/OwnerSilk'
import OwnerHorse from '../../Icons/Avatars/OwnerHorse'

const TeamView = ({ className, primary, secondary, pattern }) =>

  <div className={className}>
    {OwnerSilk({primary, secondary, pattern},{ height: 100 })}
    {OwnerHorse({primary, secondary, pattern},{ height: 30 })}
    {/* <OwnerHorse
      primary={primary}
      secondary={secondary}
      pattern={pattern && pattern.horse}
      style={{ height: 30 }}
    /> */}
  </div>

export default TeamView
