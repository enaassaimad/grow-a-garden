import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { pets } from '../data/pets';
import { Pet } from '../types';
import { TIER_COLORS } from '../constants';
import { useFavorites } from '../hooks/useFavorites';
import { SearchIcon, StarIcon, GridIcon, ListIcon } from '../components/Icons';
import { useLocalization } from '../hooks/useLocalization';
import NativeAd from '../components/NativeAd';

const PetCard = ({ pet, isFavorite, onToggleFavorite }: { pet: Pet, isFavorite: boolean, onToggleFavorite: (id: number) => void }) => {
  const tierColor = TIER_COLORS[pet.mTier] || TIER_COLORS['Common'];
  return (
    <div className="bg-[color:var(--card)] rounded-lg shadow-md border border-[color:var(--border)] overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col relative h-full">
      <Link to={`/pets/${pet.mId}`} className="flex-grow flex flex-col">
        <div className="relative">
          <img src={`https://firebasestorage.googleapis.com/v0/b/grow-a-garden-guide.appspot.com/o/Pets%2F${pet.mNameIcon}?alt=media`} alt={pet.mName} className="w-full h-32 object-contain bg-[color:var(--background)] p-2" />
          <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded ${tierColor.bg} ${tierColor.text}`}>{pet.mTier}</span>
        </div>
        <div className="p-4 flex-grow">
          <h3 className="font-bold text-lg text-[color:var(--card-foreground)] truncate">{pet.mName}</h3>
          <p className="text-sm text-[color:var(--foreground)] opacity-80 h-10 overflow-hidden text-ellipsis">{pet.mPassive}</p>
        </div>
      </Link>
      <button 
        onClick={() => onToggleFavorite(pet.mId)}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-black/80 transition-colors"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <StarIcon className={`w-5 h-5 ${isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
      </button>
    </div>
  );
};

const PetListItem = ({ pet, isFavorite, onToggleFavorite }: { pet: Pet, isFavorite: boolean, onToggleFavorite: (id: number) => void }) => {
  const tierColor = TIER_COLORS[pet.mTier] || TIER_COLORS['Common'];
  return (
    <div className="bg-[color:var(--card)] rounded-lg shadow-md border border-[color:var(--border)] overflow-hidden transition-shadow duration-300 flex items-center p-2 space-x-4 relative">
        <Link to={`/pets/${pet.mId}`} className="flex items-center space-x-4 flex-grow">
            <img src={`https://firebasestorage.googleapis.com/v0/b/grow-a-garden-guide.appspot.com/o/Pets%2F${pet.mNameIcon}?alt=media`} alt={pet.mName} className="w-20 h-20 object-contain bg-[color:var(--background)] p-1 rounded-md" />
            <div className="flex-grow">
                <h3 className="font-bold text-lg text-[color:var(--card-foreground)] truncate">{pet.mName}</h3>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${tierColor.bg} ${tierColor.text}`}>{pet.mTier}</span>
                <p className="text-sm text-[color:var(--foreground)] opacity-80 mt-1 h-10 overflow-hidden text-ellipsis">{pet.mPassive}</p>
            </div>
        </Link>
      <button 
        onClick={() => onToggleFavorite(pet.mId)}
        className="p-2 rounded-full hover:bg-[color:var(--secondary)] transition-colors absolute top-2 right-2"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <StarIcon className={`w-6 h-6 ${isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
      </button>
    </div>
  );
};


const PetsPage: React.FC = () => {
  const { t } = useLocalization();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const { favorites, toggleFavorite } = useFavorites('petFavorites');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const tiers = useMemo(() => ['All', 'Common', 'Uncommon', 'Rare', 'Legendary', 'Mythical', 'Divine'], []);
  
  const filteredPets = useMemo(() => {
    return pets
      .filter(pet => {
        if (showFavoritesOnly && !favorites.has(pet.mId)) {
          return false;
        }
        const searchTermMatch = pet.mName.toLowerCase().includes(searchTerm.toLowerCase());
        const tierMatch = selectedTier === 'All' || pet.mTier === selectedTier;
        return searchTermMatch && tierMatch;
      })
      .sort((a, b) => a.mName.localeCompare(b.mName));
  }, [searchTerm, selectedTier, favorites, showFavoritesOnly]);

  const renderItemsWithAds = (items: Pet[]) => {
    const components: JSX.Element[] = [];
    items.forEach((item, index) => {
        const component = viewMode === 'grid' 
            ? <PetCard key={item.mId} pet={item} isFavorite={favorites.has(item.mId)} onToggleFavorite={toggleFavorite} />
            : <PetListItem key={item.mId} pet={item} isFavorite={favorites.has(item.mId)} onToggleFavorite={toggleFavorite} />;
        components.push(component);
        if ((index + 1) % 8 === 0) {
            components.push(<NativeAd key={`ad-${index}`} format={viewMode === 'list' ? 'list' : 'grid'} />);
        }
    });
    return components;
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold text-[color:var(--primary)]">{t('petsTitle')}</h1>
      
      <div className="sticky top-0 bg-[color:var(--background)] py-2 z-10 space-y-4">
        <div className="relative">
            <input
            type="text"
            placeholder={t('searchPets')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] focus:ring-2 focus:ring-[color:var(--primary)] outline-none transition-shadow"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        
        <div className="flex overflow-x-auto space-x-2 pb-2 -mx-4 px-4">
            {tiers.map(tier => (
                <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                        selectedTier === tier 
                        ? 'bg-[color:var(--primary)] text-[color:var(--primary-foreground)]' 
                        : 'bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)] hover:bg-opacity-80'
                    }`}
                >
                    {tier === 'All' ? t('tierAll') : tier}
                </button>
            ))}
        </div>

        <div className="flex justify-between items-center gap-2">
            <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${showFavoritesOnly ? 'bg-[color:var(--primary)] text-[color:var(--primary-foreground)] border-[color:var(--primary)]' : 'bg-[color:var(--card)] border-[color:var(--border)]'}`}
            >
                <StarIcon className={`w-5 h-5 ${showFavoritesOnly ? 'text-yellow-300' : 'text-gray-400'}`} />
                <span className="hidden sm:inline">{t('favorites')}</span>
                 <span className="sm:hidden">{showFavoritesOnly ? t('favoritesOn') : t('favoritesOff')}</span>
            </button>
            <div className="flex gap-1 bg-[color:var(--card)] border border-[color:var(--border)] p-1 rounded-lg">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[color:var(--primary)] text-[color:var(--primary-foreground)]' : 'hover:bg-[color:var(--secondary)]'}`}>
                    <GridIcon />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[color:var(--primary)] text-[color:var(--primary-foreground)]' : 'hover:bg-[color:var(--secondary)]'}`}>
                    <ListIcon />
                </button>
            </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {renderItemsWithAds(filteredPets)}
        </div>
      ) : (
        <div className="space-y-3">
          {renderItemsWithAds(filteredPets)}
        </div>
      )}
      {filteredPets.length === 0 && (
          <div className="text-center py-10 col-span-full">
              <p className="text-lg text-[color:var(--foreground)] opacity-80">{t('noPetsFound')}</p>
          </div>
      )}
    </div>
  );
};

export default PetsPage;