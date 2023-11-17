import {
  Button,
  CircularProgress,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material'
import { useLayoutEffect, useState } from 'react'
import { BASE_URL, HOME_PAGE, ROLE_HOST, ROLE_USER } from '../../utils/constants'
import axios, { AxiosError } from 'axios'

function SignupForm({ user, setUser, setPage }) {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState(ROLE_USER)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${BASE_URL}auth/signup`, {
        email,
        password,
        phone,
        passwordConfirm,
        role,
        fullName,
      })
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
      }}
    >
      <Typography variant='h4' align='center'>
        SignUp
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
        label='Full Name'
        onChange={(el) => setFullName(el.target.value)}
        value={fullName}
      />
      <TextField
        required
        label='phone'
        onChange={(el) => setPhone(el.target.value)}
        value={phone}
      />
      <TextField
        required
        label='password'
        type='password'
        onChange={(el) => setPassword(el.target.value)}
        value={password}
      />
      <TextField
        required
        label='passwordConfirm'
        type='password'
        onChange={(el) => setPasswordConfirm(el.target.value)}
        value={passwordConfirm}
      />

      <FormControl fullWidth>
        <InputLabel id='demo-simple-select-label'>Age</InputLabel>
        <Select value={role} label='Role' onChange={(el) => setRole(el.target.value)}>
          <MenuItem value={ROLE_USER}>{ROLE_USER}</MenuItem>
          <MenuItem value={ROLE_HOST}>{ROLE_HOST}</MenuItem>
        </Select>
      </FormControl>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button variant='contained' type='submit'>
            Signup
          </Button>
        )}
      </div>
    </form>
  )
}

export default SignupForm
