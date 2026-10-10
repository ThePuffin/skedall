import FavModal from '@/components/FavModal';
import { getCache, saveCache } from '@/utils/fetchData';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconSymbol } from './ui/IconSymbol';

interface ActionButtonProps {
  scrollViewRef: React.RefObject<ScrollView>;
}

export interface ActionButtonRef {
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  openFavModal: () => void;
}

const ActionButtonWithRef: React.ForwardRefRenderFunction<ActionButtonRef, ActionButtonProps> = (
  { scrollViewRef },
  ref,
) => {
  const [favoriteTeams, setFavoriteTeams] = useState<string[]>(() => {
    return getCache<string[]>('favoriteTeams') || [];
  });

  const [isOpenModal, setIsOpenModal] = useState(favoriteTeams.length === 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [canScrollToTop, setCanScrollToTop] = useState(false);
  const [canScrollToBottom, setCanScrollToBottom] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const buttonColors = isDarkMode
    ? { backgroundColor: '#1c1c1e', borderColor: '#f5f5f5', iconColor: '#f5f5f5' }
    : { backgroundColor: '#ffffff', borderColor: '#000000', iconColor: '#000000' };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const maxScrollY = contentSize.height - layoutMeasurement.height;
    setCanScrollToTop(contentOffset.y > 1);
    setCanScrollToBottom(maxScrollY > 1 && contentOffset.y < maxScrollY - 1);
    setIsMenuOpen(false);
  };

  useImperativeHandle(ref, () => ({
    handleScroll,
    openFavModal: () => {
      setIsMenuOpen(false);
      setIsOpenModal(true);
    },
  }));

  const scrollToTop = () => {
    setIsMenuOpen(false);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const scrollToBottom = () => {
    setIsMenuOpen(false);
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const openFavorites = () => {
    setIsMenuOpen(false);
    setIsOpenModal(true);
  };

  const saveTeams = (newTeams: string[]) => {
    setFavoriteTeams(newTeams);

    saveCache('favoriteTeams', newTeams);
    if (globalThis.window !== undefined) globalThis.window.dispatchEvent(new Event('favoritesUpdated'));
  };

  return (
    <>
      <FavModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        favoriteTeams={favoriteTeams}
        onSave={saveTeams}
      />
      <View style={styles.container}>
        {isMenuOpen && (
          <View style={styles.actions}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Scroll to top"
              accessibilityState={{ disabled: !canScrollToTop }}
              disabled={!canScrollToTop}
              onPress={scrollToTop}
              style={[
                styles.button,
                buttonColors,
                styles.actionButton,
                !canScrollToTop && styles.disabledButton,
              ]}
            >
              <IconSymbol name="arrow.up" color={buttonColors.iconColor} size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Scroll to bottom"
              accessibilityState={{ disabled: !canScrollToBottom }}
              disabled={!canScrollToBottom}
              onPress={scrollToBottom}
              style={[
                styles.button,
                buttonColors,
                styles.actionButton,
                !canScrollToBottom && styles.disabledButton,
              ]}
            >
              <IconSymbol name="arrow.down" color={buttonColors.iconColor} size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Open favorites"
              onPress={openFavorites}
              style={[styles.button, buttonColors, styles.actionButton]}
            >
              <IconSymbol name="gearshape.fill" color={buttonColors.iconColor} size={24} />
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={isMenuOpen ? 'Close actions menu' : 'Open actions menu'}
          accessibilityState={{ expanded: isMenuOpen }}
          onPress={() => setIsMenuOpen((isOpen) => !isOpen)}
          style={[styles.button, buttonColors, styles.menuButton]}
        >
          <IconSymbol
            name={isMenuOpen ? 'xmark' : 'line.3.horizontal'}
            color={buttonColors.iconColor}
            size={24}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1,
    alignItems: 'flex-end',
  },
  actions: {
    marginBottom: 10,
    gap: 10,
  },
  button: {
    borderRadius: 50,
    padding: 10,
    borderWidth: 1,
  },
  actionButton: {
    alignSelf: 'flex-end',
  },
  menuButton: {
    alignSelf: 'flex-end',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export const ActionButton = forwardRef(ActionButtonWithRef);
