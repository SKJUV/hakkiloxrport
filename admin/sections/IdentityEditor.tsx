import React from 'react';
import { Type } from 'lucide-react';
import { useContentContext } from '../../context/ContentContext';
import { Card, SectionTitle, Field, TextInput, TextArea } from '../ui';

export const IdentityEditor: React.FC = () => {
  const { content, update } = useContentContext();

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Identité & textes globaux"
        subtitle="Nom de marque, accroche, SEO et libellés de l’interface."
        icon={<Type className="w-5 h-5" />}
      />

      <Card>
        <Field label="Nom de la marque">
          <TextInput value={content.meta.brandName} onChange={(v) => update((d) => { d.meta.brandName = v; })} />
        </Field>
        <Field label="Accroche">
          <TextInput value={content.meta.tagline} onChange={(v) => update((d) => { d.meta.tagline = v; })} />
        </Field>
      </Card>

      <Card>
        <SectionTitle title="Référencement (SEO)" />
        <Field label="Titre de la page (onglet)">
          <TextInput value={content.meta.seoTitle} onChange={(v) => update((d) => { d.meta.seoTitle = v; })} />
        </Field>
        <Field label="Description SEO">
          <TextArea value={content.meta.seoDescription} onChange={(v) => update((d) => { d.meta.seoDescription = v; })} />
        </Field>
      </Card>

      <Card>
        <SectionTitle title="Libellés de l’interface" />
        <Field label="Bouton de démarrage">
          <TextInput value={content.ui.startCta} onChange={(v) => update((d) => { d.ui.startCta = v; })} />
        </Field>
        <Field label="Indice de défilement">
          <TextInput value={content.ui.scrollHint} onChange={(v) => update((d) => { d.ui.scrollHint = v; })} />
        </Field>
        <Field label="Indice d’immersion (clic)">
          <TextInput value={content.ui.immersionHint} onChange={(v) => update((d) => { d.ui.immersionHint = v; })} />
        </Field>
        <Field label="Libellé « Mode libre »">
          <TextInput value={content.ui.freeFlightLabel} onChange={(v) => update((d) => { d.ui.freeFlightLabel = v; })} />
        </Field>
        <Field label="Libellé du compas">
          <TextInput value={content.ui.compassLabel} onChange={(v) => update((d) => { d.ui.compassLabel = v; })} />
        </Field>
      </Card>

      <Card>
        <SectionTitle title="Sécurité du back-office" />
        <Field label="Mot de passe admin" hint="Mot de passe simple (client). Une vraie authentification arrivera avec le backend (Phase 5).">
          <TextInput value={content.admin.passphrase} onChange={(v) => update((d) => { d.admin.passphrase = v; })} />
        </Field>
      </Card>
    </div>
  );
};
