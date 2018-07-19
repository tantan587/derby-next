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

const ManageTable = withStyles(styles)(({ classes, members }) =>
  <div>
    <div className={classes.title}>Member List</div>
    <div style={{ overflowX: 'scroll' }}>
      <div className={classes.tableSize}>
        <div className={classes.header}>
          <div style={{ flex: 5, marginLeft: 12, position: 'relative', left: 12 }}>Name</div>
          <div style={{ flex: 5 }}>Email</div>
          <div style={{ flex: 3 }}>Status</div>
          <div style={{ flex: 1 }}>Select</div>
        </div>
        <div className={classes.tableBody}>
          {
            members.map((member, idx) => <div key={idx} className={classes.tableRow}>
              <div style={{ flex: 5, marginLeft: 12 }}>
                {`${idx}. ${member.name}`}
              </div>
              <div style={{ flex: 5 }}>
                { member.email }
              </div>
              <div style={{ flex: 3, color: statusColors[member.status] }}>
                { member.status }
              </div>
              <div style={{ flex: 1 }}>
                <DerbyCheckbox />
              </div>
            </div>)
          }
          <div className={classes.buttons}>
            <StyledButton
              text="Email Invite"
            />
            <StyledButton
              text="Remove Owner"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default ManageTable
