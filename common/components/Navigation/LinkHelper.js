import Link from 'next/link'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

const LinkHelper = ({
  children,
  href,
  classes,
  Icon,
  endAdornment,
  parent,
  onClick,
  disabled,
}) => (
  <ListItem
    button
    dense
    onClick={onClick}
    className={classes.link}
    disabled={disabled}
  >
    <ListItemIcon>
      <Icon style={{color: 'inherit'}} />
    </ListItemIcon>
    {parent ? (
      <ListItemText
        inset
        primary={children}
        primaryTypographyProps={{
          variant: 'body1',
          className: classes.linkAnchor,
          color: 'inherit',
        }}
      />
    ) : (
      <Link href={href}>
        <ListItemText
          inset
          primary={children}
          primaryTypographyProps={{
            variant: 'body1',
            className: classes.linkAnchor,
            color: 'inherit',
            component: 'a',
          }}
        />
      </Link>  
    )}
    {endAdornment}
  </ListItem>
)

export default LinkHelper