import { useFavoriteColor } from '@/hooks/useFavoriteColor';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export type HomeGameFilter = 'all' | 'home' | 'away';

interface HomeGameToggleProps {
  value: HomeGameFilter;
  onValueChange: (value: HomeGameFilter) => void;
  style?: StyleProp<ViewStyle>;
}

export default function HomeGameToggle({ value, onValueChange, style }: Readonly<HomeGameToggleProps>) {
  const unselectedBackgroundColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'background');
  const { backgroundColor: selectedBackgroundColor, textColor: selectedTextColor } = useFavoriteColor('#3b82f6');
  const themeTextColor = useThemeColor({}, 'text');

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: unselectedBackgroundColor,
          borderRadius: 20,
          overflow: 'hidden',
        },
        StyleSheet.flatten(style),
      ]}
    >
      {/* Home (left rounded) */}
      <Pressable
        onPress={() => onValueChange('home')}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          backgroundColor: value === 'home' ? selectedBackgroundColor : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 50,
        }}
      >
        <Ionicons name="home" size={18} color={value === 'home' ? selectedTextColor : themeTextColor} />
      </Pressable>

      {/* All (no radius) */}
      <Pressable
        onPress={() => onValueChange('all')}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: value === 'all' ? selectedBackgroundColor : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 50,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <Ionicons name="swap-horizontal" size={18} color={value === 'all' ? selectedTextColor : themeTextColor} />
        </View>
      </Pressable>

      {/* Away (right rounded) */}
      <Pressable
        onPress={() => onValueChange('away')}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          backgroundColor: value === 'away' ? selectedBackgroundColor : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 50,
        }}
      >
        <Ionicons name="airplane" size={18} color={value === 'away' ? selectedTextColor : themeTextColor} />
      </Pressable>
    </View>
  );
}
