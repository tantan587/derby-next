import React from 'react'

const DialogHead = ({ img, team_name, data }) =>
  <div style={{ display: 'flex', width: 550, justifyContent: 'space-around' }}>
    <img
      style={{ height: 100, width: 100 }}
      src={img || 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Chicago_Cubs_logo.svg/99px-Chicago_Cubs_logo.svg.png'}
    />
    <div>
      <div>
        {team_name || 'Chicago Cubs'}
      </div>
      <div style={{ display: 'flex', width: 300 }}>
        <div>
          <div>{data || 'XXX'} Owner</div>
          <div>{data || 'XXX'} Owned in Derby Leagues</div>
          <div>{data || 'XXX'} MLB NL Rank</div>
        </div>
        <div>
          <div>{data || 'XXX'} Record</div>
          <div>{data || 'XXX'} Current Points</div>
          <div>{data || 'XXX'} Projected Points</div>
        </div>
      </div>
    </div>
  </div>

export default DialogHead
