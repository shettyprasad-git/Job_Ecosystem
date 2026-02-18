'use client';

import React, { useState, useMemo } from 'react';
import { JobCard } from '@/components/job-tracker/job-card';
import { ViewJobModal } from '@/components/job-tracker/view-job-modal';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { jobs, allLocations, allModes, allExperienceLevels, allSources } from '@/lib/jobs';
import { calculateMatchScore, extractSalaryValue } from '@/lib/utils';
import type { Job, JobWithScore, Preferences, JobStatus, JobStatusMap, StatusUpdate } from '@/lib/types';
import { Search, AlertCircle } from 'lucide-react';
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

const allStatuses: (JobStatus | 'All')[] = ['All', 'Not Applied', 'Applied', 'Selected', 'Rejected'];

export default function DashboardPage() {
  const [savedJobs, setSavedJobs] = useLocalStorage<string[]>('kodnest_saved_jobs', []);
  const [selectedJob, setSelectedJob] = useState<JobWithScore | null>(null);
  const [showOnlyMatches, setShowOnlyMatches] = useState(false);
  
  const [preferences] = useLocalStorage<Preferences>('jobTrackerPreferences', defaultPreferences);

  // Status tracking state
  const [jobStatus, setJobStatus] = useLocalStorage<JobStatusMap>('jobTrackerStatus', {});
  const [statusUpdates, setStatusUpdates] = useLocalStorage<StatusUpdate[]>('jobTrackerStatusUpdates', []);
  const { toast } = useToast();

  // Filter States
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");
  const [expFilter, setExpFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'All'>("All");
  const [sortOrder, setSortOrder] = useState("Latest");

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
  
  const filteredJobs = useMemo(() => {
    let result: JobWithScore[] = jobs.map(job => ({
      ...job,
      matchScore: calculateMatchScore(job, preferences)
    }));

    // Filter Logic
    result = result.filter(job => {
      const lowerSearch = search.toLowerCase();
      const matchesSearch = search === "" || 
                          job.title.toLowerCase().includes(lowerSearch) || 
                          job.company.toLowerCase().includes(lowerSearch) ||
                          job.skills.some(skill => skill.toLowerCase().includes(lowerSearch));
      const matchesLoc = locationFilter === "All" || job.location === locationFilter;
      const matchesMode = modeFilter === "All" || job.mode === modeFilter;
      const matchesExp = expFilter === "All" || job.experience === expFilter;
      const matchesSrc = sourceFilter === "All" || job.source === sourceFilter;
      const matchesThreshold = !showOnlyMatches || job.matchScore >= preferences.minMatchScore;
      const currentStatus = jobStatus[job.id] || 'Not Applied';
      const matchesStatus = statusFilter === 'All' || currentStatus === statusFilter;
      
      return matchesSearch && matchesLoc && matchesMode && matchesExp && matchesSrc && matchesThreshold && matchesStatus;
    });

    // Sorting
    if (sortOrder === "Latest") {
      result.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    } else if (sortOrder === "Oldest") {
      result.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
    } else if (sortOrder === "MatchScore") {
      result.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortOrder === "Salary") {
      result.sort((a, b) => extractSalaryValue(b.salaryRange) - extractSalaryValue(a.salaryRange));
    }

    return result;
  }, [search, locationFilter, modeFilter, expFilter, sourceFilter, statusFilter, sortOrder, preferences, showOnlyMatches, jobStatus]);

  const toggleSave = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setLocationFilter("All");
    setModeFilter("All");
    setExpFilter("All");
    setSourceFilter("All");
    setStatusFilter("All");
    setShowOnlyMatches(false);
    setSortOrder("Latest");
  }

  return (
    <>
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          {!preferences.roleKeywords && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 p-3 rounded-xl">
              <AlertCircle className="text-blue-500" size={20} />
              <p className="text-sm font-semibold text-blue-800">Set your preferences to activate intelligent matching.</p>
              <Link href="/settings" className="ml-auto text-xs font-black uppercase text-blue-600 hover:underline whitespace-nowrap">Go to Settings</Link>
            </div>
          )}
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role, company, or keywords..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold outline-none cursor-pointer" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              <option value="All">All Locations</option>
              {allLocations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold outline-none cursor-pointer" value={modeFilter} onChange={(e) => setModeFilter(e.target.value)}>
              <option value="All">All Modes</option>
              {allModes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold outline-none cursor-pointer" value={expFilter} onChange={(e) => setExpFilter(e.target.value)}>
              <option value="All">All Experience</option>
              {allExperienceLevels.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
             <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold outline-none cursor-pointer" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
              <option value="All">All Sources</option>
              {allSources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold outline-none cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as (JobStatus | 'All'))}>
              {allStatuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
            </select>

            <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

            <label className="flex items-center gap-2 cursor-pointer group" onClick={() => setShowOnlyMatches(v => !v)}>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${showOnlyMatches ? 'bg-blue-600' : 'bg-slate-200'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showOnlyMatches ? 'left-6' : 'left-1'}`} />
              </div>
              <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">Only show jobs above my threshold</span>
            </label>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 ml-auto">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort By</span>
              <select className="bg-transparent text-sm font-bold outline-none text-slate-700 cursor-pointer" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="Latest">Latest</option>
                <option value="MatchScore">Match Score</option>
                <option value="Salary">Salary (High)</option>
                <option value="Oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Market Discoveries</h1>
              <p className="text-slate-500 font-medium">Tracking {filteredJobs.length} potential matches for your profile</p>
            </div>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  savedJobs={savedJobs} 
                  onSaveToggle={toggleSave} 
                  onOpenModal={setSelectedJob}
                  status={jobStatus[job.id] || 'Not Applied'}
                  onStatusChange={handleStatusChange} 
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center bg-white border border-slate-200 rounded-3xl p-10">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No roles match your criteria</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your filters, lowering your match threshold, or updating your preferences.</p>
              <button 
                 onClick={resetFilters}
                 className="mt-6 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
              >
                Reset Dashboard
              </button>
            </div>
          )}
      </main>

      {selectedJob && (
        <ViewJobModal 
          job={selectedJob} 
          isOpen={!!selectedJob} 
          onClose={() => setSelectedJob(null)}
          savedJobs={savedJobs}
          onSaveToggle={toggleSave}
          status={jobStatus[selectedJob.id] || 'Not Applied'}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
}
