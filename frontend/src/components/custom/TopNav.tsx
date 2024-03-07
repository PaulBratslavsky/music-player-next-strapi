import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/custom/Logo";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { LogoutButton } from "./LogoutButton";

export async function TopNav() {
  const user = await getUserMeLoader();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md dark:bg-gray-800">
      <Logo />
      <div className="flex items-center gap-4">
        {user.ok 
          ? <LogoutButton /> 
          : <Link href="/signin"><Button>Sign In</Button></Link>
        }
      </div>
    </div>
  );
}
