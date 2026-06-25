import React from 'react';
import { motion } from 'motion/react';

interface MetricCircleProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export default function MetricCircle({ score, size = 160, strokeWidth = 12 }: MetricCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine color based on score value
  let colorClass = 'stroke-red-500';
  let textClass = 'text-red-600';
  let bgClass = 'bg-red-50 text-red-700';
  let statusText = 'Needs Work';

  if (score >= 80) {
    colorClass = 'stroke-emerald-500';
    textClass = 'text-emerald-600';
    bgClass = 'bg-emerald-50 text-emerald-700';
    statusText = 'Excellent Match';
  } else if (score >= 60) {
    colorClass = 'stroke-amber-500';
    textClass = 'text-amber-600';
    bgClass = 'bg-amber-50 text-amber-700';
    statusText = 'Average Match';
  }

  return (
    <div id="metric-circle-container" className="flex flex-col items-center justify-center p-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background track circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-neutral-100 stroke-current"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Animated score circle */}
          <motion.circle
            className={`${colorClass} stroke-current`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl font-extrabold tracking-tight text-neutral-900"
          >
            {score}
          </motion.span>
          <span className="text-xs text-neutral-400 font-medium tracking-wider uppercase mt-0.5">ATS SCORE</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`mt-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${bgClass}`}
      >
        {statusText}
      </motion.div>
    </div>
  );
}
