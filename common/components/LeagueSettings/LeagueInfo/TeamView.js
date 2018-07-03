import Silk from '../../Icons/Avatars/Silk'
import Horse from '../../Icons/Avatars/Horse'

const TeamView = ({ className, primary, secondary, pattern }) =>
  <div className={className}>
    <Silk
      primary={primary}
      secondary={secondary}
      pattern={pattern && pattern.silk}
      style={{ height: 100 }}
    />
    <Horse
      primary={primary}
      secondary={secondary}
      pattern={pattern && pattern.horse}
      style={{ height: 30 }}
    />
  </div>

export default TeamView
