import React, { useEffect, useRef } from 'react';

interface TerminalOutputProps {
  logs: string[];
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full bg-cyber-900 border border-cyber-600 rounded-lg p-4 font-mono text-sm h-48 overflow-y-auto shadow-inner relative" ref={scrollRef}>
       <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
      {logs.map((log, index) => (
        <div key={index} className="text-neon-blue mb-1 flex items-start">
          <span className="mr-2 text-cyber-400">➜</span>
          <span className="break-all animate-pulse-slow">{log}</span>
        </div>
      ))}
      <div className="animate-pulse text-neon-green">_</div>
    </div>
  );
};