export default function ProgressBar({ value, label }) {
  return (
    <div className="progress-wrap">
      <div className="progress-track">
        <span style={{ width: `${value}%` }} />
      </div>
      {label && <span className="progress-label">{label}</span>}
    </div>
  );
}
