import { useRepository } from '../context/RepositoryContext';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function TagSelector() {
  const { t } = useTranslation();
  const { tags, selectedTags, toggleTag, clearSelectedTags } = useRepository();
  const [showAllTags, setShowAllTags] = useState(false);
  
  // Mostrar un número limitado de etiquetas en dispositivos móviles inicialmente
  const visibleTagCount = showAllTags ? tags.length : Math.min(8, tags.length);
  const visibleTags = tags.slice(0, visibleTagCount);
  const hasMoreTags = tags.length > 8;
  
  return (
    <div className="mb-6 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('tags.title')}</h3>
        <div className="flex items-center gap-2">
          {selectedTags.length > 0 && (
            <button
              onClick={clearSelectedTags}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline"
            >
              {t('common.clearFilters')}
            </button>
          )}
          {hasMoreTags && (
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className="text-xs text-gray-600 dark:text-gray-400 hover:underline"
            >
              {showAllTags ? t('common.showLess') : t('common.showAll')}
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {visibleTags.map(tag => (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.id)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedTags.includes(tag.id)
                ? 'bg-sky-500 dark:bg-sky-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            #{tag.name}
          </button>
        ))}
        {!showAllTags && hasMoreTags && (
          <button
            onClick={() => setShowAllTags(true)}
            className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            +{tags.length - visibleTagCount} {t('common.more')}
          </button>
        )}
      </div>
    </div>
  );
}