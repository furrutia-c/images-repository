import { createContext, useContext, useState, ReactNode } from 'react';
import { Category, ImageItem, Tag } from '../types';

// Datos de ejemplo para categorías
const initialCategories: Category[] = [
  { id: 'c1', name: 'Logos', description: 'Iconos vectoriales para interfaces' },
  { id: 'c2', name: 'Colores', description: 'Imágenes fotográficas de alta calidad' },
  { id: 'c3', name: 'Ilustraciones', description: 'Arte digital e ilustraciones' },
  { id: 'c4', name: 'Ficosa', description: 'Fondos y texturas para diseño' },
];

// Datos de ejemplo para etiquetas
const initialTags: Tag[] = [
  { id: 't1', name: 'naturaleza' },
  { id: 't2', name: 'tecnología' },
  { id: 't3', name: 'minimalista' },
  { id: 't4', name: 'colorido' },
  { id: 't5', name: 'abstracto' },
  { id: 't6', name: 'paisaje' },
  { id: 't7', name: 'web' },
  { id: 't8', name: 'ui' },
  { id: 't9', name: 'textura' },
  { id: 't10', name: 'animales' },
];

// Datos de ejemplo para imágenes (con tags)
const initialImages: ImageItem[] = [
  {
    id: 'img1',
    name: 'React Logo',
    description: 'Logo oficial de React',
    type: 'svg',
    url: '/src/assets/react.svg',
    categoryIds: ['c1'],
    tagIds: ['t2', 't3', 't7'],
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'img2',
    name: 'Vite Logo',
    description: 'Logo oficial de Vite',
    type: 'svg',
    url: '/public/vite.svg',
    categoryIds: ['c1'],
    tagIds: ['t2', 't3', 't7'],
    createdAt: new Date('2023-01-02'),
  },
  {
    id: 'img3',
    name: 'Montañas al atardecer',
    description: 'Hermoso paisaje de montañas durante el atardecer',
    type: 'jpg',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    categoryIds: ['c2'],
    tagIds: ['t1', 't6', 't4'],
    createdAt: new Date('2023-01-03'),
  },
  {
    id: 'img4',
    name: 'Playa tropical',
    description: 'Playa de arena blanca con agua cristalina',
    type: 'jpg',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    categoryIds: ['c2'],
    tagIds: ['t1', 't6'],
    createdAt: new Date('2023-01-04'),
  },
  {
    id: 'img5',
    name: 'Ilustración abstracta',
    description: 'Arte abstracto con formas geométricas coloridas',
    type: 'png',
    url: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb',
    categoryIds: ['c3'],
    tagIds: ['t4', 't5'],
    createdAt: new Date('2023-01-05'),
  },
  {
    id: 'img6',
    name: 'Patrón geométrico',
    description: 'Patrón de fondo con figuras geométricas repetitivas',
    type: 'svg',
    url: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3',
    categoryIds: ['c4'],
    tagIds: ['t3', 't5', 't9'],
    createdAt: new Date('2023-01-06'),
  },
  {
    id: 'img7',
    name: 'Textura de mármol',
    description: 'Textura elegante de mármol blanco y gris',
    type: 'jpg',
    url: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2',
    categoryIds: ['c4'],
    tagIds: ['t3', 't9'],
    createdAt: new Date('2023-01-07'),
  },
  {
    id: 'img8',
    name: 'Iconos de redes sociales',
    description: 'Conjunto de iconos de diferentes redes sociales',
    type: 'svg',
    url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868',
    categoryIds: ['c1'],
    tagIds: ['t2', 't7', 't8'],
    createdAt: new Date('2023-01-08'),
  },
  {
    id: 'img9',
    name: 'Diagrama de flujo',
    description: 'Ilustración de un diagrama de flujo para procesos',
    type: 'png',
    url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e',
    categoryIds: ['c1', 'c3'],
    tagIds: ['t2', 't8'],
    createdAt: new Date('2023-01-09'),
  },
  {
    id: 'img10',
    name: 'Bosque de niebla',
    description: 'Fotografía de un bosque cubierto de niebla al amanecer',
    type: 'jpg',
    url: 'https://images.unsplash.com/photo-1511497584788-876760111969',
    categoryIds: ['c2'],
    tagIds: ['t1', 't6', 't9'],
    createdAt: new Date('2023-01-10'),
  },
  {
    id: 'img24',
    name: 'Textura de tela',
    description: 'Textura de tela de algodón para fondos',
    type: 'jpg',
    url: 'https://images.unsplash.com/photo-1583248369069-9d91f1640fe6',
    categoryIds: ['c4'],
    tagIds: ['t9', 't3'],
    createdAt: new Date('2023-01-24'),
  },
  {
    id: 'pdf1',
    name: 'Manual de Usuario',
    description: 'Guía completa de uso del sistema',
    type: 'pdf',
    url: 'https://www.africau.edu/images/default/sample.pdf',
    categoryIds: ['c1'],
    tagIds: ['t2', 't7', 't8'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'pdf2',
    name: 'Especificaciones Técnicas',
    description: 'Documento detallado con especificaciones del proyecto',
    type: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    categoryIds: ['c1', 'c3'],
    tagIds: ['t2', 't8'],
    createdAt: new Date('2024-01-16'),
  },
  {
    id: 'pdf3',
    name: 'Guía de Diseño',
    description: 'Guía de estilos y componentes del sistema',
    type: 'pdf',
    url: 'https://css4.pub/2015/usenix/example.pdf',
    categoryIds: ['c3'],
    tagIds: ['t3', 't8'],
    createdAt: new Date('2024-01-17'),
  },
];

interface RepositoryContextType {
  images: ImageItem[];
  categories: Category[];
  tags: Tag[];
  searchQuery: string;
  selectedCategory: string | null;
  selectedTags: string[];
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  toggleTag: (tagId: string) => void;
  clearSelectedTags: () => void;
  addImage: (image: Omit<ImageItem, 'id' | 'createdAt'>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (categoryId: string, categoryData: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (categoryId: string) => boolean;
  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateTag: (tagId: string, tagData: Partial<Omit<Tag, 'id'>>) => void;
  deleteTag: (tagId: string) => boolean;
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined);

export function RepositoryProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  };

  const clearSelectedTags = () => {
    setSelectedTags([]);
  };

  const addImage = (image: Omit<ImageItem, 'id' | 'createdAt'>) => {
    const newImage: ImageItem = {
      ...image,
      id: `img${Date.now()}`,
      createdAt: new Date(),
    };
    setImages(prev => [...prev, newImage]);
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: `c${Date.now()}`,
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (categoryId: string, categoryData: Partial<Omit<Category, 'id'>>) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
        ? { ...category, ...categoryData } 
        : category
      )
    );
  };

  const deleteCategory = (categoryId: string): boolean => {
    // Verificar si la categoría está siendo utilizada por alguna imagen
    const isUsed = images.some(image => image.categoryIds.includes(categoryId));
    
    if (isUsed) {
      return false; // No eliminar si está en uso
    }
    
    // Eliminar la categoría y resetear selectedCategory si es necesario
    setCategories(prev => prev.filter(category => category.id !== categoryId));
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    }
    
    return true;
  };

  const addTag = (tag: Omit<Tag, 'id'>) => {
    const newTag: Tag = {
      ...tag,
      id: `t${Date.now()}`,
    };
    setTags(prev => [...prev, newTag]);
  };

  const updateTag = (tagId: string, tagData: Partial<Omit<Tag, 'id'>>) => {
    setTags(prev => 
      prev.map(tag => 
        tag.id === tagId 
        ? { ...tag, ...tagData } 
        : tag
      )
    );
  };

  const deleteTag = (tagId: string): boolean => {
    // Verificar si la etiqueta está siendo utilizada por alguna imagen
    const isUsed = images.some(image => image.tagIds.includes(tagId));
    
    if (isUsed) {
      return false; // No eliminar si está en uso
    }
    
    // Eliminar la etiqueta y también eliminarla de selectedTags si estaba seleccionada
    setTags(prev => prev.filter(tag => tag.id !== tagId));
    setSelectedTags(prev => prev.filter(id => id !== tagId));
    
    return true;
  };

  return (
    <RepositoryContext.Provider
      value={{
        images,
        categories,
        tags,
        searchQuery,
        selectedCategory,
        selectedTags,
        setSearchQuery,
        setSelectedCategory,
        toggleTag,
        clearSelectedTags,
        addImage,
        addCategory,
        updateCategory,
        deleteCategory,
        addTag,
        updateTag,
        deleteTag,
      }}
    >
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepository() {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error('useRepository must be used within a RepositoryProvider');
  }
  return context;
}