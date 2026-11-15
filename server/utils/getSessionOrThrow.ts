import { auth } from "../auth";
import { ApiError } from "./ApiError";

export const getSessionOrThrow = async () => {
    const session = await auth();
    if (!session?.user?.id) {
        throw new ApiError({
            statusCode: 401,
            message: "Необходима авторизация",
        });
    }

    return { ...session, idUser: session.user.id };
}