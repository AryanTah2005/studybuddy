import { UserButton } from '@clerk/nextjs';
import  Link  from 'next/link';

export const Navbar = () => {
  return (
    //stylise the navbar tailwind
    <nav className="p-4 ">
      <ul className="flex justify-end *:px-10">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/gallery">Gallery</Link>
        </li>
        <li>
        <UserButton />
        </li>
      </ul>
    </nav>
  );
}
