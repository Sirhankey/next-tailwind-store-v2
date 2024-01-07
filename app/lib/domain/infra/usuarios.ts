'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { sql } from '@vercel/postgres';
import { Usuario } from '../definicoes';

export async function login(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData).then(() => {
            localStorage.setItem('usuario', JSON.stringify(formData.get('email')));
        });
    } catch (error) {
        if (error instanceof AuthError) return 'Login ou senha inválidos.'
        throw error;
    }
}


export async function logout() {
    try {
        await signOut({ redirect: true });
    } catch (error) {
        throw error;
    }
}

export async function getUsuarioPorEmail(email: string): Promise<Usuario | undefined> {
    try {
        const usuario = await sql<Usuario>`SELECT * FROM usuarios WHERE email=${email}`;
        return usuario.rows[0];
    } catch (erro) {
        console.error('Erro na consulta de usuario:', erro);
        throw new Error('Erro na consulta de usuario.');
    }
}

export async function getUsuarios(): Promise<Usuario[] | undefined> {
    try {
        const usuarios = await sql`SELECT * FROM usuarios`;
        const usuariosList = usuarios.rows as Usuario[];
        return usuariosList;
    } catch (erro) {
        console.error('Erro na consulta de usuario:', erro);
        throw new Error('Erro na consulta de usuario.');
    }
}