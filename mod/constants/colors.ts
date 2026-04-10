// Definição da interface para o tema
export interface Theme {
  text: string
  background: string
  icon: string
  button: string
  primary: string,
  secondary: string
}

// Definição da estrutura Colors com tipagem
export const Colors: { light: Theme; dark: Theme } = {
  light: {
    text: '#000',
    background: '#fff',
    icon: '#333',
    button: '#007bff',
    primary: '#007bff',
    secondary: '#6c757d',
  },
  dark: {
    text: '#fff',
    background: '#000',
    icon: '#ccc',
    button: '#17a2b8',
    primary: '#17a2b8',
    secondary: '#6c757d',
  }
}
