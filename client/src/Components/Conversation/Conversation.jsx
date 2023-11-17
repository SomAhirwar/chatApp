import { Button, TextField, Typography } from '@mui/material'
import { useState } from 'react'

function ConversationList({ user, conversation, messages, sendMessage }) {
  const [text, setText] = useState('')

  return (
    <div>
      <div style={{ backgroundColor: 'lightgray', padding: '15px', marginBottom: '3px' }}>
        <Typography>User: {conversation?.user?.fullName}</Typography>
        <Typography>Host: {conversation?.host?.fullName || 'Not Assigned'}</Typography>
      </div>
      <div style={{ maxHeight: '55vh' }}>
        {messages.map((message) => (
          <div
            key={message._id}
            style={{
              display: 'flex',
              justifyContent: user.user._id === message.sender ? 'flex-end' : 'flex-start',
            }}
          >
            <div>{message.text}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: '5px' }}>
        <TextField
          multiline
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flexGrow: 2 }}
        />
        <Button
          variant='contained'
          onClick={() => sendMessage({ conversationId: conversation._id, text })}
        >
          Send
        </Button>
      </div>
    </div>
  )
}

export default ConversationList
