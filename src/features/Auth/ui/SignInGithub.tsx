import { signIn, auth } from "../../../../server/auth";

export default async function SignIn() {
  const session = await auth();
  return (
    !session?.user && (
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <button type="submit">Signin with GitHub</button>
      </form>
    )
  );
}
