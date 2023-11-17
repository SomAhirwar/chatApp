import { Typography, Box } from '@mui/material'

function ConversationRequestList({ conversations, handleClick }) {
  return (
    <div>
      {conversations.map((conversation) => (
        <Box
          key={conversation._id}
          style={{
            cursor: 'pointer',
            padding: '10px',
            backgroundColor: 'lightgrey',
            marginBottom: '10px',
          }}
          onClick={() => handleClick(conversation._id)}
        >
          <Typography>{conversation.user.fullName}</Typography>
        </Box>
      ))}
    </div>
  )
}

export default ConversationRequestList
