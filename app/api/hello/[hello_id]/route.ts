type Params = {
  params: Promise<{
    hello_id: string;
  }>;
};

export async function GET(
  req: Request,
  { params }: Params,
) {
  const { hello_id } = await params;
  console.log("hello_id", hello_id);
  return Response.json({ message: "Hello from the API dynamically!" });
}
