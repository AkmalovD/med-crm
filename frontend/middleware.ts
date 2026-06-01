import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // читаем стор из localStorage через куку (zustand persist пишет в localStorage,
    // но middleware работает на сервере — проверяем наличие через cookie)
    const authRaw = request.cookies.get('auth')?.value
    const accessToken = authRaw
        ? JSON.parse(decodeURIComponent(authRaw))?.state?.accessToken
        : null

    const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r))

    if (!accessToken && !isPublic) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (accessToken && isPublic) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}