import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ brightness: 'dark' })
  }

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'PortfolioBot/1.0' },
    })
    if (!response.ok) {
      return NextResponse.json({ brightness: 'dark' })
    }

    const input = Buffer.from(await response.arrayBuffer())
    const { data } = await sharp(input)
      .resize(1, 1, { fit: 'cover' })
      .raw()
      .toBuffer({ resolveWithObject: true })

    const r = data[0]
    const g = data[1]
    const b = data[2]
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b

    return NextResponse.json({ brightness: brightness > 128 ? 'light' : 'dark' })
  } catch {
    return NextResponse.json({ brightness: 'dark' })
  }
}

export const runtime = 'nodejs'
