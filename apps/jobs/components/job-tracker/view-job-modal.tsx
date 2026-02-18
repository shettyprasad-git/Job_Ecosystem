'use client';

import { X, ExternalLink, Bookmark, Building } from 'lucide-react';
import type { Job, JobWithScore, JobStatus } from '@/lib/types';
import { StatusDropdown } from './status-dropdown';

type ViewJobModalProps = {
  isOpen: boolean;
  onClose: () => void;
  job: JobWithScore;
  savedJobs: string[];
  onSaveToggle: (jobId: string) => void;
  status: JobStatus;
  onStatusChange: (job: Job, newStatus: JobStatus) => void;
};

export function ViewJobModal({ isOpen, onClose, job, savedJobs, onSaveToggle, status, onStatusChange }: ViewJobModalProps) {
  if (!isOpen) return null;

  const isSaved = savedJobs.includes(job.id);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="sticky top-0 bg-white/90 backdrop-blur-md px-8 py-6 border-b border-slate-100 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold shrink-0">
              {job.company.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-slate-900">{job.title}</h2>
              <p className="text-sm text-slate-500 flex items-center gap-1.5"><Building size={14} />{job.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full absolute top-4 right-4"><X size={24} /></button>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <div className="text-center">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Match</p>
                <p className="text-2xl font-black text-blue-700">{job.matchScore}%</p>
              </div>
              <div className="h-full w-px bg-blue-200"></div>
              <p className="text-xs text-blue-800 font-medium leading-relaxed">This score is calculated based on your keywords, location preferences, work mode, and skills overlap.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Location</p><p className="text-xs font-bold text-slate-700">{job.location}</p></div>
            <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Mode</p><p className="text-xs font-bold text-slate-700">{job.mode}</p></div>
            <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Exp</p><p className="text-xs font-bold text-slate-700">{job.experience}</p></div>
            <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Salary</p><p className="text-xs font-bold text-slate-700">{job.salaryRange}</p></div>
          </div>
          <div className="mb-8">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map(s => <span key={s} className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg uppercase">{s}</span>)}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">About the Role</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>
          <div className="flex gap-4">
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-600 text-white py-4 font-black uppercase text-xs rounded-2xl hover:bg-blue-700 shadow-lg flex items-center justify-center gap-2 transition-colors">Apply Now <ExternalLink size={16} /></a>
            <div className="flex-shrink-0">
              <StatusDropdown status={status} onStatusChange={(newStatus) => onStatusChange(job, newStatus)} />
            </div>
            <button onClick={() => onSaveToggle(job.id)} className={`px-6 rounded-2xl font-black uppercase text-xs transition-all ${isSaved ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
