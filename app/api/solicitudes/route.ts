export async function GET(req: Request): Promise<Response> {
  try {
    const response = await fetch("http://localhost:3001/v1/mia/solicitud", {
      headers: {
        "x-api-key": API_KEY,
      },
    });
    const json = await response.json();
    return new Response(JSON.stringify(json), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        message:
          "Puede ocurrir un accidente a la hora de manejar la conexión, revisa los logs del servidos",
      }),
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}

const API_KEY: string =
  "nkt-U9TdZU63UENrblg1WI9I1Ln9NcGrOyaCANcpoS2PJT3BlbkFJ1KW2NIGUYF87cuvgUF3Q976fv4fPrnWQroZf0RzXTZTA942H3AMTKFKJHV6cTi8c6dd6tybUD65fybhPJT3BlbkFJ1KW2NIGPrnWQroZf0RzXTZTA942H3AMTKFy15whckAGSSRSTDvsvfHsrtbXhdrT";
