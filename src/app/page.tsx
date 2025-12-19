'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, History, Trash2, Droplets, ArrowRight, Save, RefreshCw } from 'lucide-react';
import { useDosageCalculator } from '@/hooks/use-dosage-calculator';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Home() {
  const {
    values,
    result,
    history,
    isLoaded,
    setStandardAmount,
    setStandardVolume,
    setTargetVolume,
    addToHistory,
    clearHistory,
    deleteHistoryItem
  } = useDosageCalculator();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePositiveInput = (value: string, setter: (val: string) => void) => {
    if (value === '' || parseFloat(value) >= 0) {
      setter(value);
    }
  };

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading Liquid Interface...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center gap-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 pt-8"
      >
        <div className="relative inline-flex mb-4 rounded-full ring-1 ring-primary/20 overflow-hidden shadow-lg shadow-primary/10">
          <Image 
            src="/logo-1.png" 
            alt="Dosage Converter Logo" 
            width={80} 
            height={80} 
            className="w-16 h-16 md:w-20 md:h-20 object-cover"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-400 to-emerald-400 drop-shadow-sm">
          ใช้เท่าไหร่ดี? 
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          เครื่องมือคำนวณปริมาณสารละลายสำหรับเกษตรกรที่ต้องการความแม่นยำสูง
        </p>
      </motion.header>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Calculator Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="space-y-8 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <Beaker className="w-5 h-5" />
                  <h2>Standard Ratio (อัตราส่วนข้างขวด)</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground ml-1">Amount (cc/ml)</label>
                    <Input 
                      type="number" 
                      min="0"
                      placeholder="200" 
                      value={values.standardAmount}
                      onChange={(e) => handlePositiveInput(e.target.value, setStandardAmount)}
                      className="text-lg font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground ml-1">Volume (L)</label>
                    <Input 
                      type="number" 
                      min="0"
                      placeholder="200" 
                      value={values.standardVolume}
                      onChange={(e) => handlePositiveInput(e.target.value, setStandardVolume)}
                      className="text-lg font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center text-muted-foreground/50">
                <ArrowRight className="w-6 h-6 rotate-90 lg:rotate-0" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <RefreshCw className="w-5 h-5" />
                  <h2>Target Volume (ขนาดถังของคุณ)</h2>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground ml-1">Volume (L)</label>
                  <Input 
                    type="number" 
                    min="0"
                    placeholder="10" 
                    value={values.targetVolume}
                    onChange={(e) => handlePositiveInput(e.target.value, setTargetVolume)}
                    className="text-lg font-medium"
                  />
                </div>
              </div>

              {/* Result Display */}
              <AnimatePresence mode="wait">
                {result !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="pt-6"
                  >
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-teal-400/20 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl" />
                      <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-md">
                        <p className="text-sm text-muted-foreground mb-1">Required Dosage</p>
                        <div className="text-5xl font-bold text-primary tracking-tight">
                          {result.toFixed(2)} <span className="text-2xl text-muted-foreground font-normal">cc</span>
                        </div>
                        <Button 
                          variant="liquid" 
                          className="mt-4 w-full"
                          onClick={addToHistory}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save to History
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </motion.div>

        {/* History Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="h-full"
        >
          <GlassCard className="h-full min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-primary font-medium">
                <History className="w-5 h-5" />
                <h2>History</h2>
              </div>
              {history.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearHistory}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  Clear All
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              <AnimatePresence initial={false}>
                {history.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-muted-foreground/50 gap-4 p-8 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                        <History className="w-8 h-8 opacity-20" />
                    </div>
                    <div>
                        <p className="font-medium text-foreground/80">No History Yet</p>
                        <p className="text-sm">Calculations you save will appear here.</p>
                    </div>
                  </motion.div>
                ) : (
                  history.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                      className="group relative bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="bg-white/5 px-2 py-0.5 rounded text-muted-foreground">
                              {item.standardAmount}cc / {item.standardVolume}L
                            </span>
                            <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
                            <span className="text-foreground font-medium">
                              {item.targetVolume}L
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">
                            {item.result.toFixed(2)}
                            <span className="text-xs font-normal text-muted-foreground ml-1">cc</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-destructive/10 rounded-lg text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
