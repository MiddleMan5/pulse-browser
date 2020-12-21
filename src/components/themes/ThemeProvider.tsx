import React, { useState } from 'react'
import { Theme, ThemeProvider } from '@material-ui/core/styles'
import Dark from './Dark'
import Light from './Light'

const themes: {[name: string]: Theme} = {
    Dark,
    Light,
}

function getTheme(theme: string) {
  return themes[theme]
}

// eslint-disable-next-line no-unused-vars
export const CustomThemeContext = React.createContext(
  {
    currentTheme: 'Dark',
    setTheme: null as any,
  },
)

interface CustomThemeProviderProps {

};

export const CustomThemeProvider = (props: React.PropsWithChildren<CustomThemeProviderProps>) => {
  // eslint-disable-next-line react/prop-types
  const { children } = props;

  // TODO: Read current theme from localStorage or maybe from an api
  const currentTheme = 'Dark';

  // State to hold the selected theme name
  const [themeName, setThemeName] = useState(currentTheme);

  // Retrieve the theme object by theme name
  const theme = getTheme(themeName)

  const contextValue = {
    currentTheme: themeName,
    setTheme: setThemeName,
  }

  return (
    <CustomThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  )
}
