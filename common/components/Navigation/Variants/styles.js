const styles = (theme) => ({
  logo: {
  },
  link: {
    '&:hover': {
      color: '#EBAB38',
    },
  },
  linkAnchor: {
    fontSize: '1.1em',
    padding: 10,
    textDecoration: 'none',
    fontWeight: 500,
  },
  activeLink: {
    // background: theme.palette.primary.dark,
    color: '#EBAB38',
  },
  nestedContainer: {
    background: theme.palette.primary.A700,
  },
  nested: {
    // paddingLeft: 20,
  },
  leagueIcon: {
    marginRight: 15,
  },
  text : {
    fontSize:16,
    color:'#392007'
  },
  activeText : {
    color:'#EBAB38'
  }
})

export default styles