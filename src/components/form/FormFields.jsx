/**
 * Reusable form field components for the admin panel.
 * Extracted from ManageContent.jsx to be shared across
 * all admin form pages (blogs, videos, services, content).
 */

export function TextField({ label, value, onChange, type = 'text' }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type={type} value={value ?? ''} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

export function TextArea({ label, value, onChange, rows = 4 }) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea rows={rows} value={value ?? ''} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ToggleField({ label, checked, onChange }) {
  return (
    <label className="inline-flex items-center gap-3 text-sm font-bold text-[var(--text)]">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-white/20 bg-white/10 text-amber-400"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}
