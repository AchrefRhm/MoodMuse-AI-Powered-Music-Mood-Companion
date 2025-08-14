import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Heart, ChartBar as BarChart3, Bell, Moon, Volume2, Shield, CircleHelp as HelpCircle, LogOut, Crown, Palette, Brain } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { SPACING, FONT_SIZE } from '@/constants/spacing';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  const scaleAnimation = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }]
  }));

  const handleSettingPress = (callback?: () => void) => {
    scaleAnimation.value = withSpring(0.98, {}, () => {
      scaleAnimation.value = withSpring(1);
      callback?.();
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <LinearGradient
        colors={[COLORS.neutral[50], COLORS.neutral[100]]}
        style={styles.backgroundGradient}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={[COLORS.primary[500], COLORS.secondary[500]]}
            style={styles.avatarGradient}
          >
            <User size={32} color="#ffffff" />
          </LinearGradient>
          
          <Text style={styles.userName}>Music Lover</Text>
          <Text style={styles.userEmail}>user@moodmuse.com</Text>
          
          <TouchableOpacity style={styles.premiumBadge}>
            <Crown size={16} color={COLORS.warning[600]} />
            <Text style={styles.premiumText}>Premium</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <BarChart3 size={24} color={COLORS.primary[600]} />
            <Text style={styles.statNumber}>47</Text>
            <Text style={styles.statLabel}>Playlists Created</Text>
          </View>
          
          <View style={styles.statCard}>
            <Heart size={24} color={COLORS.accent[600]} />
            <Text style={styles.statNumber}>128</Text>
            <Text style={styles.statLabel}>Songs Loved</Text>
          </View>
          
          <View style={styles.statCard}>
            <Brain size={24} color={COLORS.success[600]} />
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>Moods Tracked</Text>
          </View>
        </View>

        {/* Settings Sections */}
        <View style={styles.settingsContainer}>
          {/* Personalization */}
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Personalization</Text>
            
            <Animated.View style={animatedStyle}>
              <SettingItem
                icon={<Palette size={20} color={COLORS.secondary[600]} />}
                title="Theme Preferences"
                subtitle="Customize your visual experience"
                onPress={() => handleSettingPress()}
                showArrow
              />
            </Animated.View>
            
            <SettingItem
              icon={<Brain size={20} color={COLORS.primary[600]} />}
              title="AI Learning"
              subtitle="Help improve mood detection accuracy"
              onPress={() => handleSettingPress()}
              showArrow
            />
          </View>

          {/* App Settings */}
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>App Settings</Text>
            
            <SettingItem
              icon={<Bell size={20} color={COLORS.warning[600]} />}
              title="Notifications"
              subtitle="Daily mood check reminders"
              onPress={() => handleSettingPress(() => setNotifications(!notifications))}
              rightComponent={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: COLORS.neutral[300], true: COLORS.primary[300] }}
                  thumbColor={notifications ? COLORS.primary[600] : COLORS.neutral[500]}
                />
              }
            />
            
            <SettingItem
              icon={<Moon size={20} color={COLORS.neutral[700]} />}
              title="Dark Mode"
              subtitle="Switch to dark theme"
              onPress={() => handleSettingPress(() => setDarkMode(!darkMode))}
              rightComponent={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: COLORS.neutral[300], true: COLORS.primary[300] }}
                  thumbColor={darkMode ? COLORS.primary[600] : COLORS.neutral[500]}
                />
              }
            />
            
            <SettingItem
              icon={<Volume2 size={20} color={COLORS.success[600]} />}
              title="Sound Effects"
              subtitle="Enable app sounds and haptics"
              onPress={() => handleSettingPress(() => setSoundEffects(!soundEffects))}
              rightComponent={
                <Switch
                  value={soundEffects}
                  onValueChange={setSoundEffects}
                  trackColor={{ false: COLORS.neutral[300], true: COLORS.primary[300] }}
                  thumbColor={soundEffects ? COLORS.primary[600] : COLORS.neutral[500]}
                />
              }
            />
          </View>

          {/* Support & Info */}
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Support & Info</Text>
            
            <SettingItem
              icon={<Shield size={20} color={COLORS.neutral[600]} />}
              title="Privacy Policy"
              subtitle="How we protect your data"
              onPress={() => handleSettingPress()}
              showArrow
            />
            
            <SettingItem
              icon={<HelpCircle size={20} color={COLORS.neutral[600]} />}
              title="Help & Support"
              subtitle="Get help with MoodMuse"
              onPress={() => handleSettingPress()}
              showArrow
            />
            
            <SettingItem
              icon={<LogOut size={20} color={COLORS.error[600]} />}
              title="Sign Out"
              subtitle="Sign out of your account"
              onPress={() => handleSettingPress()}
              showArrow
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function SettingItem({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  rightComponent, 
  showArrow = false 
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  rightComponent?: React.ReactNode;
  showArrow?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>{icon}</View>
      
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      
      {rightComponent || (showArrow && (
        <Settings size={16} color={COLORS.neutral[400]} />
      ))}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  userName: {
    fontSize: FONT_SIZE['2xl'],
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONT_SIZE.base,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[600],
    marginBottom: SPACING.md,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning[100],
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  premiumText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.warning[600],
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: FONT_SIZE['2xl'],
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[600],
    textAlign: 'center',
  },
  settingsContainer: {
    paddingHorizontal: SPACING.lg,
  },
  settingsSection: {
    marginBottom: SPACING.xl,
  },
  settingsSectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIcon: {
    marginRight: SPACING.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FONT_SIZE.base,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[900],
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[600],
    lineHeight: 18,
  },
});