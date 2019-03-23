const R = require('ramda')
import { withStyles } from '@material-ui/core/styles'
import StyledButton from '../../Navigation/Buttons/StyledButton'
import DerbyCheckbox from '../../UI/DerbyCheckbox'

const styles = theme => ({
  title: {
    fontWeight: 600
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '11px 21px 4px 11px',
    fontSize: 10,
    fontWeight: 500
  },
  tableBody: {
    padding: 10,
    border: '1px solid black',
    fontSize: 12,
    '& > :nth-child(odd)': {
      backgroundColor: '#F5F5F5'
    }
  },
  tableRow: {

    display: 'flex',
    paddingRight:10,
    justifyContent: 'flex-start',
    width: '100%',
    overflow: 'hidden',
    height: 35,
    alignItems: 'center'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: 20,
    backgroundColor: 'white !important',
    [theme.breakpoints.only('xs')]: {
      flexDirection: 'column',
      marginLeft: 20,
      height: 80
    }
  },
  tableSize: {
    [theme.breakpoints.down('xs')]: {
      minWidth: 500
    }
  }
})

const statusColors = {
  'Confirmed': '#299149',
  'Awaiting Reply': '#E9AA44',
  'Not Invited Yet': '#FA3035'
}

const determineStatus = (member) => {
  if (member.status) {
    if (member.username && member.status === 'invited_to_signup') return 'signedup'
    else return member.status
  } else return null
}

const ManageTable = withStyles(styles)(({ 
  classes, selectedInvites, members, maxOwners,  onCheckboxChange, onEmailInviteClick, onRemoveOwnerClick }) =>
  <div>
    <div className={classes.title}>Member List</div>
    <div style={{ overflowX: 'scroll' }}>
      <div className={classes.tableSize}>
        <div className={classes.header}>
          <div style={{ flex:  1, textAlign:'center' }}></div>
          <div style={{ flex: 5, textAlign:'center' }}>Email</div>
          <div style={{ flex: 5, textAlign:'center' }}>Username</div>
          <div style={{ flex: 3, textAlign:'center'   }}>Status</div>
          <div style={{ flex: 1, textAlign:'center', marginRight:0 }}>Select</div>
        </div>
        <div className={classes.tableBody}>
          {
            Array.from(new Array(maxOwners),(val,index)=>index).map(idx => 
            {
              let member = members[idx]
              return ( <div key={idx} className={classes.tableRow}>
                <div style={{ flex: 1, textAlign:'center'  }}>
                  {`${idx + 1}`}
                </div>
                <div style={{ flex: 5, textAlign:'center'  }}>
                  {member && (R.has('email')(member) && member.email) }
                </div>
                <div style={{ flex: 5, textAlign:'center'  }}>
                  {member && R.has('username')(member) && member.username}
                </div>
                <div style={{ flex: 3, textAlign:'center' , color: member && statusColors[member.status] }}>
                  { member && determineStatus(member) } 
                </div>
                <div style={{ flex: 1, marginRight:-14 }}>
                  {member &&
                  <DerbyCheckbox
                    onClick={onCheckboxChange}
                    state={member}
                    checked={!!selectedInvites[member.invite_id]}
                  /> }
                </div>
              </div>)})
          }
          <div className={classes.buttons}>
            <StyledButton
              text="Email Invite"
              onClick={onEmailInviteClick}
            />
            <StyledButton
              text="Remove Owner"
              onClick={onRemoveOwnerClick}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default ManageTable
