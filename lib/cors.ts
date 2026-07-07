export function corsResponse(
  data: any,
  status: number = 200,
  additionalHeaders?: Record<string, string>
) {
  return Response.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
      ...(additionalHeaders || {}),
    },
  })
}
