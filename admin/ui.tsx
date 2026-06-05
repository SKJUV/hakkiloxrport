import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div
    className={`rounded-2xl border p-5 backdrop-blur-md ${className || ''}`}
    style={{ background: 'var(--ar-surface)', borderColor: 'var(--ar-border)' }}
  >
    {children}
  </div>
);

export const SectionTitle: React.FC<{ title: string; subtitle?: string; icon?: React.ReactNode }> = ({
  title,
  subtitle,
  icon,
}) => (
  <div className="mb-5 flex items-start gap-3">
    {icon && (
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--ar-accent)', color: 'var(--ar-bg)' }}
      >
        {icon}
      </div>
    )}
    <div>
      <h2 className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk' }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm" style={{ color: 'var(--ar-text-muted)' }}>
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

export const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({
  label,
  hint,
  children,
}) => (
  <label className="block mb-4">
    <span className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ar-text-muted)' }}>
      {label}
    </span>
    {children}
    {hint && (
      <span className="block text-[11px] mt-1" style={{ color: 'var(--ar-text-muted)' }}>
        {hint}
      </span>
    )}
  </label>
);

const inputStyle: React.CSSProperties = {
  background: 'rgba(0,0,0,0.22)',
  borderColor: 'var(--ar-border)',
  color: 'var(--ar-text)',
};

export const TextInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border focus:border-[var(--ar-accent)] transition-colors"
    style={inputStyle}
  />
);

export const TextArea: React.FC<{
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}> = ({ value, onChange, rows = 3, placeholder }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    rows={rows}
    placeholder={placeholder}
    className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border focus:border-[var(--ar-accent)] transition-colors resize-y"
    style={inputStyle}
  />
);

export const ColorInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  // Le picker natif n'accepte que #rrggbb : on tolère les rgba() via un champ texte à côté.
  const hex = /^#([0-9a-f]{6})$/i.test(value) ? value : '#888888';
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={hex}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-lg border cursor-pointer bg-transparent p-0.5"
        style={{ borderColor: 'var(--ar-border)' }}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded-xl px-3 py-2 text-xs font-mono outline-none border focus:border-[var(--ar-accent)]"
        style={inputStyle}
      />
    </div>
  );
};

export const RangeInput: React.FC<{
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}> = ({ value, min, max, step, onChange }) => (
  <div className="flex items-center gap-3">
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="flex-1 accent-[var(--ar-accent)]"
    />
    <span className="text-xs font-mono w-12 text-right" style={{ color: 'var(--ar-text-muted)' }}>
      {value}
    </span>
  </div>
);
