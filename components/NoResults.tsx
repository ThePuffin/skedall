import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { translateWord } from '@/utils/utils';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native';

export default function NoResults({ onRetry }: { onRetry?: () => void }) {
  const hasRetried = useRef(false);

  useEffect(() => {
    if (onRetry && !hasRetried.current) {
      onRetry();
      hasRetried.current = true;
    }
  }, [onRetry]);

  const handleManualRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <ThemedView
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginVertical: 40,
      }}
    >
      <ThemedText
        style={{
          fontSize: 16,
          textAlign: 'center',
          opacity: 0.6,
          fontStyle: 'italic',
          fontWeight: 'bold',
        }}
      >
        {translateWord('noResults')}
      </ThemedText>
      <TouchableOpacity onPress={handleManualRetry} style={{ marginTop: 20, padding: 10 }} activeOpacity={0.6}>
        <Ionicons name="refresh-outline" size={30} color="gray" />
      </TouchableOpacity>
    </ThemedView>
  );
}
