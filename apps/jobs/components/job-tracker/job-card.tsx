'use client';

import type { Job, JobWithScore, JobStatus } from "@/lib/types";
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  Bookmark, 
  ExternalLink, 
  Eye
} from 'lucide-react';
import { formatPostedDate } from "@/lib/utils";
import { StatusDropdown } from "./status-dropdown";

type ScoreBadgeProps = {
  score: number;
};

const ScoreBadge = ({ score }: ScoreBadgeProps) => {
  const getColor = () => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (score >= 60) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (score >= 40) return 'bg-slate-100 text-slate-700 border-slate-200';
    return 'bg-slate-50 text-slate-400 border-slate-100';
  };

  return (
    <div className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${getColor()} flex items-center gap-1`}>
      {score}% MATCH
    </div>
  );
};


type JobCardProps = {
  job: JobWithScore;
  savedJobs: string[];
  onSaveToggle: (jobId: string) => void;
  onOpenModal: (job: JobWithScore) => void;
  status: JobStatus;
  onStatusChange: (job: Job, newStatus: JobStatus) => void;
};

export function JobCard({ job, savedJobs, onSaveToggle, onOpenModal, status, onStatusChange }: JobCardProps) {
  const isSaved = savedJobs.includes(job.id);
  
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
            {job.company.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <h3 className="font-bold text-slate-900 leading-tight group-hover:text-blue-700">{job.title}</h3>
               <ScoreBadge score={job.matchScore} />
            </div>
            <p className="text-sm text-slate-500 font-medium">{job.company}</p>
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onSaveToggle(job.id); }}
          className={`p-2 rounded-full transition-colors ${isSaved ? 'text-blue-600 bg-blue-50' : 'text-slate-300 hover:bg-slate-50 hover:text-slate-500'}`}
        >
          <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded-md border border-slate-100">
          <MapPin size={14} /> {job.location} ({job.mode})
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded-md border border-slate-100">
          <Briefcase size={14} /> {job.experience} Exp
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md border border-blue-100">
          {job.salaryRange}
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <StatusDropdown status={status} onStatusChange={(newStatus) => onStatusChange(job, newStatus)} />
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock size={12} /> {formatPostedDate(job.postedDaysAgo)}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); onOpenModal(job); }} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye size={18} /></button>
          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all shadow-sm">Apply <ExternalLink size={14} /></a>
        </div>
      </div>
    </div>
  );
}
