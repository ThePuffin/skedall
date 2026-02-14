import React from 'react';
import { ScrollView, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

interface FilterSliderProps {
  data?: { label: string; value: string }[];
  availableLeagues?: string[];
  selectedFilter?: string;
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
}

export default function FilterSlider(props: FilterSliderProps) {
  const {
    data,
    availableLeagues,
    selectedFilter,
    onFilterChange,
    style,
    itemStyle,
    selectedItemStyle,
    textStyle,
    selectedTextStyle,
  } = props;

  let items: { label: string; value: string }[] = [];

  if (data) {
    items = data;
  } else if (availableLeagues) {
    items = availableLeagues.map((l) => ({ label: l, value: l }));
  }

  return (
    <View style={[styles.container, style]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {items.map((item) => {
          const isSelected = selectedFilter === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.chip,
                itemStyle,
                isSelected ? { backgroundColor: 'black' } : {},
                isSelected ? selectedItemStyle : {},
              ]}
              onPress={() => onFilterChange && onFilterChange(item.value)}
            >
              <Text
                style={[
                  styles.chipText,
                  textStyle,
                  isSelected ? { color: 'white' } : {},
                  isSelected ? selectedTextStyle : {},
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
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
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  chipText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
});
