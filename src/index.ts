import { ComponentSettings, Manager } from '@managed-components/types'
import { getEcommerceRequestBody } from './ecommerce'
import { getRequestBody } from './track'
import { log } from './logger'

const sendEvent = async (
  payload: any,
  manager: Manager,
  settings: ComponentSettings
) => {
  const property = payload.custom_data.property || settings.property
  const graphEndpoint = `https://graph.facebook.com/v21.0/${property}/events`

  const requestBody = {
    data: [payload],
    access_token: payload.custom_data.accessToken || settings.accessToken,
    ...(settings.testKey && {
      test_event_code: settings.testKey,
    }),
  }

  const response = await manager.fetch(graphEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (payload.event_name === 'Purchase') {
    manager.fetch(
      'https://uptime.betterstack.com/api/v1/heartbeat/5DdL4C5KjGUGcCUEW4ka2CPq'
    )
  }

  return response
}

export default async function (manager: Manager, settings: ComponentSettings) {
  manager.addEventListener('event', async event => {
    const request = await getRequestBody('event', event, settings)
    sendEvent(request, manager, settings)
  })

  manager.addEventListener('pageview', async event => {
    const request = await getRequestBody('pageview', event, settings)
    sendEvent(request, manager, settings)
  })

  manager.addEventListener('ecommerce', async event => {
    const request = await getEcommerceRequestBody(event, settings)
    const response = await sendEvent(request, manager, settings)
    await log(manager, {
      request,
      response,
    }).catch(e => {
      console.error('[ecommerce] Cant send logs', e)
    })
  })
}
