import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import { useLayoutEffect, useState } from 'react'
import { BASE_URL, HOME_PAGE } from '../../utils/constants'
import axios, { AxiosError } from 'axios'

function LoginForm({ user, setUser, setPage }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${BASE_URL}auth/login`, { email, password })
      setUser(response.data.data)
    } catch (err) {
      console.error('Error', err)
      if (err instanceof AxiosError)
        setError(err?.response?.data?.message || err?.message || 'Something Went wrong')
      else setError('Something went wrong')
    }
    setLoading(false)
  }

  useLayoutEffect(() => {
    if (user) setPage(HOME_PAGE)
  }, [user])

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '350px',
        justifyContent: 'center',
        // alignItems: 'center',
      }}
    >
      <Typography variant='h4' align='center'>
        Login
      </Typography>
      <Typography variant='caption2' color='error' align='center'>
        {error}
      </Typography>
      <TextField
        required
        label='email'
        onChange={(el) => setEmail(el.target.value)}
        value={email}
      />
      <TextField
        required
        label='password'
        type='password'
        onChange={(el) => setPassword(el.target.value)}
        value={password}
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button variant='contained' type='submit'>
            Login
          </Button>
        )}
      </div>
    </form>
  )
}

export default LoginForm
