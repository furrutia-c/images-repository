import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { useRepository } from '../context/RepositoryContext';
import { Category } from '../types';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryManagerModal({ isOpen, onClose }: CategoryManagerModalProps) {
  const { t } = useTranslation();
  const { categories, addCategory, updateCategory, deleteCategory } = useRepository();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState('');
  
  // Estados para la creación/edición de categorías
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [nameError, setNameError] = useState('');
  
  // Filtrar categorías según la búsqueda
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Iniciar edición de categoría
  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || '');
    setNameError('');
  };

  // Cancelar la edición/creación
  const handleCancelEdit = () => {
    setCategoryName('');
    setCategoryDescription('');
    setNameError('');
    setSelectedCategory(null);
  };

  // Iniciar proceso de borrado
  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteError('');
    setIsDeleteModalOpen(true);
  };

  // Cerrar modal de confirmación de borrado
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
    setDeleteError('');
  };

  // Validar nombre de categoría
  const validateCategoryName = (name: string) => {
    // Verificar si ya existe una categoría con este nombre (ignorar la actual en caso de edición)
    const categoryExists = categories.some(category => 
      category.name.toLowerCase() === name.toLowerCase() && 
      (!selectedCategory || category.id !== selectedCategory.id)
    );
    
    if (categoryExists) {
      setNameError(t('categories.errorExists'));
      return false;
    }
    
    if (!name.trim()) {
      setNameError(t('categories.errorRequired'));
      return false;
    }
    
    setNameError('');
    return true;
  };

  // Guardar una categoría (crear o actualizar)
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCategoryName(categoryName)) {
      return;
    }
    
    // Si estamos editando, actualizar la categoría existente
    if (selectedCategory) {
      updateCategory(selectedCategory.id, { 
        name: categoryName,
        description: categoryDescription 
      });
    } else {
      // Crear nueva categoría
      addCategory({ 
        name: categoryName,
        description: categoryDescription 
      });
    }
    
    // Limpiar el formulario
    setCategoryName('');
    setCategoryDescription('');
    setNameError('');
    setSelectedCategory(null);
  };

  // Confirmar eliminación de categoría
  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      const success = deleteCategory(categoryToDelete.id);
      
      if (!success) {
        setDeleteError(t('categories.errorDeleteInUse'));
        return;
      }
      
      handleCloseDeleteModal();
    }
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
          <div className="fixed inset-0 bg-black/30 dark:bg-black/50" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl sm:rounded-2xl bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start mb-2">
                  <Dialog.Title
                    as="h2"
                    className="text-xl font-semibold leading-6 text-gray-900 dark:text-gray-100"
                  >
                    {t('categories.manage')}
                  </Dialog.Title>
                  
                  <button
                    onClick={onClose}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    aria-label={t('common.close')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {t('categories.manageDescription')}
                </p>
                
                {/* Sección 1: Formulario para crear/editar categorías */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-4">
                  <div className="p-4">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                      {selectedCategory ? t('categories.edit') : t('categories.add')}
                    </h3>
                    
                    <form onSubmit={handleSaveCategory}>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('categories.name')}
                          </label>
                          <input
                            type="text"
                            id="category-name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className={`mt-1 block w-full rounded-md border ${nameError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                            placeholder={t('categories.placeholder')}
                            autoFocus={!!selectedCategory}
                            required
                          />
                          {nameError && (
                            <p className="mt-1 text-sm text-red-500">{nameError}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="category-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('common.description')} <span className="text-gray-400 dark:text-gray-500">({t('common.optional')})</span>
                          </label>
                          <textarea
                            id="category-description"
                            value={categoryDescription}
                            onChange={(e) => setCategoryDescription(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder={t('categories.descriptionPlaceholder')}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        {selectedCategory && (
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex-1 inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                          >
                            {t('common.cancel')}
                          </button>
                        )}
                        <button
                          type="submit"
                          className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-sky-500 dark:bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-600 dark:hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                        >
                          {selectedCategory ? t('common.update') : t('common.create')}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                
                {/* Sección 2: Listado de categorías existentes */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                      {t('categories.existing')}
                    </h3>
                    
                    <div className="relative mb-3">
                      <input
                        type="text"
                        className="block w-full pr-10 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                        placeholder={t('categories.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                      {filteredCategories.length === 0 ? (
                        <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                          {t('common.noResults')}
                        </div>
                      ) : (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredCategories.map((category) => (
                            <li 
                              key={category.id}
                              className={`py-3 px-2 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-md ${
                                selectedCategory?.id === category.id 
                                  ? 'bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-500' 
                                  : ''
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex-1 min-w-0 pr-4">
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                    {category.name}
                                  </h4>
                                  {category.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                      {category.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex shrink-0 space-x-1">
                                  <button
                                    onClick={() => handleEditClick(category)}
                                    className="p-1 text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300"
                                    title={t('common.edit')}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(category)}
                                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                    title={t('common.delete')}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>

      {/* Modal de confirmación para eliminar */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseDeleteModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 dark:bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    {t('common.confirmDelete')}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('categories.confirmDelete')} <span className="font-semibold text-gray-700 dark:text-gray-300">{categoryToDelete?.name}</span>?
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {t('common.cannotUndo')}
                    </p>
                    
                    {deleteError && (
                      <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-md">
                        {deleteError}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-3">
                    <button
                      type="button"
                      className="mt-2 sm:mt-0 inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                      onClick={handleCloseDeleteModal}
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      onClick={handleDeleteConfirm}
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Transition>
  );
}