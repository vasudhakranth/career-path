import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'


export default function NotFoundPage() {
  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-12 text-center">
      <h1 className="text-5xl font-black text-white">404</h1>
      <p className="mt-4 text-xl text-slate-300">Page not found.</p>
      <PageHero caption="The page you looked for doesn’t exist yet." />

      <Link to="/" className="mt-8 inline-flex rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-400">
        Back to Home
      </Link>
    </div>
  )
}
