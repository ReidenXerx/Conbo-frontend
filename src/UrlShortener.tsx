import React, { useState } from 'react'
import { useShortenUrl } from './hooks/useShortenUrl'
import {
  CircularProgress,
  Snackbar,
  Alert,
  AlertColor,
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Link,
} from '@mui/material'
import Logo from './assets/DALL·E-2024-04-01-20.01.svg'
import axios, { AxiosError } from 'axios'

const UrlShortener = () => {
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const shortenUrlMutation = useShortenUrl()
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>('success')

  const validateUrl = (url: string): boolean => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ) // fragment locator
    return !!pattern.test(url)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateUrl(url)) {
      setUrlError('Please enter a valid URL')
      return
    }
    setUrlError('')
    setLoading(true)
    shortenUrlMutation.mutate(url, {
      onSuccess: (data) => {
        setLoading(false)
        setShortenedUrl(data.shortUrl)
        setSnackbarMessage('URL shortened successfully!')
        setSnackbarSeverity('success')
        setOpenSnackbar(true)
      },
      onError: (error: AxiosError<any>) => {
        setLoading(false)
        let errorMessage = 'An error occurred.'
        if (axios.isAxiosError(error)) {
          const serverError = error
          if (serverError && serverError.response) {
            errorMessage = serverError.response.data.message || errorMessage
          }
        }
        setSnackbarMessage(errorMessage)
        setSnackbarSeverity('error')
        setOpenSnackbar(true)
      },
    })
  }

  return (
    <Container component="main" maxWidth="xs">
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 8,
          }}
        >
          <Box
            component="img"
            sx={{
              height: 250,
              width: 250,
              marginBottom: 4,
            }}
            alt="LinkSnap logo"
            src={Logo}
          />
          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <TextField
              fullWidth
              error={!!urlError}
              helperText={urlError}
              label="Enter URL"
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              margin="normal"
              InputProps={{
                endAdornment: loading ? <CircularProgress size={20} /> : null,
                style: { borderRadius: 25 },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                borderRadius: 25,
                padding: '10px 0',
              }}
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </Button>
          </form>
          {shortenedUrl && (
            <Typography variant="body1" mt={2}>
              Shortened URL:{' '}
              <Link href={shortenedUrl} target="_blank" rel="noopener">
                {shortenedUrl}
              </Link>
            </Typography>
          )}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
          >
            <Alert
              onClose={() => setOpenSnackbar(false)}
              severity={snackbarSeverity}
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Paper>
      </Grid>
    </Container>
  )
}

export default UrlShortener
