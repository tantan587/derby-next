/* eslint-disable no-underscore-dangle */

import { SheetsRegistry } from 'jss'
import { createMuiTheme, createGenerateClassName } from '@material-ui/core/styles'
import materialpalette from 'material-palette'
import hsl from 'hsl-to-hex'

//https://github.com/mui-org/material-ui/issues/8075
//https://github.com/mui-org/material-ui/issues/6770
//https://github.com/mui-org/material-ui/issues/7812
//https://www.materialpalette.com/green/brown
//https://www.npmjs.com/package/material-palette

//#269349
//'#EBAB38',
//#392007
//#e3dac9
const hslDerbyGreen = materialpalette({ h: 139, s: 59, l: 36 })
let derbyGreen = {}
for (const key of Object.keys(hslDerbyGreen)) {
  derbyGreen[key] = hsl(hslDerbyGreen[key].h, hslDerbyGreen[key].s, hslDerbyGreen[key].l)
}
derbyGreen['contrastDefaultColor']= 'dark'

const hslDerbyBrown = materialpalette({ h: 30, s: 78, l: 13 })
let derbyBrown = {}
for (const key of Object.keys(hslDerbyBrown)) {
  derbyBrown[key] = hsl(hslDerbyBrown[key].h, hslDerbyBrown[key].s, hslDerbyBrown[key].l)
}
derbyBrown['contrastDefaultColor']= 'dark'

const hslDerbyYellow = materialpalette({ h: 39, s: 82, l: 57 })
let derbyYellow = {}
for (const key of Object.keys(hslDerbyYellow)) {
  derbyYellow[key] = hsl(hslDerbyYellow[key].h, hslDerbyYellow[key].s, hslDerbyYellow[key].l)
}
derbyYellow['contrastDefaultColor']= 'dark'

const theme = createMuiTheme({
  palette: {
    primary: derbyGreen,
    secondary: derbyBrown,
    tertiary : derbyYellow
  },
})

// Configure JSS
function createPageContext() {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName(),
  }
}

export default function getPageContext() {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext()
  }

  // Reuse context on the client-side.
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext()
  }

  return global.__INIT_MATERIAL_UI__
}