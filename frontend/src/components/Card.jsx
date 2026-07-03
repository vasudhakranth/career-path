export default function Card({ title, description, children, className = '' }) {
  return (
    <div className={`rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/20 ${className}`}>
      <h2 className="mb-3 text-xl font-semibold text-white">{title}</h2>
      <p className="mb-4 text-slate-400">{description}</p>
      {children}
    </div>
  )
}
