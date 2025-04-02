import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRepository } from '../context/RepositoryContext';
import { CategoryIcon, InfoIcon, DownloadIcon, PDFIcon } from '../components/Icons';
import { ImageItem } from '../types';
import Pagination from '../components/Pagination';
import ImageViewer from '../components/ImageViewer';
import TagSelector from '../components/TagSelector';

// Componente para la barra lateral de categorías
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const { images, categories, selectedCategory, setSelectedCategory } = useRepository();

  // Calcular el número de imágenes por categoría
  const getCategoryImageCount = (categoryId: string | null) => {
    if (categoryId === null) {
      return images.length; // Total de imágenes para "Todas"
    }
    return images.filter(image => image.categoryIds.includes(categoryId)).length;
  };

  // Función para seleccionar categoría y cerrar sidebar en móvil
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay para cerrar el sidebar en móvil */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={onClose}
        ></div>
      )}
      
      <aside className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
        fixed md:sticky 
        top-0 md:top-16 
        left-0 
        z-30 md:z-0 
        h-full md:h-[calc(100vh-64px)] 
        w-64 
        bg-gray-50 dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700 
        p-4 
        transition-transform duration-300 ease-in-out
        overflow-y-auto
      `}>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex justify-between items-center">
          <span>{t('categories.title')}</span>
          <button 
            onClick={onClose}
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 011.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleCategorySelect(null)}
              className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg ${
                selectedCategory === null 
                  ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center">
                <CategoryIcon />
                <span className="ml-2">{t('categories.all')}</span>
              </div>
              <span className="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5">
                {getCategoryImageCount(null)}
              </span>
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => handleCategorySelect(category.id)}
                className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg ${
                  selectedCategory === category.id 
                    ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center">
                  <CategoryIcon />
                  <span className="ml-2">{category.name}</span>
                </div>
                <span className="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5">
                  {getCategoryImageCount(category.id)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

// Componente para cada tarjeta de imagen
function ImageCard({ image, onImageClick }: { image: ImageItem; onImageClick: (image: ImageItem) => void }) {
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const { categories, tags } = useRepository();
  
  const imageCategories = categories.filter(category => 
    image.categoryIds.includes(category.id)
  );

  const imageTags = tags.filter(tag => 
    image.tagIds.includes(tag.id)
  );

  const toggleInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowInfo(!showInfo);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `${image.name}.${image.type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        {image.type === 'pdf' ? (
          <div 
            className="w-full h-full flex items-center justify-center cursor-pointer"
            onClick={() => onImageClick(image)}
          >
            <div className="flex flex-col items-center">
              <PDFIcon />
              <span className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                {image.name}
              </span>
            </div>
          </div>
        ) : (
          <img
            src={image.url}
            alt={image.name}
            className="w-full h-full object-contain cursor-pointer"
            onClick={() => onImageClick(image)}
          />
        )}
        
        <div className="absolute top-2 right-2 flex gap-1">
          <button 
            onClick={toggleInfo}
            className="p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-700"
          >
            <InfoIcon />
          </button>
          <button 
            onClick={handleDownload}
            className="p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-700"
          >
            <DownloadIcon />
          </button>
        </div>
        
        {/* Panel de información */}
        {showInfo && (
          <div 
            className="absolute inset-0 bg-black/75 text-white p-4 flex flex-col"
            onClick={toggleInfo}
          >
            <h3 className="text-lg font-medium">{image.name}</h3>
            <p className="text-sm text-gray-200 mt-1">{image.description}</p>
            <div className="mt-2">
              <span className="text-xs font-medium uppercase text-gray-300">{t('categories.title')}</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {imageCategories.map((category) => (
                  <span key={category.id} className="px-2 py-0.5 text-xs bg-sky-600/80 rounded-full">
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
            {imageTags.length > 0 && (
              <div className="mt-2">
                <span className="text-xs font-medium uppercase text-gray-300">{t('tags.title')}</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {imageTags.map((tag) => (
                    <span key={tag.id} className="px-2 py-0.5 text-xs bg-purple-600/80 rounded-full">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-auto">
              <span className="text-xs text-gray-300">
                Formato: {image.type.toUpperCase()}
              </span>
            </div>
            
            <button 
              onClick={toggleInfo}
              className="absolute top-2 right-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-1 transition-colors"
              aria-label={t('imageViewer.close')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 111.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate">{image.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{image.description}</p>
        {imageTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {imageTags.slice(0, 3).map((tag) => (
              <span key={tag.id} className="text-xs text-purple-600 dark:text-purple-400">
                #{tag.name}
              </span>
            ))}
            {imageTags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{imageTags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente principal de la página de inicio
export default function HomePage() {
  const { t } = useTranslation();
  const { images, searchQuery, selectedCategory, selectedTags } = useRepository();
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const itemsPerPage = 8; // Mostrar 8 imágenes por página (2 filas de 4 en pantallas grandes)
  
  // Estado para el visualizador de imágenes
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  
  // Función para abrir el visualizador
  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image);
    setIsViewerOpen(true);
  };
  
  // Función para cerrar el visualizador
  const handleCloseViewer = () => {
    setIsViewerOpen(false);
  };
  
  // Filtrar imágenes por búsqueda, categoría y etiquetas
  const filteredImages = images.filter((image) => {
    // Filtrar por términos de búsqueda
    const matchesSearch = 
      image.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      image.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrar por categoría
    const matchesCategory = selectedCategory === null || image.categoryIds.includes(selectedCategory);
    
    // Filtrar por etiquetas (todas las etiquetas seleccionadas deben estar en la imagen)
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tagId => image.tagIds.includes(tagId));
    
    return matchesSearch && matchesCategory && matchesTags;
  });

  // Calcular el índice de inicio y fin para la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentImages = filteredImages.slice(indexOfFirstItem, indexOfLastItem);

  // Función para cambiar de página
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll al inicio de la galería
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cuando cambia el filtro de búsqueda, categoría o etiquetas, volver a la página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedTags]);

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Botón para abrir el sidebar en dispositivos móviles */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed bottom-4 left-4 z-10 md:hidden bg-sky-500 text-white p-3 rounded-full shadow-lg"
        aria-label={t('categories.title')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>
      
      <div className="flex">
        {/* Sidebar para categorías (responsive) */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        {/* Contenido principal */}
        <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900 w-full">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{t('header.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredImages.length} {filteredImages.length === 1 ? 'imagen encontrada' : 'imágenes encontradas'}
              {selectedCategory && ` ${t('common.in')} ${t('categories.title').toLowerCase()}`}
              {searchQuery && ` ${t('common.for')} "${searchQuery}"`}
              {selectedTags.length > 0 && ` ${t('common.with')} ${selectedTags.length} ${selectedTags.length === 1 ? t('tags.title').toLowerCase().slice(0, -1) : t('tags.title').toLowerCase()}`}
            </p>
          </div>
          
          {/* Selector de etiquetas */}
          <TagSelector />
          
          {filteredImages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {currentImages.map((image) => (
                  <ImageCard 
                    key={image.id} 
                    image={image}
                    onImageClick={handleImageClick}
                  />
                ))}
              </div>
              
              <Pagination 
                totalItems={filteredImages.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="text-xl text-gray-500 dark:text-gray-400">{t('common.noResults')}</p>
              <p className="text-gray-400 dark:text-gray-500">{t('common.tryDifferent')}</p>
            </div>
          )}
          
          {/* Visualizador de imágenes */}
          <ImageViewer 
            image={selectedImage}
            isOpen={isViewerOpen}
            onClose={handleCloseViewer}
          />
        </main>
      </div>
    </div>
  );
}