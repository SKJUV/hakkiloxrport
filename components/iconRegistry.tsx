import React from 'react';
import {
  DoorOpen,
  ShoppingBag,
  ShoppingCart,
  GraduationCap,
  Radar,
  Headset,
  Glasses,
  Boxes,
  Eye,
  Gauge,
  BatteryCharging,
  Feather,
  Wifi,
  Cpu,
  Activity,
  BookOpen,
  Building2,
  Sparkles,
  Box,
  CircleDot,
} from 'lucide-react';

/** Mappe un nom d'icône (stocké dans le CMS) vers le composant lucide correspondant. */
const REGISTRY: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  DoorOpen,
  ShoppingBag,
  ShoppingCart,
  GraduationCap,
  Radar,
  Headset,
  Glasses,
  Boxes,
  Eye,
  Gauge,
  BatteryCharging,
  Feather,
  Wifi,
  Cpu,
  Activity,
  BookOpen,
  Building2,
  Sparkles,
  Box,
  CircleDot,
};

export const Icon: React.FC<{ name: string; className?: string; style?: React.CSSProperties }> = ({
  name,
  className,
  style,
}) => {
  const Cmp = REGISTRY[name] || CircleDot;
  return <Cmp className={className} style={style} />;
};

export const ICON_NAMES = Object.keys(REGISTRY);
