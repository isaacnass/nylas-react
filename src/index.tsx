import { useCallback } from 'react'

enum DefaultEndpoints {
  GenerateAuthUrl = '/nylas/generate-auth-url',
  ExchangeMailboxToken = '/nylas/exchange-mailbox-token',
}

interface NylasReactHookProps {
  serverBaseUrl: string
  successRedirectUrl: string
  onConnectionError?: (error: Error) => void
  endpointOverrideGenerateAuthUrl?: string
  endpointOverrideExchangeMailboxToken?: string
}

const getUrlQueryParam = (param: string) =>
  new URLSearchParams(window.location.search).get(param)

const useNylasReact = (props: NylasReactHookProps) => {
  const startAuthProcess = useCallback(
    async (email_address?: string) => {
      try {
        const url =
          props.serverBaseUrl +
          (props.endpointOverrideGenerateAuthUrl ||
            DefaultEndpoints.GenerateAuthUrl)
        const rawResp = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_address,
            success_url: props.successRedirectUrl,
          }),
        })
        const r = await rawResp.text()

        console.log(r)
        window.location.href = r
      } catch (e: any) {
        console.warn(`Error fetching auth URL:`, e)
        props.onConnectionError && props.onConnectionError(e)
      }
    },
    [
      props.endpointOverrideGenerateAuthUrl,
      props.onConnectionError,
      props.serverBaseUrl,
      props.successRedirectUrl,
    ]
  )

  const exchangeMailboxToken = useCallback(async () => {
    try {
      const access_token = getUrlQueryParam('code')
      if (!access_token) {
        return false
      }

      const url =
        props.serverBaseUrl +
        (props.endpointOverrideExchangeMailboxToken ||
          DefaultEndpoints.ExchangeMailboxToken)
      const rawResp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csrfToken: getUrlQueryParam('state'),
          token: access_token,
        }),
      })
      const r = await rawResp.text()

      console.log(r)
      return r
    } catch (e: any) {
      console.warn(`Error exchanging mailbox token:`, e)
      props.onConnectionError && props.onConnectionError(e)
      return false
    }
  }, [
    props.onConnectionError,
    props.endpointOverrideExchangeMailboxToken,
    props.serverBaseUrl,
  ])

  return {
    startAuthProcess,
    exchangeMailboxToken,
  }
}

export default useNylasReact
