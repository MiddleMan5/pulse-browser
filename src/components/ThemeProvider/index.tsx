import React, { useState, useContext } from 'react'
import { Theme, ThemeProvider } from '@material-ui/core/styles'
import DarkTheme from './dark.theme'
import LightTheme from './light.theme'

// TODO: Get babel or webpack to generate this map
const ThemeList: {[name: string]: Theme} = {
    DarkTheme,
    LightTheme,
}

// Typescript sugar
const ThemeNames = Object.keys(ThemeList);
type ThemeName = typeof ThemeNames[number];

interface PulseThemeProviderProps {
  // The initial themeName to apply
  themeName?: ThemeName;
};

export const PulseThemeProvider = (props: React.PropsWithChildren<PulseThemeProviderProps>) => {
  // eslint-disable-next-line react/prop-types
  const { children } = props;

  // State to hold the selected theme name
  const [themeName, setThemeName] = useState(props?.themeName ?? ThemeNames[0]);

  // Theme provider context
  const context = React.createContext({themeName, setThemeName});

  // Retrieve the active theme type
  const theme = () => ThemeList[themeName];

  return (
    <context.Provider value={useContext(context)}>
      <ThemeProvider theme={theme()}>{children}</ThemeProvider>
    </context.Provider>
  )
}
