import Link from "next/link";

export default function Home() {
  return (
    <div className='mx-8 my-8'>
      <h1 className='text-4xl font-bold'>Hello world!</h1>
      <Link href="/about">About</Link>
    </div>
  )
}
