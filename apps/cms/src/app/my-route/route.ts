import { getPayload } from 'payload'

import config from '../../payload.config';

export const GET = async () => {
  const payload = await getPayload({
    config,
  })

  const data = await payload.find({
    collection: 'users',
  })

  return Response.json(data)
}
