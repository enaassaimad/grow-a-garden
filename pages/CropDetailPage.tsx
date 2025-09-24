import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { crops } from '../data/crops';
import { TIER_COLORS } from '../constants';
import { ArrowLeftIcon } from '../components/Icons';
import { useLocalization } from '../hooks/useLocalization';
import NativeAd from '../components/NativeAd';

const DetailSection = ({ title, content }: { title: string, content: string | string[] | null }) => {
    if (!content || content.length === 0) return null;
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

const InfoPill = ({ label, value }: { label: string, value: string | undefined }) => {
    if (!value) return null;
    return (
        <div className="flex flex-col items-center bg-[color:var(--background)] p-2 rounded-lg border border-[color:var(--border)]">
            <span className="text-xs font-semibold text-[color:var(--foreground)] opacity-80">{label}</span>
            <span className="font-bold text-base text-[color:var(--primary)]">{value}</span>
        </div>
    )
}

const CropDetailPage: React.FC = () => {
    const { cropId } = useParams<{ cropId: string }>();
    const navigate = useNavigate();
    const { t } = useLocalization();
    const crop = crops.find(p => p.mId === Number(cropId));

    if (!crop) {
        return <div className="p-4 text-center">{t('noCropsFound')}</div>;
    }

    const tierColor = TIER_COLORS[crop.mTier] || TIER_COLORS['Common'];

    return (
        <div className="p-4 space-y-4">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-[color:var(--primary)] hover:underline mb-4">
                <ArrowLeftIcon />
                <span>{t('backToCrops')}</span>
            </button>
            <div className="bg-[color:var(--card)] rounded-lg shadow-lg border border-[color:var(--border)] overflow-hidden p-4">
                 <div className="text-center">
                    <img src={`https://firebasestorage.googleapis.com/v0/b/grow-a-garden-guide.appspot.com/o/Crops%2F${crop.mNameIcon}?alt=media`} alt={crop.mName} className="w-full max-w-xs mx-auto h-48 object-contain bg-slate-100 rounded-lg" />
                    <h1 className="text-3xl font-bold mt-4 text-[color:var(--card-foreground)]">{crop.mName}</h1>
                    <div className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${tierColor.bg} ${tierColor.text}`}>
                        {crop.mTier}
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <InfoPill label={t('cropPriceSheckles')} value={crop.mPrice} />
                    <InfoPill label={t('cropPriceRobux')} value={crop.mPrice_Rb} />
                    <InfoPill label={t('cropSellValue')} value={crop.mSell_value} />
                    <InfoPill label={t('cropMultiHarvest')} value={crop.mMultiharvest} />
                </div>
            </div>
            
            <DetailSection title={t('cropHowToObtain')} content={crop.mObtainable_way} />
            <NativeAd format="in-content" />
            <DetailSection title={t('cropTrivia')} content={crop.mTrivia} />
        </div>
    );
};

export default CropDetailPage;