import React, { createContext, useContext } from 'react';

interface CategoryContextProps {
  activeCategory: string;
  onCategoryPress: (category: string) => void;
}

const CategoryContext = createContext<CategoryContextProps>({
  activeCategory: '',
  onCategoryPress: () => {},
});

export const useCategory = () => useContext(CategoryContext);

export default CategoryContext;
