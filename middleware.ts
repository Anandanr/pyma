// CORS is now handled by corsResponse utility in route handlers
// Middleware-based CORS was unreliable on Vercel; using Response.json() with headers instead

import { type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Middleware disabled - CORS handled by corsResponse utility in each route handler
  return undefined
}
