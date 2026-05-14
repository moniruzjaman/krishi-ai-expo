import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { BRAND } from '../constants';

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps { label: string; color?: string; bg?: string }
export const Badge: React.FC<BadgeProps> = ({ label, color = BRAND.primary, bg = '#ecfdf5' }) => (
  <View style={[styles.badge, { backgroundColor: bg }]}>
    <Text style={[styles.badgeText, { color }]}>{label}</Text>
  </View>
);

// ─── Section Header ───────────────────────────────────────────────────────────
interface SectionHeaderProps { title: string; action?: string; onAction?: () => void }
export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action, onAction }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action && onAction && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.sectionAction}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Card ────────────────────────────────────────────────────────────────────
interface CardProps { children: React.ReactNode; style?: ViewStyle; onPress?: () => void }
export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  if (onPress) {
    return (
      <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.85}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
};

// ─── Primary Button ───────────────────────────────────────────────────────────
interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
  color?: string;
  style?: ViewStyle;
}
export const Button: React.FC<ButtonProps> = ({
  label, onPress, disabled, loading, variant = 'primary', color = BRAND.primary, style,
}) => {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        isPrimary && { backgroundColor: color },
        isOutline && { borderWidth: 1.5, borderColor: color, backgroundColor: 'transparent' },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        (disabled || loading) && styles.buttonDisabled,
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={isPrimary ? '#fff' : color} size="small" />
        : <Text style={[styles.buttonText, !isPrimary && { color }]}>{label}</Text>}
    </TouchableOpacity>
  );
};

// ─── Info Row ─────────────────────────────────────────────────────────────────
interface InfoRowProps { icon: string; label: string; style?: TextStyle }
export const InfoRow: React.FC<InfoRowProps> = ({ icon, label, style }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <Text style={[styles.infoLabel, style]}>{label}</Text>
  </View>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
interface EmptyProps { icon?: string; title: string; subtitle?: string }
export const EmptyState: React.FC<EmptyProps> = ({ icon = '🌱', title, subtitle }) => (
  <View style={styles.empty}>
    <Text style={styles.emptyIcon}>{icon}</Text>
    <Text style={styles.emptyTitle}>{title}</Text>
    {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
  </View>
);

// ─── Trend Icon ───────────────────────────────────────────────────────────────
export const TrendBadge: React.FC<{ trend: string; change: string }> = ({ trend, change }) => {
  const color = trend === 'up' ? '#ef4444' : trend === 'down' ? '#22c55e' : '#94a3b8';
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  return (
    <View style={[styles.trendBadge, { backgroundColor: color + '18' }]}>
      <Text style={[styles.trendText, { color }]}>{arrow} {change}</Text>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  badgeText: { fontSize: 10, fontWeight: '700' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: BRAND.text },
  sectionAction: { fontSize: 12, fontWeight: '700', color: BRAND.primary },

  card: {
    backgroundColor: BRAND.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: BRAND.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  button: {
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  buttonDisabled: { opacity: 0.5 },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  infoIcon: { fontSize: 14 },
  infoLabel: { fontSize: 13, color: BRAND.textMuted },

  empty: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: BRAND.text },
  emptySubtitle: { fontSize: 13, color: BRAND.textMuted, textAlign: 'center' },

  trendBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  trendText: { fontSize: 11, fontWeight: '700' },
});
