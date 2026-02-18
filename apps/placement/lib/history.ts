'use client';
import { AnalysisResult } from './types';

const HISTORY_KEY = 'analysisHistory';

export function getHistory(): AnalysisResult[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Failed to parse history from localStorage', error);
    return [];
  }
}

export function saveAnalysis(result: AnalysisResult): void {
  if (typeof window === 'undefined') {
    return;
  }
  const history = getHistory();
  const newHistory = [result, ...history];
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Failed to save analysis to localStorage', error);
  }
}

export function getAnalysis(id: string): AnalysisResult | undefined {
  const history = getHistory();
  return history.find(item => item.id === id);
}

export function updateAnalysis(updatedResult: AnalysisResult): void {
    if (typeof window === 'undefined') {
        return;
    }
    const history = getHistory();
    const index = history.findIndex(item => item.id === updatedResult.id);
    if (index !== -1) {
        history[index] = updatedResult;
        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch (error) {
            console.error('Failed to update analysis in localStorage', error);
        }
    }
}
