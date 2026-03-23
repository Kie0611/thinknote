export default function StatCard({ label, value, sub, subColor = 'text-emerald-500', icon }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 hover:shadow-md transition-shadow animate-fade-in">
      <div className="flex items-start justify-between mb-2">
        {icon && <span className="text-xl">{icon}</span>}
        <div className={`text-xs font-semibold uppercase tracking-wider ${icon ? 'text-right' : ''} text-zinc-400`}>
          {label}
        </div>
      </div>
      <div className="text-3xl font-bold text-zinc-800 mb-1">{value}</div>
      {sub && <div className={`text-xs font-medium ${subColor}`}>{sub}</div>}
    </div>
  )
}
