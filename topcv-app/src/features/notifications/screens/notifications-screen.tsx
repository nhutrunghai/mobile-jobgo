import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@/src/components/ui/app-text';
import { bottomNavItems } from '@/src/features/home/data';
import { BottomNav } from '@/src/features/home/components/bottom-nav';
import { colors, radius, spacing } from '@/src/theme';

export function NotificationsScreen() {
  const navItems = bottomNavItems.map((item) => ({
    ...item,
    href:
      item.key === 'home'
        ? ('/(tabs)' as const)
        : item.key === 'notice'
          ? ('/(tabs)/explore' as const)
          : item.key === 'profile'
            ? ('/(tabs)/profile' as const)
          : undefined,
  }));

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backGhost} disabled>
          <Feather name="chevron-left" size={24} color="transparent" />
        </Pressable>
        <AppText variant="heading" style={styles.headerTitle}>
          Thông báo
        </AppText>
        <View style={styles.backGhost} />
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        <View style={styles.illustrationWrap}>
          <View style={styles.illustrationCore}>
            <View style={styles.documentCard}>
              <View style={styles.documentHeader}>
                <View style={styles.checkBadge}>
                  <Feather name="check-circle" size={24} color={colors.primary} />
                </View>
                <View style={styles.notificationBadge}>
                  <Feather name="bell" size={16} color="#F59E0B" />
                </View>
              </View>

              <View style={styles.documentLines}>
                <View style={[styles.documentLine, styles.lineWide]} />
                <View style={[styles.documentLine, styles.lineMedium]} />
                <View style={[styles.documentLine, styles.lineShort]} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.copyBlock}>
          <AppText variant="heading" style={styles.emptyTitle}>
            Bạn chưa có thông báo nào
          </AppText>
          <AppText variant="body" color={colors.textMuted} style={styles.emptyDescription}>
            Đừng lo, chúng tôi sẽ thông báo ngay khi có tin mới cho bạn. Hãy khám phá tính năng
            khác hoặc kiểm tra lại sau.
          </AppText>
        </View>
      </View>

      <BottomNav items={navItems} activeKey="notice" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 54,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    color: '#152238',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
  },
  backGhost: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(21, 34, 56, 0.08)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 88,
  },
  illustrationWrap: {
    width: 206,
    height: 206,
    borderRadius: radius.pill,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationCore: {
    width: 112,
    height: 112,
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  documentCard: {
    width: 68,
    height: 82,
    borderRadius: radius.md,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    paddingHorizontal: 10,
    paddingVertical: 12,
    position: 'relative',
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkBadge: {
    marginLeft: -4,
  },
  notificationBadge: {
    marginTop: -3,
    marginRight: -4,
  },
  documentLines: {
    gap: 7,
  },
  documentLine: {
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: '#D8D8D8',
  },
  lineWide: {
    width: 44,
  },
  lineMedium: {
    width: 34,
  },
  lineShort: {
    width: 24,
  },
  copyBlock: {
    alignItems: 'center',
    gap: spacing.md,
    marginTop: 40,
    maxWidth: 320,
  },
  emptyTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: '#152238',
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 28,
    maxWidth: 290,
  },
});
