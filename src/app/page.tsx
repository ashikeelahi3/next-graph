import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <main className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Next Graph</h1>
          <p className="text-xl">Select a graph type from the navigation menu</p>
        </main>
      </div>
    </div>
  );
}
