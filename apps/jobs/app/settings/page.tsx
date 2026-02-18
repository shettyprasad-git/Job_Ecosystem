'use client';

import React from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Preferences } from '@/lib/types';
import { allLocations, allModes, allExperienceLevels } from '@/lib/jobs';
import { Sliders, CheckCircle2 } from 'lucide-react';

const defaultPreferences: Preferences = {
  roleKeywords: "",
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: "All",
  skills: "",
  minMatchScore: 40
};

export default function SettingsPage() {
  const [preferences, setPreferences] = useLocalStorage<Preferences>('jobTrackerPreferences', defaultPreferences);

  const savePreferences = (newPrefs: Partial<Preferences>) => {
    setPreferences(prev => ({...prev, ...newPrefs}));
  };

  const toggleLocation = (loc: string) => {
    const next = preferences.preferredLocations.includes(loc)
      ? preferences.preferredLocations.filter(l => l !== loc)
      : [...preferences.preferredLocations, loc];
    savePreferences({ preferredLocations: next });
  };
  
  const toggleMode = (mode: string) => {
     const next = preferences.preferredMode.includes(mode)
      ? preferences.preferredMode.filter(m => m !== mode)
      : [...preferences.preferredMode, mode];
    savePreferences({ preferredMode: next });
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Sliders size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Job Preferences</h1>
            <p className="text-slate-500 text-sm">Fine-tune your automated matching engine</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Role Keywords (comma-separated)</label>
            <input 
              type="text" value={preferences.roleKeywords} 
              onChange={(e) => savePreferences({roleKeywords: e.target.value})}
              placeholder="e.g. Frontend, React, SDE, Intern"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Preferred Locations</label>
            <div className="flex flex-wrap gap-2">
              {allLocations.map(loc => (
                <button 
                  key={loc}
                  onClick={() => toggleLocation(loc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    preferences.preferredLocations.includes(loc) 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Work Mode</label>
            <div className="flex gap-4">
              {allModes.map(mode => (
                <label key={mode} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" checked={preferences.preferredMode.includes(mode)}
                    onChange={() => toggleMode(mode)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-bold text-slate-700">{mode}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Experience Level</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
              value={preferences.experienceLevel}
              onChange={(e) => savePreferences({experienceLevel: e.target.value})}
            >
              <option value="All">Any</option>
              {allExperienceLevels.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Specific Skills (comma-separated)</label>
            <input 
              type="text" value={preferences.skills} 
              onChange={(e) => savePreferences({skills: e.target.value})}
              placeholder="e.g. React, Node, AWS, Python"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Min Match Threshold</label>
              <span className="text-lg font-black text-blue-600">{preferences.minMatchScore}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={preferences.minMatchScore}
              onChange={(e) => savePreferences({minMatchScore: parseInt(e.target.value)})}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[10px] text-slate-400 mt-2 font-medium italic">Only jobs meeting this score will appear when "Show only matches" is active.</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="text-emerald-500" size={20} />
            <p className="text-sm font-bold text-emerald-800">Your preferences are automatically saved.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
