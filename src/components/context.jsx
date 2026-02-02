
import { createContext, useState, useEffect } from "react";

export const CateogaryContext = createContext(null);

export const CateogaryProvider = ({ children }) => {
  // Shuru mein check karo agar localStorage mein purana data pada hai
  const [CategoriesImage, setCategoriesImage] = useState(() => {
    const savedData = localStorage.getItem("selectedCategory");
    return savedData ? JSON.parse(savedData) : null;
  });

  // Jab bhi CategoriesImage change ho, use localStorage mein save kar do
  useEffect(() => {
    if (CategoriesImage) {
      localStorage.setItem("selectedCategory", JSON.stringify(CategoriesImage));
    }
  }, [CategoriesImage]);

  return (
    <CateogaryContext value={{ CategoriesImage, setCategoriesImage }}>
      {children}
    </CateogaryContext>
  );
};