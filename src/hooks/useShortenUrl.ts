import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

interface ShortenResponse {
  shortUrl: string
}

export const useShortenUrl = () => {
  return useMutation<ShortenResponse, AxiosError, string>({
    mutationFn: async (url: string) => {
      const response = await axios.post<ShortenResponse>(
        `${process.env.REACT_APP_API_URL}/api/shorten`,
        { originalUrl: url }
      )
      return response.data
    },
  })
}
