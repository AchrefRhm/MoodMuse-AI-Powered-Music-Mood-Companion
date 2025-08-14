import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

interface GradientTextProps {
  children: React.ReactNode;
  colors: string[];
  style?: any;
}

export default function GradientText({ children, colors, style }: GradientTextProps) {
  return (
    <MaskedView
      style={[styles.container, style]}
      maskElement={
        <Text style={[styles.text, style]}>
          {children}
        </Text>
      }
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
  },
});