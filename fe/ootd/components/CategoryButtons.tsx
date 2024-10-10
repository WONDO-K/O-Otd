// src/components/CategoryButtons.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useCategory } from './CategoryContext'; // Context 훅 가져오기

interface Category {
  value: string;
  label: string;
}

const categories: Category[] = [
  { value: 'chic_look', label: '#  시크  ' },
  { value: 'street_look', label: '# 스트릿' },
  { value: 'casual_look', label: '# 캐주얼' },
  { value: 'classic_look', label: '# 클래식' },
  { value: 'minimal_look', label: '# 미니멀' },
  { value: 'sporty_look', label: '# 스포티' },
];

const CategoryButtons: React.FC = () => {
  const { activeCategory, onCategoryPress } = useCategory();
  console.log('CategoryButtons 렌더링'); // 리렌더링 확인용 로그

  return (
    <View style={styles.categoryContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.value}
          style={[
            styles.categoryButton,
            activeCategory === category.value && styles.activeCategoryButton,
          ]}
          onPress={() => onCategoryPress(category.value)}
        >
          <Text
            style={[
              styles.categoryButtonText,
              activeCategory === category.value && styles.activeCategoryButtonText,
            ]}
          >
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 10,
    // backgroundColor: '#262626',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  categoryButton: {
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'white',
    // backgroundColor: '#3a3a3a',
    paddingVertical: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCategoryButton: {
    borderColor: '#ffffff',
    backgroundColor: '#595959',
  },
  categoryButtonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  activeCategoryButtonText: {
    fontWeight: 'bold',
  },
});

export default React.memo(CategoryButtons);
