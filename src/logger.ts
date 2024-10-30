import { Manager } from '@managed-components/types'

export const log = (manager: Manager, payload: any) => {
  return manager.fetch('https://in.logs.betterstack.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ukVxK27VFoRCh63qXqDH6e7j',
    },
    body: JSON.stringify({
      event: 'ecommerce',
      payload,
    }),
  })
}
