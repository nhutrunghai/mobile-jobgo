import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { AppText } from '@/src/components/ui/app-text';
import { bottomNavItems } from '@/src/features/home/data';
import { BottomNav } from '@/src/features/home/components/bottom-nav';
import {
  accountSettings,
  appVersion,
  cvActions,
  jobManagementItems,
  profileHeader,
  profileToggles,
  supportItems,
} from '@/src/features/profile/data';
import { colors, radius, spacing } from '@/src/theme';

type SettingRowProps = {
  title: string;
  icon?: keyof typeof Feather.glyphMap;
  destructive?: boolean;
};

function SettingRow({ title, icon, destructive }: SettingRowProps) {
  const textColor = destructive ? '#FF4D4F' : colors.text;
  const iconColor = destructive ? '#FF4D4F' : '#748197';

  return (
    <Pressable style={styles.settingRow}>
      <View style={styles.settingLeft}>
        {icon ? <Feather name={icon} size={19} color={iconColor} /> : null}
        <AppText variant="body" color={textColor} style={styles.settingText}>
          {title}
        </AppText>
      </View>
      <Feather name="chevron-right" size={20} color="#A0AEC0" />
    </Pressable>
  );
}

export function ProfileScreen() {
  const [jobSearchEnabled, setJobSearchEnabled] = useState<boolean>(profileToggles[0].enabled);
  const [allowContactEnabled, setAllowContactEnabled] = useState<boolean>(profileToggles[1].enabled);

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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroHeader}>
            <View style={styles.profileIdentity}>
              <View style={styles.avatarWrap}>
                <Image source={{ uri: profileHeader.avatar }} style={styles.avatar} contentFit="cover" />
              </View>
              <View style={styles.identityText}>
                <AppText variant="heading" style={styles.name}>
                  {profileHeader.name}
                </AppText>
                <AppText variant="body" color="rgba(255,255,255,0.82)">
                  ID: {profileHeader.candidateId}
                </AppText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.panel}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <View style={styles.toggleIconWrap}>
                  <Feather name={profileToggles[0].icon} size={18} color={colors.primary} />
                </View>
                <AppText variant="bodyStrong" style={styles.toggleLabel}>
                  {profileToggles[0].title}
                </AppText>
              </View>
              <Switch
                value={jobSearchEnabled}
                onValueChange={setJobSearchEnabled}
                trackColor={{ false: '#DDE4F0', true: colors.primary }}
                thumbColor={colors.white}
                ios_backgroundColor="#DDE4F0"
              />
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <View style={styles.toggleIconWrap}>
                  <Feather name={profileToggles[1].icon} size={18} color={colors.primary} />
                </View>
                <AppText variant="bodyStrong" style={styles.toggleLabel}>
                  {profileToggles[1].title}
                </AppText>
              </View>
              <Switch
                value={allowContactEnabled}
                onValueChange={setAllowContactEnabled}
                trackColor={{ false: '#DDE4F0', true: colors.primary }}
                thumbColor={colors.white}
                ios_backgroundColor="#DDE4F0"
              />
            </View>
          </View>

          <View style={styles.panel}>
            <AppText variant="bodyStrong" style={styles.sectionTitle}>
              CV của tôi
            </AppText>
            <View style={styles.cvActionRow}>
              {cvActions.map((item, index) => (
                <View
                  key={item.key}
                  style={[styles.cvActionItem, index < cvActions.length - 1 ? styles.cvDivider : null]}>
                  <Feather name={item.icon} size={18} color={colors.primary} />
                  <AppText variant="caption" style={styles.cvActionLabel}>
                    {item.title}
                  </AppText>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.managementGrid}>
            {jobManagementItems.map((item) => (
              <Pressable key={item.key} style={styles.managementCard}>
                <Feather name={item.icon} size={24} color={colors.primary} />
                <AppText variant="body" style={styles.managementLabel}>
                  {item.title}
                </AppText>
              </Pressable>
            ))}
          </View>

          <View style={styles.banner}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerIcon}>
                <Feather name="map-pin" size={20} color={colors.white} />
              </View>
              <View style={styles.bannerTextWrap}>
                <AppText variant="bodyStrong" color={colors.white}>
                  Khám phá việc làm gần bạn
                </AppText>
                <AppText variant="caption" color="rgba(255,255,255,0.82)">
                  Nhận gợi ý việc làm phù hợp
                </AppText>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={colors.white} />
          </View>

          <View style={styles.listBlock}>
            {accountSettings.map((item, index) => (
              <View key={item.key}>
                <SettingRow title={item.title} icon={item.icon} destructive={item.destructive} />
                {index < accountSettings.length - 1 ? <View style={styles.listDivider} /> : null}
              </View>
            ))}
          </View>

          <View style={styles.listBlock}>
            {supportItems.map((item, index) => (
              <View key={item.key}>
                <SettingRow title={item.title} />
                {index < supportItems.length - 1 ? <View style={styles.listDivider} /> : null}
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <AppText variant="caption" color="#A0AEC0">
              {appVersion}
            </AppText>
            <Pressable style={styles.logoutButton}>
              <Feather name="log-out" size={18} color="#FF4D4F" />
              <AppText variant="bodyStrong" color="#FF4D4F">
                Đăng xuất
              </AppText>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <BottomNav items={navItems} activeKey="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F3F2',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  hero: {
    backgroundColor: colors.primary,
    paddingTop: 42,
    paddingHorizontal: spacing.lg,
    paddingBottom: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroHeader: {
    alignItems: 'flex-start',
  },
  profileIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.white,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  identityText: {
    flex: 1,
  },
  name: {
    color: colors.white,
    fontSize: 18,
    lineHeight: 24,
  },
  body: {
    marginTop: -36,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  toggleIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleLabel: {
    flex: 1,
    color: colors.text,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#EDF1EE',
    marginVertical: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    marginBottom: spacing.lg,
  },
  cvActionRow: {
    flexDirection: 'row',
  },
  cvActionItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 64,
    paddingHorizontal: spacing.xs,
  },
  cvDivider: {
    borderRightWidth: 1,
    borderRightColor: '#EDF1EE',
  },
  cvActionLabel: {
    textAlign: 'center',
    color: colors.text,
  },
  managementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  managementCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    minHeight: 90,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    shadowColor: colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  managementLabel: {
    color: colors.text,
    textAlign: 'center',
  },
  banner: {
    backgroundColor: colors.primary,
    minHeight: 56,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  bannerIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextWrap: {
    flex: 1,
  },
  listBlock: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  settingRow: {
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  listDivider: {
    height: 1,
    backgroundColor: '#EDF1EE',
    marginLeft: spacing.lg,
  },
  footer: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
