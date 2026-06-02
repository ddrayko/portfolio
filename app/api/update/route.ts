import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'

export async function GET() {
  const scriptPath = join(process.cwd(), 'public', 'update.sh')
  const script = readFileSync(scriptPath, 'utf-8')

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/x-sh',
      'Content-Disposition': 'attachment; filename="update.sh"',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
