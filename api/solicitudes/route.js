import { crearConeccion } from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const db = await crearConeccion();
        const query = "SELECT * FROM solicitudes";
        const [solicitudes] = await db.query(query);

        return NextResponse.json(solicitudes);
    }catch(error){
        console.log(error);
        return NextResponse.json({error: error.message});
    }
    
}