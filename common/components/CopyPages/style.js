export default {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  H1: {
    fontFamily:'museo-slab-bold',
    color:'#299149',
    fontSize: 24,
    margin: '1em 0em',
  },
  H2: {
    fontFamily:'museo-slab-bold',
    color:'#299149',
    fontSize: 14,
    margin: '1em 0em'
  },
  H3: {
    fontFamily:'Roboto',
    fontWeight: 400,
    fontSize: 15,
    lineHeight: '20px',
    color:'#717171',
    marginBottom: '0.5em 0em'
  },
  P: {
    fontFamily:'Roboto',
    fontSize: 15,
    lineHeight: '20px',
    color:'#717171',
  },
  B: {
    fontWeight: 600
  }
}

export const H2 = props => <div style={{
  fontFamily:'museo-slab-bold',
  color:'#299149',
  fontSize: 14,
  margin: '1em 0em'
}}>{props.children}</div>

export const H3 = props => <div style={{
  fontFamily:'Roboto',
  fontWeight: 400,
  fontSize: 15,
  lineHeight: '20px',
  color:'#717171',
  marginBottom: '0.5em 0em'
}}>{props.children}</div>
export const Indent = props => <div style={{ margin: '3px 0px', marginLeft: 26 }}>{props.children}</div>
export const UL = props => <Indent><span style={{ marginRight: 6}}>&bull;</span>{props.children}</Indent>
export const SubUL = props => <Indent><span style={{ marginRight: 6}}>&#x25E6;</span>{props.children}</Indent>
export const B = props => <span style={{ fontWeight: 600 }}>{props.children}</span>
export const I = props => <span style={{ fontStyle: 'italic' }}>{props.children}</span>
export const U = props => <span style={{ textDecoration: 'underline' }}>{props.children}</span>
export const Top = ({ px }) => <div style={{ marginTop: px || 20 }} />
