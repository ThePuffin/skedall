import { useFavoriteColor } from '@/hooks/useFavoriteColor';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useMemo } from 'react';
import { ScrollView, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

interface FilterSliderProps {
  data?: { label: string; value: string }[];
  availableLeagues?: string[];
  selectedFilter?: string;
  selectedFilters?: string[];
  onFilterChange?: (value: string) => void;
  showFavorites?: boolean;
  hasFavorites?: boolean;
  favoriteValues?: string[];
  showAll?: boolean;
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  selectedItemStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  multipleSelection?: boolean;
}

export default function FilterSlider(props: FilterSliderProps) {
  const {
    data,
    availableLeagues,
    selectedFilter,
    selectedFilters,
    onFilterChange,
    style,
    itemStyle,
    selectedItemStyle,
    textStyle,
    selectedTextStyle,
    multipleSelection = false,
    favoriteValues,
  } = props;

  const themeTextColor = useThemeColor({}, 'text');
  const unselectedBackgroundColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'background');
  const { backgroundColor: selectedBackgroundColor, textColor: selectedTextColor } = useFavoriteColor('#3b82f6');

  const sortedItems = useMemo(() => {
    let items: { label: string; value: string }[] = [];

    if (data) {
      items = [...data];
    } else if (availableLeagues) {
      items = availableLeagues.map((l) => ({ label: l, value: l }));
    }

    if (!multipleSelection) {
      const selectedItem = items.find((item) => item.value === selectedFilter);
      const allItem = items.find(
        (item) => (item.value === 'ALL' || item.value === 'all' || item.value === '') && item.value !== selectedFilter,
      );

      const remainingItems = items.filter(
        (item) => item.value !== selectedFilter && item.value !== 'ALL' && item.value !== 'all' && item.value !== '',
      );

      const favoriteItems = remainingItems.filter((item) => favoriteValues?.includes(item.value));
      const otherItems = remainingItems.filter((item) => !favoriteValues?.includes(item.value));

      items = [...(selectedItem ? [selectedItem] : []), ...(allItem ? [allItem] : []), ...favoriteItems, ...otherItems];
    }
    return items;
  }, [data, availableLeagues, multipleSelection, selectedFilter, favoriteValues]);

  return (
    <View style={[styles.container, style]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {sortedItems.map((item, index) => {
          const isSelected = selectedFilters ? selectedFilters.includes(item.value) : selectedFilter === item.value;
          return (
            <React.Fragment key={item.value}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  { backgroundColor: unselectedBackgroundColor },
                  itemStyle,
                  isSelected ? { backgroundColor: selectedBackgroundColor } : {},
                  isSelected ? selectedItemStyle : {},
                ]}
                onPress={() => onFilterChange && onFilterChange(item.value)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: themeTextColor },
                    textStyle,
                    isSelected ? { color: selectedTextColor } : {},
                    isSelected ? selectedTextStyle : {},
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
              {!multipleSelection && index === 0 && isSelected && sortedItems.length > 1 && (
                <View
                  style={{
                    width: 1,
                    height: 20,
                    backgroundColor: themeTextColor,
                    opacity: 0.2,
                    marginHorizontal: 5,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 5,
  },
  scrollContent: {
    alignItems: 'center',
    paddingRight: 15,
    paddingLeft: 5,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
