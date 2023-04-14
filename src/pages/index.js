// import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const Viewer = dynamic(
  () =>
    import('../components/Viewer'),
  { ssr: false }
)

export default function Home() {
  return (
    <main className="h-screen grid grid-cols-3 container mx-auto px-4">
      <div className="col-span-2">
        <Viewer elementId="viewer" iiifUrl="https://www.artic.edu/iiif/2/25c31d8d-21a4-9ea1-1d73-6a2eca4dda7e/info.json" />
      </div>
      <div className="">
        <h2>Other tags</h2>
      </div>
      <div className="col-span-3">
        <h2>Your journey</h2>
      </div>
    </main>
  )
}
