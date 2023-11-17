import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { BASE_URL, CONVERSATION_PAGE } from '../../utils/constants'
import { CircularProgress, Typography } from '@mui/material'

function ConversationList({ user, setCurrentConversation, setPage }) {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const getAllConversation = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${BASE_URL}conversation?page=1&limit=100`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        setConversations(response.data.data)
      } catch (err) {
        console.error('Error', err)
        if (err instanceof AxiosError)
          setError(err?.response?.data?.message || err?.message || 'Something Went wrong')
        else setError('Something went wrong')
      }
      setLoading(false)
    }

    getAllConversation()
  }, [user.token])

  if (error)
    return (
      <Typography variant='caption2' color='error'>
        {error}
      </Typography>
    )

  return loading ? (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </div>
  ) : (
    <div
      style={{
        maxHeight: '70vh',
        overflow: 'auto',
      }}
    >
      {conversations.map((conversation) => (
        <div
          key={conversation._id}
          style={{
            backgroundColor: 'lightgray',
            padding: '15px',
            marginBottom: '3px',
            cursor: 'pointer',
          }}
          onClick={() => {
            setCurrentConversation(conversation)
            setPage(CONVERSATION_PAGE)
          }}
        >
          <Typography>User: {conversation?.user?.fullName}</Typography>
          <Typography>Host: {conversation?.host?.fullName || 'Not Assigned'}</Typography>
        </div>
      ))}
    </div>
  )
}

export default ConversationList
