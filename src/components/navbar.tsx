"use client";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export const Navbar = () => {
  const { user } = useUser();
  return (
    // stylise the navbar tailwind
    <nav className="p-4 ">
      <ul className="flex justify-end *:px-10">
        <li>
        </li>
      </ul>
    </nav>
  );
};
