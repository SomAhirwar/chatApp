import { Typography, Box } from '@mui/material'

function ConversationRequestList({ conversations, handleClick }) {
  return (
    <div>
      {conversations.map((conversation) => (
        <Box
          key={conversation._id}
          style={{ cursor: 'pointer' }}
          onClick={() => handleClick(conversation._id)}
        >
          <Typography>{conversation.user.fullName}</Typography>
        </Box>
      ))}
    </div>
  )
}

export default ConversationRequestList
