import { useState, useEffect } from 'react';

export interface DosageState {
  standardAmount: string; // Keep as string for input handling
  standardVolume: string;
  targetVolume: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  standardAmount: number;
  standardVolume: number;
  targetVolume: number;
  result: number;
}

const STORAGE_KEY = 'dosage-converter-storage';

export function useDosageCalculator() {
  const [values, setValues] = useState<DosageState>({
    standardAmount: '',
    standardVolume: '',
    targetVolume: '',
  });

  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.lastInput) {
          setValues(parsed.lastInput);
        }
        if (parsed.history) {
          setHistory(parsed.history);
        }
      } catch (e) {
        console.error('Failed to parse local storage', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever values or history change
  useEffect(() => {
    if (!isLoaded) return;

    const data = {
      lastInput: values,
      history,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [values, history, isLoaded]);

  // Calculate result whenever inputs change
  useEffect(() => {
    const stdAmount = parseFloat(values.standardAmount);
    const stdVolume = parseFloat(values.standardVolume);
    const targetVol = parseFloat(values.targetVolume);

    if (
      !isNaN(stdAmount) &&
      !isNaN(stdVolume) &&
      !isNaN(targetVol) &&
      stdVolume !== 0
    ) {
      // Formula: (Standard Amount / Standard Volume) * Target Volume
      const calculated = (stdAmount / stdVolume) * targetVol;
      setResult(calculated);
    } else {
      setResult(null);
    }
  }, [values]);

  const setStandardAmount = (val: string) =>
    setValues((prev) => ({ ...prev, standardAmount: val }));
  const setStandardVolume = (val: string) =>
    setValues((prev) => ({ ...prev, standardVolume: val }));
  const setTargetVolume = (val: string) =>
    setValues((prev) => ({ ...prev, targetVolume: val }));

  const addToHistory = () => {
    if (result === null) return;

    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      standardAmount: parseFloat(values.standardAmount),
      standardVolume: parseFloat(values.standardVolume),
      targetVolume: parseFloat(values.targetVolume),
      result,
    };

    setHistory((prev) => [newItem, ...prev]);
  };

  const clearHistory = () => setHistory([]);
  
  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    values,
    result,
    history,
    isLoaded,
    setStandardAmount,
    setStandardVolume,
    setTargetVolume,
    addToHistory,
    clearHistory,
    deleteHistoryItem,
  };
}
