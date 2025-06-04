//create a middleware to check if the user is authenticated

import { NextRequest, NextResponse } from "next/server";
import { User } from "./store/authStore";
import { decodeToken } from "./lib/utils";

const UNAUTHENTICATED_ROUTES:string[] = ['/login', '/register']
const AUTHENTICATED_ROUTES:string[] = ['/profile']

export default function middleware(req: NextRequest) {
    const authToken = req.cookies.get('auth_token')?.value
    const decodedToken = decodeToken(authToken || '')

    if (!decodedToken) {
        req.cookies.delete('auth_token')
    }
    
    if (UNAUTHENTICATED_ROUTES.includes(req.nextUrl.pathname) && decodedToken) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (AUTHENTICATED_ROUTES.includes(req.nextUrl.pathname) && !decodedToken) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
}

export const config = {
    //create a matcher to check all routes.
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}