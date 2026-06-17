// =============================================
// PriceTable — Scrollable commodity breakdown
// Replaces the HTML <table> from the web version
// =============================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../theme';

function formatPrice(value) {
  if (!value && value !== 0) return '—';
  return '₹' + Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

function TableRow({ row, isLast }) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.rowTop}>
        <Text style={styles.commodity} numberOfLines={1}>{row.commodity}</Text>
        <Text style={styles.state} numberOfLines={1}>{row.state}</Text>
      </View>
      <Text style={styles.market} numberOfLines={1}>📍 {row.market}</Text>
      <View style={styles.priceRow}>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Min</Text>
          <Text style={[styles.priceValue, { color: COLORS.greenMid }]}>
            {formatPrice(row.minPrice)}
          </Text>
        </View>
        <View style={styles.priceDivider} />
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Max</Text>
          <Text style={[styles.priceValue, { color: COLORS.amber }]}>
            {formatPrice(row.maxPrice)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function PriceTable({ records }) {
  if (!records || records.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Commodity Breakdown</Text>
      <View style={styles.tableCard}>
        {records.map((row, index) => (
          <TableRow
            key={`${row.commodity}-${row.market}-${index}`}
            row={row}
            isLast={index === records.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.greenDeep,
    marginBottom: SPACING.md,
  },
  tableCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  row: {
    padding: SPACING.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.wheatDark,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commodity: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    flex: 1,
  },
  state: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textLight,
    marginLeft: SPACING.sm,
    backgroundColor: COLORS.wheat,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  market: {
    fontSize: 13,
    color: COLORS.textMid,
    marginBottom: SPACING.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F7F0',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
  },
  priceItem: {
    flex: 1,
    alignItems: 'center',
  },
  priceDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.wheatDark,
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: COLORS.textLight,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
  },
});
