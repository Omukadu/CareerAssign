export default function ProgressBar({ value = 0, color = 'bg-brand-600' }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${v}%` }} />
    </div>
  );
}
