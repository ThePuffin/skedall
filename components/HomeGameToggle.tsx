import { translateWord } from '@/utils/utils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, StyleSheet, Switch, View, ViewStyle } from 'react-native';

interface HomeGameToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

export default function HomeGameToggle({ value, onValueChange, style }: HomeGameToggleProps) {
  const helperText = translateWord('scoreView');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...StyleSheet.flatten(style),
      }}
      title={helperText}
    >
      <View style={{ opacity: value ? 0.3 : 1 }}>
        <p style={{ fontSize: 20, color: 'gray' }}>{translateWord('all')}</p>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
        style={{ marginHorizontal: 10 }}
      />
      <View style={{ opacity: value ? 1 : 0.3 }}>
        <Ionicons name="home" size={20} color="gray" />
      </View>
    </div>
  );
}
