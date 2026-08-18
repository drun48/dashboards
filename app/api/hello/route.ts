// import type { NextApiRequest, NextApiResponse } from 'next'
 
// type ResponseData = {
//   message: string
// }
 
// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseData>
// ) {
//   res.status(200).json({ message: 'Hello from Next.js!' })
// }

export class UserController {
  async getUsers(req: Request): Promise<Response> {
    const users = [
      {
        id: 1,
        name: "John",
      },
      {
        id: 2,
        name: "Bob",
      },
    ];

    return Response.json(users);
  }
}

const userController = new UserController();

export async function GET(req: Request) {
  return userController.getUsers(req);
}