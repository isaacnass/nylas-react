import React from 'react'
import ReactDOM from 'react-dom'
import useNylasReact from '../src'

const serverBaseUrl = 'http://localhost:3001'
const relativeRedirectUrl = '/' // This can be a separate page which must also use the useNylasReact hook

function App() {
  const [email, setEmail] = React.useState('')
  const [result, setResult] = React.useState('')
  const { startAuthProcess, exchangeMailboxToken } = useNylasReact({
    serverBaseUrl,
    successRedirectUrl: relativeRedirectUrl,
  })

  React.useEffect(() => {
    // Will automatically pull exchange token
    exchangeMailboxToken().then((r) => r && setResult(r))
  }, [])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          startAuthProcess(email)
        }}
      >
        <input
          type="email"
          placeholder="Email Address (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Connect</button>
      </form>
      {result}
    </div>
  )
}

ReactDOM.render(document.getElementById('root') as any, (<App />) as any)
