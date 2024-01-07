import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { z } from 'zod';
import { authConfig } from "./auth.config";
import { getUsuarioPorEmail } from "./app/lib/domain/infra/usuarios";

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string(), senha: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, senha } = parsedCredentials.data;
                    const usuario = await getUsuarioPorEmail(email);
                    if (!usuario) return null;

                    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
                    if (senhaCorreta) return usuario;
                }

                console.log('Credenciais inválidas: ');
                return null;
            }
        })
    ]
});