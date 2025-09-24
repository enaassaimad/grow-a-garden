import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pets } from '../data/pets';
import { TIER_COLORS } from '../constants';
import { ArrowLeftIcon } from '../components/Icons';
import { useLocalization } from '../hooks/useLocalization';
import NativeAd from '../components/NativeAd';

const DetailSection = ({ title, content }: { title: string, content: string | string[] }) => {
    if (!content || (Array.isArray(content) && content.length === 0)) return null;
    return (
        <div className="bg-[color:var(--card)] p-4 rounded-lg border border-[color:var(--border)]">
            <h2 className="text-xl font-bold text-[color:var(--primary)] mb-2">{title}</h2>
            {typeof content === 'string' ? (
                 <p className="text-[color:var(--foreground)] whitespace-pre-wrap leading-relaxed">{content}</p>
            ) : (
                <ul className="list-disc list-inside space-y-1">
                    {content.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            )}
        </div>
    );
};


const PetDetailPage: React.FC = () => {
    const { petId } = useParams<{ petId: string }>();
    const navigate = useNavigate();
    const { t } = useLocalization();
    const pet = pets.find(p => p.mId === Number(petId));

    if (!pet) {
        return <div className="p-4 text-center">{t('noPetsFound')}</div>;
    }

    const tierColor = TIER_COLORS[pet.mTier] || TIER_COLORS['Common'];

    return (
        <div className="p-4 space-y-4">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-[color:var(--primary)] hover:underline mb-4">
                <ArrowLeftIcon />
                <span>{t('backToPets')}</span>
            </button>

            <div className="bg-[color:var(--card)] rounded-lg shadow-lg border border-[color:var(--border)] overflow-hidden">
                <div className="p-4 md:flex md:space-x-6">
                    <div className="md:w-1/3 text-center">
                         <img src={`https://firebasestorage.googleapis.com/v0/b/grow-a-garden-guide.appspot.com/o/Pets%2F${pet.mNameIcon}?alt=media`} alt={pet.mName} className="w-full max-w-xs mx-auto h-48 object-contain bg-slate-100 rounded-lg" />
                         <h1 className="text-3xl font-bold mt-4 text-[color:var(--card-foreground)]">{pet.mName}</h1>
                         <div className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${tierColor.bg} ${tierColor.text}`}>
                            {pet.mTier}
                        </div>
                    </div>
                    <div className="md:w-2/3 mt-4 md:mt-0 space-y-4">
                       <DetailSection title={t('petPassive')} content={pet.mPassive} />
                       <DetailSection title={t('petGeneral')} content={pet.mGeneral} />
                    </div>
                </div>
            </div>
            
            <DetailSection title={t('petObtaining')} content={pet.mObtaining_method} />
            <NativeAd format="in-content" />
            <DetailSection title={t('petTrivia')} content={pet.mTrivia} />

        </div>
    );
};

export default PetDetailPage;