import { withStyles } from '@material-ui/core/styles'

const newsStyle = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0px 8px',
    textAlign: 'center',
    fontFamily: 'Roboto'
  },
  headline: {
    margin: '10px 0px',
    fontSize: 16,
    fontWeight: 500,
    color: '#717171'
  },
  body: {
    fontSize: 12,
    fontWeight: 400,
    color: '#848484'
  },
  button: {
    alignSelf: 'stretch',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '12px',
    paddingBottom: '20px',
    borderBottom: '1px solid #848484'
  },
}

const NewsItem = withStyles(newsStyle)(({ classes, headline, body, Button }) =>
  <div className={classes.root}>
    <div className={classes.headline}>{headline}</div>
    <div className={classes.body}>{body}</div>

    {Button && <div className={classes.button}><Button /></div>}
  </div>
)

const TheWire = ({ items }) =>
  <div>
    {
      items.map(item => <NewsItem headline={item.headline} body={item.body} Button={item.Button} />)
    }
  </div>

export default TheWire
