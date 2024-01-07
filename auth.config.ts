import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    providers: [],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLogged = !!auth?.user;
            const isProtected = nextUrl.pathname.startsWith("/protected");
            if (isProtected) {
                if (isLogged) return true;
                return false;
            } else if (isLogged) {
                return Response.redirect(new URL('/protected', nextUrl))
            }
            return true;
        },
    },
} satisfies NextAuthConfig;