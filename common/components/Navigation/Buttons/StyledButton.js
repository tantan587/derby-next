import Link from 'next/link'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

const StyledButton = ({ classes, text, link, background, color, width, height, styles}) =>
  <Link href={link}>
    <Button
      variant="raised"
      className={classes.root}
      style={{
        backgroundColor: background || '#E9AA45',
        color: color || 'white',
        width: width || 200,
        height: height  + 'px'|| 25 + 'px',
        lineHeight: height  + 'px'|| 25 + 'px',
        padding: '0px',
        fontSize: 12,
        borderRadius: '0px',
        textAlign: 'center',
        verticalAlign: 'middle',
        ...styles,
      }}
    >
      { text }
    </Button>
  </Link>
export default withStyles({ root: { minHeight: 25 } })(StyledButton)
