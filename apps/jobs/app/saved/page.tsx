'use client';

import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { jobs } from '@/lib/jobs';
import { calculateMatchScore } from '@/lib/utils';
import type { Job, JobWithScore, Preferences, JobStatus, JobStatusMap, StatusUpdate } from '@/lib/types';
import { JobCard } from '@/components/job-tracker/job-card';
import { ViewJobModal } from '@/components/job-tracker/view-job-modal';
import { Bookmark } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const defaultPreferences: Preferences = {
  roleKeywords: "",
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: "All",
  skills: "",
  minMatchScore: 40
};

export default function SavedPage() {
  const [savedJobIds, setSavedJobIds] = useLocalStorage<string[]>('kodnest_saved_jobs', []);
  const [selectedJob, setSelectedJob] = useState<JobWithScore | null>(null);
  const [preferences] = useLocalStorage<Preferences>('jobTrackerPreferences', defaultPreferences);
  
  const [jobStatus, setJobStatus] = useLocalStorage<JobStatusMap>('jobTrackerStatus', {});
  const [statusUpdates, setStatusUpdates] = useLocalStorage<StatusUpdate[]>('jobTrackerStatusUpdates', []);
  const { toast } = useToast();

  const handleStatusChange = (job: Job, newStatus: JobStatus) => {
    setJobStatus(prev => ({...prev, [job.id]: newStatus}));

    if (newStatus !== 'Not Applied') {
      const newUpdate: StatusUpdate = {
          jobId: job.id,
          title: job.title,
          company: job.company,
          status: newStatus,
          changedAt: new Date().toISOString(),
      };
      setStatusUpdates(prev => [newUpdate, ...prev].slice(0, 20));
    }
    
    toast({
        title: "Status updated",
        description: `Job status changed to "${newStatus}".`,
    });
  };

  const savedJobsData = useMemo(() => {
    return jobs
      .filter(job => savedJobIds.includes(job.id))
      .map(job => ({
        ...job,
        matchScore: calculateMatchScore(job, preferences)
      }));
  }, [savedJobIds, preferences]);

  const toggleSave = (jobId: string) => {
    setSavedJobIds(prev => 
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };
  
  return (
    <>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Saved Opportunities</h1>
        {savedJobsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobsData.map(job => (
              <JobCard 
                key={job.id} 
                job={job}
                savedJobs={savedJobIds}
                onSaveToggle={toggleSave}
                onOpenModal={setSelectedJob}
                status={jobStatus[job.id] || 'Not Applied'}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white border border-slate-200 rounded-3xl">
            <Bookmark size={40} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">Your shortlist is empty</h3>
             <p className="text-slate-500 mt-2">Browse the dashboard to save jobs you're interested in.</p>
            <Link href="/dashboard" className="mt-4 text-blue-600 font-bold hover:underline inline-block">
              Explore Jobs
            </Link>
          </div>
        )}
      </main>

       {selectedJob && (
        <ViewJobModal 
          job={selectedJob} 
          isOpen={!!selectedJob} 
          onClose={() => setSelectedJob(null)}
          savedJobs={savedJobIds}
          onSaveToggle={toggleSave}
          status={jobStatus[selectedJob.id] || 'Not Applied'}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
}
