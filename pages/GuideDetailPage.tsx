// FIX: Create new file for the Guide Detail page.
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { guides } from '../data/guides';
import { ArrowLeftIcon } from '../components/Icons';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useLocalization } from '../hooks/useLocalization';
import NativeAd from '../components/NativeAd';

const GuideDetailPage: React.FC = () => {
    const { guideId } = useParams<{ guideId: string }>();
    const navigate = useNavigate();
    const { t } = useLocalization();
    const guide = guides.find(g => g.id === guideId);

    if (!guide) {
        return <div className="p-4 text-center">{t('noGuidesFound')}</div>;
    }

    return (
        <div className="p-4 space-y-4">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-[color:var(--primary)] hover:underline mb-4">
                <ArrowLeftIcon />
                <span>{t('backToGuides')}</span>
            </button>

            <div className="bg-[color:var(--card)] rounded-lg shadow-lg border border-[color:var(--border)] overflow-hidden p-6">
                <span className="text-sm font-semibold text-[color:var(--primary)] bg-[color:var(--primary)]/10 px-2 py-1 rounded-full">{guide.category}</span>
                <h1 className="text-4xl font-bold mt-2 text-[color:var(--card-foreground)]">{guide.title}</h1>
                <p className="text-lg text-[color:var(--foreground)] opacity-80 mt-2">{guide.summary}</p>
                <hr className="my-6 border-[color:var(--border)]" />
                <div className="mb-6">
                    <NativeAd format="in-content" />
                </div>
                <MarkdownRenderer content={guide.content} />
            </div>
        </div>
    );
};

export default GuideDetailPage;