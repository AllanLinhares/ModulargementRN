import React, { createContext, useState } from 'react'
import { Appearance } from 'react-native'
import { Colors } from '../constants/colors.js'

const defaultValue = {
  colorScheme: 'light',
  setColorScheme: () => {},
  theme: Colors.light,
}

export const ThemeContext = createContext(defaultValue)

export const ThemeProvider = ({ children }) => {
  const initialScheme = Appearance.getColorScheme() ?? 'light'
  const [colorScheme, setColorScheme] = useState(initialScheme)

  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
      {children}
    </ThemeContext.Provider>
  )
}
