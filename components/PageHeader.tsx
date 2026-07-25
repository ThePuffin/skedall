import AppLogo from '@/components/AppLogo';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

interface PageHeaderProps {
  rightElement?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function PageHeader({ rightElement, style }: Readonly<PageHeaderProps>) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 15px 5px 15px',
        ...(style as Record<string, unknown>),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <AppLogo />
      </View>
      {rightElement}
    </div>
  );
}
