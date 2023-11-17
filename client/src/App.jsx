import { useState } from 'react'
import ChatPopper from './Components/ChatPopper/ChatPopper'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      }}
    >
      <ChatPopper />
    </div>
  )
}

export default App
