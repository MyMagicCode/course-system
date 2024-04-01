export async function GET() {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const data = await res.json();
  console.log("data", data);
  return Response.json(data);
}
