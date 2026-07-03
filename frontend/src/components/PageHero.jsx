export default function PageHero({ caption = '', className = '' }) {
  return (
    <div className={`group relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/80 p-1 shadow-lg shadow-black/20 ${className}`}>
      <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-950 transition duration-500 ease-out before:absolute before:inset-0 before:bg-gradient-to-br before:from-violet-500/20 before:via-cyan-500/15 before:to-fuchsia-500/20 before:opacity-0 before:transition before:duration-500 group-hover:before:opacity-100" />
      {caption ? <p className="mt-4 text-sm text-slate-400">{caption}</p> : null}
    </div>
  )
}

