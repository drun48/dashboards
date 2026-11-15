import SignIn from "@/features/Auth/ui/SignInGithub";
import { ExampleGrid } from "@/widgets/ExampleGrid";

export default function Home() {
  return (
    <>
      <SignIn />
      <ExampleGrid />;
    </>
  );
}
