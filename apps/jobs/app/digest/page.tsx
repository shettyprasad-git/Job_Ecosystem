'use client';

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { jobs } from '@/lib/jobs';
import { calculateMatchScore, formatPostedDate } from '@/lib/utils';
import type { JobWithScore, Preferences, StatusUpdate } from '@/lib/types';
import { Mail, Copy, Send, Settings, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNowStrict } from 'date-fns';

const defaultPreferences: Preferences = {
  roleKeywords: "",
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: "All",
  skills: "",
  minMatchScore: 40
};

// Helper function to get the date in YYYY-MM-DD format
const getDigestDateKey = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `jobTrackerDigest_${year}-${month}-${day}`;
};

export default function DigestPage() {
    const [preferences] = useLocalStorage<Preferences>('jobTrackerPreferences', defaultPreferences);
    const [digest, setDigest] = useState<JobWithScore[] | null>(null);
    const [statusUpdates] = useLocalStorage<StatusUpdate[]>('jobTrackerStatusUpdates', []);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const digestKey = getDigestDateKey();
    const todayFormatted = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => {
        const storedDigest = localStorage.getItem(digestKey);
        if (storedDigest) {
            try {
                setDigest(JSON.parse(storedDigest));
            } catch (e) {
                console.error("Failed to parse digest from localStorage", e);
                localStorage.removeItem(digestKey);
            }
        }
        setIsLoading(false);
    }, [digestKey]);

    const generateDigest = () => {
        if (!preferences.roleKeywords) return;

        const scoredJobs = jobs.map(job => ({
            ...job,
            matchScore: calculateMatchScore(job, preferences)
        }));

        const top10 = scoredJobs
            .sort((a, b) => b.matchScore - a.matchScore || a.postedDaysAgo - b.postedDaysAgo)
            .slice(0, 10);
        
        setDigest(top10);
        localStorage.setItem(digestKey, JSON.stringify(top10));

        toast({
            title: "Digest Generated",
            description: "Your daily digest for today is ready.",
        });
    };
    
    const createPlainTextDigest = () => {
        if (!digest) return "";
        let text = `Top 10 Jobs For You — ${todayFormatted}\n\n`;
        digest.forEach((job, index) => {
            text += `${index + 1}. ${job.title} at ${job.company}\n`;
            text += `   - Location: ${job.location} (${job.mode})\n`;
            text += `   - Match: ${job.matchScore}%\n`;
            text += `   - Apply: ${job.applyUrl}\n\n`;
        });
        return text;
    };

    const handleCopyToClipboard = () => {
        const plainText = createPlainTextDigest();
        navigator.clipboard.writeText(plainText).then(() => {
            toast({
                title: "Copied to Clipboard!",
                description: "The digest has been copied as plain text.",
            });
        });
    };

    const handleCreateEmail = () => {
        const plainText = createPlainTextDigest();
        const subject = "My 9AM Job Digest";
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainText)}`;
        window.location.href = mailtoLink;
    };

    if (isLoading) {
        return (
            <div className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
                 <Sparkles className="h-16 w-16 text-slate-300 animate-pulse" />
            </div>
        )
    }

    if (!preferences.roleKeywords) {
        return (
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center justify-center">
                <div className="bg-slate-100 p-8 rounded-full">
                    <Settings className="h-16 w-16 text-slate-400" />
                </div>
                <h1 className="mt-8 text-2xl font-bold tracking-tight text-slate-900">
                    Set Preferences to Generate a Digest
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-base text-slate-500 leading-relaxed">
                    Your daily digest is personalized based on your job preferences. Please set them up first to continue.
                </p>
                <Link href="/settings">
                    <Button className="mt-6">
                        Go to Preferences
                    </Button>
                </Link>
            </main>
        );
    }
    
    if (!digest) {
        return (
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center justify-center">
                <div className="bg-slate-100 p-8 rounded-full">
                    <Mail className="h-16 w-16 text-slate-400" />
                </div>
                <h1 className="mt-8 text-2xl font-bold tracking-tight text-slate-900">
                    Your Digest is Ready to Generate
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-base text-slate-500 leading-relaxed">
                    Your daily job digest will be delivered here every morning at 9AM.
                </p>
                 <Button className="mt-8" size="lg" onClick={generateDigest}>
                    <Sparkles className="mr-2 h-4 w-4" /> Generate Today's 9AM Digest (Simulated)
                </Button>
                 <p className="mt-4 text-xs text-slate-400">
                    Demo Mode: Daily 9AM trigger simulated manually.
                </p>
            </main>
        );
    }

    if (digest.length === 0 && statusUpdates.length === 0) {
        return (
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center justify-center">
                 <div className="bg-slate-100 p-8 rounded-full">
                    <Mail className="h-16 w-16 text-slate-400" />
                </div>
                 <h1 className="mt-8 text-2xl font-bold tracking-tight text-slate-900">
                    No Matching Roles Today
                </h1>
                 <p className="mt-4 max-w-2xl mx-auto text-base text-slate-500 leading-relaxed">
                    We couldn't find any new roles that meet your criteria. Check again tomorrow or adjust your preferences.
                </p>
                <Link href="/settings">
                    <Button variant="outline" className="mt-6">
                        Adjust Preferences
                    </Button>
                </Link>
            </main>
        );
    }

    return (
        <main className="flex-grow bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            {digest.length > 0 && (
                <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8 sm:p-12">
                    <header className="text-center mb-10 border-b border-slate-100 pb-8">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Top 10 Jobs For You — 9AM Digest
                        </h1>
                        <p className="mt-2 text-base text-slate-500 font-medium">
                            {todayFormatted}
                        </p>
                    </header>

                    <div className="space-y-6">
                        {digest.map((job, index) => (
                            <div key={job.id} className="flex items-start gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                                <div className="text-2xl font-black text-slate-300 w-8 text-center shrink-0">
                                    {index + 1}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-bold text-slate-900 leading-tight">{job.title}</p>
                                    <p className="text-sm text-slate-500 font-medium">{job.company} • {job.location} • {job.experience} Exp</p>
                                    <div className="mt-2 text-xs font-bold text-blue-600">Match Score: {job.matchScore}%</div>
                                </div>
                                <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" className="ml-auto shrink-0">
                                        Apply
                                    </Button>
                                </a>
                            </div>
                        ))}
                    </div>

                    <footer className="mt-12 text-center border-t border-slate-100 pt-8">
                        <div className="flex justify-center gap-4 mb-4">
                            <Button variant="outline" onClick={handleCopyToClipboard}>
                                <Copy className="mr-2 h-4 w-4" /> Copy Digest
                            </Button>
                            <Button variant="outline" onClick={handleCreateEmail}>
                                <Send className="mr-2 h-4 w-4" /> Create Email Draft
                            </Button>
                        </div>
                        <p className="text-sm text-slate-400">
                            This digest was generated based on your preferences.
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                            Demo Mode: Daily 9AM trigger simulated manually.
                        </p>
                    </footer>
                </div>
            )}

            {statusUpdates.length > 0 && (
                 <div className={`max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8 sm:p-12 ${digest.length > 0 ? 'mt-12' : ''}`}>
                    <header className="text-center mb-10 border-b border-slate-100 pb-8">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Recent Status Updates
                        </h1>
                    </header>
                    <div className="space-y-4">
                        {statusUpdates.map(update => {
                            const statusConfig: { [key: string]: string } = {
                                'Applied': 'text-blue-700',
                                'Rejected': 'text-red-700',
                                'Selected': 'text-emerald-700',
                            };
                            return (
                                <div key={update.jobId + update.changedAt} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                                    <div>
                                        <p className="font-bold text-slate-900">{update.title}</p>
                                        <p className="text-sm text-slate-500">{update.company}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${statusConfig[update.status] || 'text-slate-700'}`}>{update.status}</p>
                                        <p className="text-xs text-slate-400">{formatDistanceToNowStrict(new Date(update.changedAt), { addSuffix: true })}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </main>
    );
}
