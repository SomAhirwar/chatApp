import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Popper from '@mui/material/Popper'
import {
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Typography,
} from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import LoginForm from '../LoginForm/LoginForm'
import {
  CONVERSATION_LIST_PAGE,
  LOGIN_PAGE,
  SIGNUP_PAGE,
  BASE_URL,
  HOME_PAGE,
  CONVERSATION_PAGE,
  CONVERSATION_REQUEST_PAGE,
  ROLE_USER,
} from '../../utils/constants'
import SignupForm from '../SignupForm/SignupForm'
import ConversationList from '../ConversationList/ConversationList'
import ConversationRequestList from '../ConversationRequestList/ConversationRequestList'
import Conversation from '../Conversation/Conversation'
import { io } from 'socket.io-client'
import axios, { AxiosError } from 'axios'

export default function SimplePopper() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('')
  const [error, setError] = useState('')
  const [currentConversation, setCurrentConversation] = useState(null)
  const [conversationRequest, setConversationRequest] = useState([])
  const [currentConversationMessages, setCurrentConversationMessages] = useState([])

  const socketRef = useRef(null)

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined

  const createNewConversation = () => {
    const socket = socketRef.current
    if (socket) {
      socket.emit('newConversation', '', (response) => {
        if (response.status === 'success') {
          setCurrentConversation(response.data.conversation)
          setPage(CONVERSATION_PAGE)
        }
      })
    }
  }

  const handleConversationRequestClick = (conversationId) => {
    const socket = socketRef.current
    if (socket) {
      socket.emit('acceptConversation', { conversationId }, (response) => {
        if (response.status === 'success') {
          setCurrentConversation(response.data.conversation)
          setPage(CONVERSATION_PAGE)
        }
      })
    }
  }

  const handleSendMessage = (message) => {
    const socket = socketRef.current
    if (socket) {
      socket.emit('sendMessage', message, (response) => {
        if (response.status !== 'success') {
          setError(response.message)
        }
        console.log('sendMessage')
      })
    }
  }

  useEffect(() => {
    const getCurrentConversationMessage = async () => {
      if (currentConversation?._id) {
        try {
          const response = await axios.get(
            `${BASE_URL}conversation/${currentConversation?._id}/messages`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            },
          )
          console.log(response)
          setCurrentConversationMessages(response.data.data.reverse())
        } catch (err) {
          console.error('Error', err)
          if (err instanceof AxiosError)
            setError(err?.response?.data?.message || err?.message || 'Something Went wrong')
          else setError('Something went wrong')
        }
      }
    }

    getCurrentConversationMessage()
  }, [currentConversation?._id])

  useEffect(() => {
    if (user?.token) {
      const socket = io(BASE_URL, {
        extraHeaders: {
          Authorization: `Bearer ${user.token}`,
        },
        withCredentials: true,
      })

      socketRef.current = socket

      const handleConversationRequest = (conversationResponse) => {
        setConversationRequest((prev) => [...prev, conversationResponse.conversation])
      }
      const handleConversationJoined = (conversationResponse) => {
        const conversation = conversationResponse.conversation
        console.log(conversation, currentConversation)
        if (conversation?._id === currentConversation?._id) {
          setCurrentConversation(conversation)
        }
      }

      const handleConversationAccepted = ({ conversationId }) => {
        setConversationRequest((prev) =>
          prev.filter((conversation) => conversation._id !== conversationId),
        )
      }

      const handleReceiveMessage = (message) => {
        setCurrentConversationMessages((prev) => [...prev, message])
        console.log('rec', message)
      }

      socket.on('conversationRequest', handleConversationRequest)
      socket.on('conversationJoined', handleConversationJoined)
      socket.on('conversationAccepted', handleConversationAccepted)
      socket.on('receivedMessage', handleReceiveMessage)
      // receivedMessage
      return () => {
        socket.off('conversationRequest', handleConversationRequest)
        socket.off('conversationJoined', handleConversationJoined)
        socket.off('conversationAccepted', handleConversationAccepted)
        socket.off('receivedMessage', handleReceiveMessage)
      }
    }
  }, [user?.token, currentConversation?._id])

  return (
    <div style={{ transform: 'translate(-50px, -50px)' }}>
      <IconButton onClick={handleClick}>
        <ChatIcon sx={{ color: 'primary.main', height: '50px', width: '50px' }} />
      </IconButton>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Box style={{ border: '1px solid gray', padding: '20px', borderRadius: '20px' }}>
          <FormControl fullWidth style={{ minWidth: '350px', paddingBottom: '30px' }}>
            <InputLabel id='demo-simple-select-label'>Navigate</InputLabel>
            <Select value={page} label='Age' onChange={(el) => setPage(el.target.value)}>
              {user && <MenuItem value={HOME_PAGE}>{HOME_PAGE}</MenuItem>}
              {!user && <MenuItem value={LOGIN_PAGE}>{LOGIN_PAGE}</MenuItem>}
              {!user && <MenuItem value={SIGNUP_PAGE}>{SIGNUP_PAGE}</MenuItem>}
              {user && <MenuItem value={CONVERSATION_LIST_PAGE}>conversations</MenuItem>}
              {user && (
                <MenuItem value={CONVERSATION_REQUEST_PAGE}>conversations requests</MenuItem>
              )}
            </Select>
          </FormControl>
          {error && (
            <Typography color='error' variant='caption2' align='center'>
              {error}
            </Typography>
          )}
          {page === HOME_PAGE && (
            <div>
              {user && user.user.role === ROLE_USER && (
                <Button variant='contained' fullWidth onClick={() => createNewConversation()}>
                  New Conversation
                </Button>
              )}
            </div>
          )}
          {page === LOGIN_PAGE && <LoginForm user={user} setUser={setUser} setPage={setPage} />}
          {page === SIGNUP_PAGE && <SignupForm user={user} setUser={setUser} setPage={setPage} />}
          {page === CONVERSATION_LIST_PAGE && (
            <ConversationList
              user={user}
              setCurrentConversation={setCurrentConversation}
              setPage={setPage}
            />
          )}
          {page === CONVERSATION_PAGE && (
            <Conversation
              conversation={currentConversation}
              messages={currentConversationMessages}
              user={user}
              sendMessage={handleSendMessage}
            />
          )}
          {page === CONVERSATION_REQUEST_PAGE && (
            <ConversationRequestList
              conversations={conversationRequest}
              handleClick={handleConversationRequestClick}
            />
          )}
        </Box>
      </Popper>
    </div>
  )
}
