import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export const Navbar = () => {
  return (
    // stylise the navbar tailwind
    <nav className="p-4 ">
      <ul className="flex justify-end *:px-10">
        <li>
          <UserButton />
        </li>
      </ul>
    </nav>
  );
};
