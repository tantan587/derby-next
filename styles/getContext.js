/* eslint-disable no-underscore-dangle */

import { create, SheetsRegistry } from 'jss'
import preset from 'jss-preset-default'
import { createMuiTheme } from 'material-ui/styles'
import { brown, yellow } from 'material-ui/colors'
import createGenerateClassName from 'material-ui/styles/createGenerateClassName'
import materialpalette from 'material-palette'
import hsl from 'hsl-to-hex'

//https://github.com/mui-org/material-ui/issues/8075
//https://github.com/mui-org/material-ui/issues/6770
//https://github.com/mui-org/material-ui/issues/7812
//https://www.materialpalette.com/green/brown
//https://www.npmjs.com/package/material-palette

const hslDerbyGreen = materialpalette({ h: 139, s: 100, l: 29 })
let derbyGreen = {}
for (const key of Object.keys(hslDerbyGreen)) {
  derbyGreen[key] = hsl(hslDerbyGreen[key].h, hslDerbyGreen[key].s, hslDerbyGreen[key].l)
}
derbyGreen['contrastDefaultColor']= 'dark'

const theme = createMuiTheme({
  palette: {
    primary: derbyGreen,
    secondary: brown,
    tertiary : yellow
  },
})

// Configure JSS
const jss = create(preset())
jss.options.createGenerateClassName = createGenerateClassName

function createContext() {
  return {
    jss,
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
  }
}

export default function getContext() {
  // Make sure to create a new store for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return createContext()
  }

  // Reuse context on the client-side
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createContext()
  }

  return global.__INIT_MATERIAL_UI__
}