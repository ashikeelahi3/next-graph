import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-800 text-white p-4">
      <div className="container mx-auto flex gap-6">
        <Link href="/" className="hover:text-gray-300">
          Home
        </Link>
        <Link href="/d3-graph" className="hover:text-gray-300">
          Graph with D3
        </Link>
        <Link href="/webr-graph" className="hover:text-gray-300">
          Graph with WebR
        </Link>
      </div>
    </nav>
  );
}