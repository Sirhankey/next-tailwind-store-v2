import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET(request: Request) {
    try {
        let hashedPassword = await bcrypt.hash("password", 10);
        let result = await sql`
    INSERT INTO usuarios (nome, email, senha, roles) 
    VALUES ('Daniel', 'email@email.com', ${hashedPassword}, 'admin')
    ON CONFLICT (id) DO NOTHING;
    `;

        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
