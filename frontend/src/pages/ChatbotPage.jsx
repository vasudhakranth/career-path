import PageHero from '../components/PageHero'


export default function ChatbotPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
        <h1 className="text-3xl font-bold text-white">AI Career Mentor</h1>
        <p className="mt-3 text-slate-400">This placeholder page will become a chatbot for career advice, role guidance, and job readiness tips.</p>
      </section>
      <PageHero caption="Future AI mentor conversation will appear here." />


      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="mb-6 rounded-3xl bg-slate-950/90 p-6 text-slate-300">
          <p>Future AI questions:</p>
          <ul className="mt-4 space-y-2 text-slate-400">
            <li>• Which role suits me?</li>
            <li>• What should I learn next?</li>
            <li>• Am I job-ready?</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
          <p className="text-slate-400">Chat UI placeholder</p>
          <div className="mt-6 rounded-3xl bg-slate-950/90 p-4 text-slate-300">AI mentor conversation will appear here.</div>
        </div>
      </div>
    </div>
  )
}
