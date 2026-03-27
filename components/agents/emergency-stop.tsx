'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Power } from 'lucide-react';
import { useDashboardStore } from '@/lib/store';

export function EmergencyStop() {
  const { emergencyStop } = useDashboardStore();
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const handleEmergencyStop = () => {
    setIsEmergencyActive(true);
    emergencyStop();
    setTimeout(() => setIsEmergencyActive(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="space-y-4"
    >
      <div className="relative overflow-hidden rounded-2xl p-8 glass neon-glow">
        {/* Animated neon glow effect */}
        <motion.div
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-red-500/30 to-transparent rounded-full blur-3xl"
          animate={{
            scale: isEmergencyActive ? [1, 1.3, 1] : 1,
            opacity: isEmergencyActive ? [0.5, 1, 0.5] : 0.3,
          }}
          transition={{
            repeat: isEmergencyActive ? Infinity : 0,
            duration: 0.8,
          }}
        />

        <motion.button
          onClick={handleEmergencyStop}
          className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-red-500 border border-red-600 py-4 transition-all"
          whileHover={{
            scale: 1.02,
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
          }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-transparent"
            animate={{
              opacity: isEmergencyActive ? [0.3, 0.8, 0.3] : [0.2, 0.4],
            }}
            transition={{
              repeat: isEmergencyActive ? Infinity : 0,
              duration: 0.8,
            }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center gap-2">
            <motion.div
              animate={isEmergencyActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: isEmergencyActive ? Infinity : 0, duration: 0.6 }}
            >
              <Power className="w-6 h-6 text-red-100" />
            </motion.div>
            <span className="text-sm font-bold text-red-100 tracking-wide">EMERGENCY STOP</span>
          </div>
        </motion.button>
      </div>

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        Immediately halt all automation
      </p>
    </motion.div>
  );
}
