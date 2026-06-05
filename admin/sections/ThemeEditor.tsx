import React from 'react';
import { Palette } from 'lucide-react';
import { useContentContext } from '../../context/ContentContext';
import { ThemeColors } from '../../content/schema';
import { Card, SectionTitle, Field, TextInput, ColorInput, RangeInput } from '../ui';

const COLOR_FIELDS: { key: keyof ThemeColors; label: string }[] = [
  { key: 'background', label: 'Fond' },
  { key: 'surface', label: 'Surfaces (panneaux)' },
  { key: 'text', label: 'Texte' },
  { key: 'textMuted', label: 'Texte atténué' },
  { key: 'accent', label: 'Accent principal (menthe)' },
  { key: 'accentSoft', label: 'Accent doux' },
  { key: 'secondary', label: 'Secondaire (lavande)' },
  { key: 'tertiary', label: 'Tertiaire (pêche)' },
  { key: 'success', label: 'Succès' },
  { key: 'danger', label: 'Alerte' },
  { key: 'border', label: 'Bordures' },
];

export const ThemeEditor: React.FC = () => {
  const { content, update } = useContentContext();
  const t = content.theme;

  const setColor = (key: keyof ThemeColors, v: string) =>
    update((d) => {
      d.theme.colors[key] = v;
    });

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Thème & couleurs"
        subtitle="La palette pastel et la douceur de l’interface. Les changements s’appliquent en direct."
        icon={<Palette className="w-5 h-5" />}
      />

      <Card>
        <Field label="Nom du thème">
          <TextInput value={t.name} onChange={(v) => update((d) => { d.theme.name = v; })} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          {COLOR_FIELDS.map((f) => (
            <Field key={f.key} label={f.label}>
              <ColorInput value={t.colors[f.key]} onChange={(v) => setColor(f.key, v)} />
            </Field>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle title="Douceur" subtitle="Arrondis, flou de verre et halos." />
        <Field label={`Arrondi global (${t.radius}px)`}>
          <RangeInput value={t.radius} min={0} max={32} step={1} onChange={(v) => update((d) => { d.theme.radius = v; })} />
        </Field>
        <Field label={`Flou des panneaux (${t.glass})`}>
          <RangeInput value={t.glass} min={0} max={1} step={0.05} onChange={(v) => update((d) => { d.theme.glass = v; })} />
        </Field>
        <Field label={`Intensité des halos (${t.glowIntensity})`}>
          <RangeInput value={t.glowIntensity} min={0} max={1} step={0.05} onChange={(v) => update((d) => { d.theme.glowIntensity = v; })} />
        </Field>
      </Card>

      {/* Aperçu live */}
      <Card>
        <SectionTitle title="Aperçu" />
        <div
          className="rounded-2xl p-6 border"
          style={{ background: t.colors.background, borderColor: t.colors.border }}
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {(['accent', 'secondary', 'tertiary', 'success', 'danger'] as (keyof ThemeColors)[]).map((k) => (
              <span key={k} className="w-8 h-8 rounded-full border" style={{ background: t.colors[k], borderColor: t.colors.border }} />
            ))}
          </div>
          <div
            className="rounded-xl p-4 backdrop-blur-md"
            style={{ background: t.colors.surface, borderRadius: t.radius, border: `1px solid ${t.colors.border}` }}
          >
            <h3 className="font-bold" style={{ color: t.colors.text, fontFamily: 'Space Grotesk' }}>
              {content.meta.brandName}
            </h3>
            <p className="text-sm" style={{ color: t.colors.textMuted }}>{content.meta.tagline}</p>
            <button
              className="mt-3 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: t.colors.accent, color: t.colors.background }}
            >
              {content.ui.startCta}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
