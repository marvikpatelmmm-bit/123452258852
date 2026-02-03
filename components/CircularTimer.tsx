import React from 'react';

interface CircularTimerProps {
  elapsedSeconds: number;
  totalSeconds: number;
  color: string;
  isActive: boolean;
  subject: string;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({ 
  elapsedSeconds, 
  totalSeconds, 
  color,
  isActive,
  subject
}) => {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
  const progress = totalSeconds > 0 ? elapsedSeconds / totalSeconds : 0;
  const strokeDashoffset = circumference - progress * circumference;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s linear' }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-mono font-bold" style={{ color: isActive ? color : '#666' }}>
          {formatTime(remainingSeconds)}
        </span>
        <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{subject}</span>
        {isActive && <div className="mt-2 w-2 h-2 rounded-full bg-red-500 animate-ping" />}
      </div>
    </div>
  );
};