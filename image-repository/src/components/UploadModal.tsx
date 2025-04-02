import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { useRepository } from '../context/RepositoryContext';
import { ImageType } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { t } = useTranslation();
  const { categories, tags, addImage } = useRepository();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<ImageType>('png');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
  
  const visibleTags = showAllTags ? tags : tags.slice(0, 6);
  const hasMoreTags = tags.length > 6;
  
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as ImageType);
  };
  
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addImage({
      name,
      description,
      url,
      type,
      categoryIds: selectedCategories,
      tagIds: selectedTags,
    });
    
    setName('');
    setDescription('');
    setUrl('');
    setType('png');
    setSelectedCategories([]);
    setSelectedTags([]);
    setShowAllTags(false);
    
    onClose();
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    {t('upload.title')}
                  </Dialog.Title>
                  
                  <button
                    onClick={onClose}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    aria-label={t('common.close')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-2">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('common.name')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('common.description')}
                      </label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('upload.imageUrl')}
                      </label>
                      <input
                        type="text"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t('upload.urlHelp')}
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('upload.fileType')}
                      </label>
                      <select
                        id="type"
                        value={type}
                        onChange={handleTypeChange}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="svg">SVG</option>
                        <option value="png">PNG</option>
                        <option value="jpg">JPG</option>
                        <option value="jpeg">JPEG</option>
                        <option value="gif">GIF</option>
                        <option value="webp">WEBP</option>
                        <option value="pdf">PDF</option>
                      </select>
                      {type === 'pdf' && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                          {t('upload.pdfNotice')}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('categories.title')}
                      </span>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`category-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onChange={() => handleCategoryToggle(category.id)}
                              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 dark:border-gray-600 rounded"
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('tags.title')}
                        </span>
                        {hasMoreTags && (
                          <button
                            type="button"
                            onClick={() => setShowAllTags(!showAllTags)}
                            className="text-xs text-sky-600 dark:text-sky-400 hover:underline"
                          >
                            {showAllTags ? t('common.showLess') : t('common.showAll')}
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-h-40 overflow-y-auto pb-1">
                        {visibleTags.map((tag) => (
                          <div key={tag.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`tag-${tag.id}`}
                              checked={selectedTags.includes(tag.id)}
                              onChange={() => handleTagToggle(tag.id)}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded"
                            />
                            <label
                              htmlFor={`tag-${tag.id}`}
                              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                            >
                              #{tag.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {t('upload.tagsHelp')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-2 sm:mt-0 inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-sky-500 dark:bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 dark:hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    >
                      {t('common.save')}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}