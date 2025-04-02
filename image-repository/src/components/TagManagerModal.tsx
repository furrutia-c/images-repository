import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { useRepository } from '../context/RepositoryContext';
import { Tag } from '../types';

interface TagManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TagManagerModal({ isOpen, onClose }: TagManagerModalProps) {
  const { t } = useTranslation();
  const { tags, addTag, updateTag, deleteTag } = useRepository();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [deleteError, setDeleteError] = useState('');
  
  const [tagName, setTagName] = useState('');
  const [tagError, setTagError] = useState('');
  
  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (tag: Tag) => {
    setSelectedTag(tag);
    setTagName(tag.name);
    setTagError('');
  };

  const handleCancelEdit = () => {
    setTagName('');
    setTagError('');
    setSelectedTag(null);
  };

  const handleDeleteClick = (tag: Tag) => {
    setTagToDelete(tag);
    setDeleteError('');
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTagToDelete(null);
    setDeleteError('');
  };

  const validateTagName = (tagName: string) => {
    const tagExists = tags.some(tag => 
      tag.name.toLowerCase() === tagName.toLowerCase() && 
      (!selectedTag || tag.id !== selectedTag.id)
    );
    
    if (tagExists) {
      setTagError(t('tags.errorExists'));
      return false;
    }
    
    if (!tagName.trim()) {
      setTagError(t('tags.errorRequired'));
      return false;
    }
    
    setTagError('');
    return true;
  };

  const handleSaveTag = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTagName(tagName)) {
      return;
    }
    
    if (selectedTag) {
      updateTag(selectedTag.id, { name: tagName });
    } else {
      addTag({ name: tagName });
    }
    
    setTagName('');
    setTagError('');
    setSelectedTag(null);
  };

  const handleDeleteConfirm = () => {
    if (tagToDelete) {
      const success = deleteTag(tagToDelete.id);
      
      if (!success) {
        setDeleteError(t('tags.errorDeleteInUse'));
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
                    {t('tags.manage')}
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
                  {t('tags.manageDescription')}
                </p>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-4">
                  <div className="p-4">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                      {selectedTag ? t('tags.edit') : t('tags.add')}
                    </h3>
                    
                    <form onSubmit={handleSaveTag}>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="tag-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('tags.name')}
                          </label>
                          <input
                            type="text"
                            id="tag-name"
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}
                            className={`mt-1 block w-full rounded-md border ${tagError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                            placeholder={t('tags.placeholder')}
                            autoFocus={!!selectedTag}
                            required
                          />
                          {tagError && (
                            <p className="mt-1 text-sm text-red-500">{tagError}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-sm">
                            #{tagName || t('tags.example')}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {t('tags.preview')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        {selectedTag && (
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
                          {selectedTag ? t('common.update') : t('common.create')}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                      {t('tags.existing')}
                    </h3>
                    
                    <div className="relative mb-3">
                      <input
                        type="text"
                        className="block w-full pr-10 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                        placeholder={t('tags.searchPlaceholder')}
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
                      {filteredTags.length === 0 ? (
                        <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                          {t('common.noResults')}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {filteredTags.map((tag) => (
                            <div 
                              key={tag.id}
                              className={`group relative inline-flex items-center px-3 py-1.5 rounded-full text-sm ${
                                selectedTag?.id === tag.id 
                                  ? 'bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 border-2 border-sky-500' 
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                              }`}
                            >
                              #{tag.name}
                              <div className="absolute right-0 top-0 h-full flex items-center pr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleEditClick(tag)}
                                  className="p-1 text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300"
                                  title={t('common.edit')}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(tag)}
                                  className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                  title={t('common.delete')}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
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
                      {t('tags.confirmDelete')} <span className="font-semibold text-gray-700 dark:text-gray-300">#{tagToDelete?.name}</span>?
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