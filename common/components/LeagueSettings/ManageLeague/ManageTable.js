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
    justifyContent: 'space-between',
    padding: '11px 11px 4px 11px',
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
    justifyContent: 'space-between',
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

const ManageTable = withStyles(styles)(({ classes, selectedInvites, members, onCheckboxChange, onEmailInviteClick, onRemoveOwnerClick }) =>
  <div>
    <div className={classes.title}>Member List</div>
    <div style={{ overflowX: 'scroll' }}>
      <div className={classes.tableSize}>
        <div className={classes.header}>
          <div style={{ flex: 5, marginLeft: 12, position: 'relative', left: 20 }}>Email</div>
          <div style={{ flex: 5 }}>Username</div>
          <div style={{ flex: 3 }}>Status</div>
          <div style={{ flex: 1 }}>Select</div>
        </div>
        <div className={classes.tableBody}>
          {
            members.map((member, idx) => <div key={idx} className={classes.tableRow}>
              <div style={{ display: 'flex', flex: 5, marginLeft: 12 }}>
                <div style={{ fontWeight: 600, width: 20 }}>{`${idx + 1}.`}</div>
                <div>{ R.has('email')(member) && member.email }</div>
              </div>
              <div style={{ flex: 5 }}>
                {R.has('username')(member) && member.username}
              </div>
              <div style={{ flex: 3, color: statusColors[member.status] }}>
                { determineStatus(member) }
              </div>
              <div style={{ flex: 1 }}>
                <DerbyCheckbox
                  onClick={onCheckboxChange}
                  state={member}
                  checked={!!selectedInvites[member.invite_id]}
                />
              </div>
            </div>)
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
