import React, { createContext, useState, ReactNode } from 'react'
import { Appearance, ColorSchemeName } from 'react-native'
import { Colors } from '../constants/colors'

// Definição da estrutura do tema
interface Theme {
  background: string
  text: string
  primary: string
  secondary: string
  // Adicione outras propriedades conforme seu objeto Colors
}

interface ThemeContextProps {
  colorScheme: ColorSchemeName
  setColorScheme: React.Dispatch<React.SetStateAction<ColorSchemeName>>
  theme: Theme
}

const defaultValue: ThemeContextProps = {
  colorScheme: 'light',
  setColorScheme: () => {},
  theme: Colors.light,
}

export const ThemeContext = createContext<ThemeContextProps>(defaultValue)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const initialScheme: ColorSchemeName = Appearance.getColorScheme() ?? 'light'
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(initialScheme)

  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
      {children}
    </ThemeContext.Provider>
  )
}
