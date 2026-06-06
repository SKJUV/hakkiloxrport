import React from 'react';
import { useContent } from '../context/ContentContext';
import { ImmersionStage } from './immersion/ImmersionStage';
import { ProductImmersion, CourseImmersion, ContactImmersion, SectionImmersion } from './immersion/bodies';

export type ImmersionTarget = { type: 'section' | 'product' | 'course'; id: string } | null;

interface Props {
  target: ImmersionTarget;
  originRect: DOMRect | null;
  onClose: () => void;
  onTeleport: (progress: number) => void;
  onToggleCart: (id: string) => void;
  isInCart: (id: string) => boolean;
  onPreview: (id: string) => void;
  currency: string;
}

export const ImmersionView: React.FC<Props> = ({
  target, originRect, onClose, onTeleport, onToggleCart, isInCart, onPreview, currency,
}) => {
  const content = useContent();
  const { theme } = content;
  const colors = theme.colors;

  if (!target) return null;

  let accent = colors.accent;
  let body: React.ReactNode = null;

  if (target.type === 'product') {
    const p = content.products.find((x) => x.id === target.id);
    if (p) {
      accent = colors.secondary;
      body = (
        <ProductImmersion product={p} allProducts={content.products} currency={currency} colors={colors} accent={accent} isInCart={isInCart(p.id)} onToggleCart={() => onToggleCart(p.id)} onPreview={() => onPreview(p.id)} />
      );
    }
  } else if (target.type === 'course') {
    const c = content.courses.find((x) => x.id === target.id);
    if (c) {
      accent = c.accent;
      body = <CourseImmersion course={c} currency={currency} colors={colors} accent={accent} />;
    }
  } else if (target.type === 'section') {
    const step = content.journey.find((s) => s.id === target.id);
    if (step) {
      accent = step.accent;
      if (step.key === 'contact') {
        body = <ContactImmersion contact={content.contact} colors={colors} accent={accent} />;
      } else {
        const related =
          step.key === 'shop' ? content.products : step.key === 'learn' ? content.courses : [];
        body = (
          <SectionImmersion
            step={step}
            related={related as any}
            colors={colors}
            accent={accent}
            brandName={content.meta.brandName}
            onTeleport={onTeleport}
            onClose={onClose}
          />
        );
      }
    }
  }

  if (!body) return null;

  return (
    <ImmersionStage
      originRect={originRect}
      accent={accent}
      borderColor={colors.border}
      radius={theme.radius}
      glass={theme.glass}
      onClose={onClose}
    >
      {body}
    </ImmersionStage>
  );
};
