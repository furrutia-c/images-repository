import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { ImageItem } from '../types';
import { useRepository } from '../context/RepositoryContext';
import { DownloadIcon, PDFIcon } from './Icons';

interface ImageViewerProps {
  image: ImageItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageViewer({ image, isOpen, onClose }: ImageViewerProps) {
  const { t } = useTranslation();
  const { categories, tags } = useRepository();
  
  if (!image) return null;
  
  const imageCategories = categories.filter(category => 
    image.categoryIds.includes(category.id)
  );
  
  const imageTags = tags.filter(tag => 
    image.tagIds.includes(tag.id)
  );
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `${image.name}.${image.type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg sm:rounded-2xl bg-white dark:bg-gray-800 shadow-xl transition-all">
                <div className="flex flex-col md:flex-row h-full">
                  {/* Área de visualización */}
                  <div className="w-full md:w-2/3 p-1 bg-gray-800 flex items-center justify-center">
                    <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[70vh] flex items-center justify-center">
                      {image.type === 'pdf' ? (
                        <div className="flex flex-col items-center justify-center text-center">
                          <PDFIcon />
                          <h3 className="mt-4 text-lg text-white font-medium">{image.name}</h3>
                          <a
                            href={image.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            {t('imageViewer.openPdf')}
                          </a>
                        </div>
                      ) : (
                        <img
                          src={image.url}
                          alt={image.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      )}
                      {/* Botón de cierre en la esquina en móvil */}
                      <button
                        onClick={onClose}
                        className="absolute top-2 right-2 md:hidden text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-1.5 transition-colors"
                        aria-label={t('imageViewer.close')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {/* Panel de información */}
                  <div className="w-full md:w-1/3 p-4 sm:p-6 flex flex-col h-full max-h-[40vh] md:max-h-full overflow-y-auto">
                    <div className="flex justify-between items-start mb-4">
                      <Dialog.Title
                        as="h3"
                        className="text-lg sm:text-xl font-semibold leading-6 text-gray-900 dark:text-white"
                      >
                        {image.name}
                      </Dialog.Title>
                      
                      {/* Botón de cierre en escritorio */}
                      <button
                        onClick={onClose}
                        className="hidden md:block text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        aria-label={t('imageViewer.close')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-auto">
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
                        {image.description}
                      </p>
                      
                      <div className="mb-4">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-2">
                          {t('common.information')}
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                          <div className="text-gray-500 dark:text-gray-400">{t('common.type')}:</div>
                          <div className="text-gray-800 dark:text-gray-200 font-medium">{image.type.toUpperCase()}</div>
                          
                          <div className="text-gray-500 dark:text-gray-400">{t('common.date')}:</div>
                          <div className="text-gray-800 dark:text-gray-200 font-medium">
                            {new Date(image.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-2">
                          {t('categories.title')}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {imageCategories.map((category) => (
                            <span 
                              key={category.id} 
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200"
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      {imageTags.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-2">
                            {t('tags.title')}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {imageTags.map((tag) => (
                              <span 
                                key={tag.id} 
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                              >
                                #{tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <button
                        onClick={handleDownload}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                      >
                        <DownloadIcon />
                        <span className="ml-2">{t('imageViewer.download')} {image.type.toUpperCase()}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}