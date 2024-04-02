import { ThemeProvider, createTheme } from '@mui/material/styles'
import Container from '@mui/material/Container'
import UrlShortener from './UrlShortener' // Make sure the import path matches your file structure
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline } from '@mui/material'

const queryClient = new QueryClient()

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  shape: {
    borderRadius: 8, // Adjust the border radius as you like
  },
  // ... other theme customizations
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container component="main" maxWidth="xs">
          <UrlShortener />
        </Container>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
