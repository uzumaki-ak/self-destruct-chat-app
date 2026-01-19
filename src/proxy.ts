import { NextRequest, NextResponse } from "next/server"
import { redis } from "./lib/redis"
import { nanoid } from "nanoid"

export const proxy = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname

  const roomMatch = pathname.match(/^\/room\/([^/]+)$/)
  if (!roomMatch) return NextResponse.redirect(new URL("/", req.url))

  const roomId = roomMatch[1]

  //to know who is allowed to conect to this roomo and who is not we neeed acces tio the meta data from redis
  const meta = await redis.hgetall<{ connected?: string[]; createdAt: number }>(
    `meta:${roomId}`
  )

  if (!meta) {
    return NextResponse.redirect(new URL("/?error=room-not-found", req.url))
  }

  // checking foe the existing toekn so when rrefreshed new id isnt created for the same user
  const existingToken = req.cookies.get("ats-1250-token")?.value

  const connected = meta.connected ?? []

  //user allowed t join room if token exists in connected list
  if (existingToken && connected.includes(existingToken)) {
    return NextResponse.next()
  }

  //if their id is not in tje existing val or the room is full thn not allowed
  if (connected.length >= 2) {
    return NextResponse.redirect(new URL("/?error=room-full", req.url))
  }

  // we dont implemet auth here but we use arbitiary toekn which we will sen d through the response to redis daabase to know whi is connected to hich room
  const response = NextResponse.next()
  const token = nanoid()

  response.cookies.set("ats-1250-token", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })

  //now marking user entry in database when connected to the room
  await redis.hset(`meta:${roomId}`, {
    connected: [...connected, token],
  })

  return response
}

//matcher function to match all routes starting with /room/
export const config = {
  matcher: "/room/:path*",
}
