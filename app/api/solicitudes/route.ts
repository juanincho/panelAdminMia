import { NextResponse } from "next/server";

export async function GET() {
  try {
    let response = await fetch("http://localhost:3001/v1/mia/solicitud", {
      headers: {
        "x-api-key": API_KEY || "",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log(response);
    const data = await response.json();
    console.log(data);
    const nextResponse = NextResponse.json(data, { status: 200 });
    nextResponse.headers.set("Cache-Control", "no-store");
    return nextResponse;
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Error al obtener los datos" },
      { status: 500 }
    );
  }
}
