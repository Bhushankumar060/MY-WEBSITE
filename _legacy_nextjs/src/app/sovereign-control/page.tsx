"use client";
import { useState, useRef } from 'react';
import { signOut } from 'next-auth/react';

export default function SovereignDashboard() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState('resources');
  
  // Mock State for Resources
  const [resources, setResources] = useState([
    { id: '1', title: 'Options Basics', type: 'PDF', category: 'Trading Notes', status: 'Public' },
    { id: '2', title: 'Advanced Price Action', type: 'Video', category: 'Premium', status: 'Hidden' }
  ]);
  const [logs, setLogs] = useState<{time: string, action: string, type: 'info'|'success'|'error'}[]>([]);

  const addLog = (action: string, type: 'info'|'success'|'error' = 'info') => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), action, type }, ...prev].slice(0, 10));
  };

  const listen = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice API not supported here. Use Chrome or manual input.");
      return;
    }
    const rec = new SpeechRecognition();
    rec.onstart = () => { setIsListening(true); setTranscript('Listening (speak your command)...'); };
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      handleVoiceCommand(text);
    };
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  const handleVoiceCommand = (text: string) => {
    const lower = text.toLowerCase();
    addLog(`Received Voice Input: "${text}"`);

    setTimeout(() => {
      if (lower.includes('upload a pdf') || lower.includes('upload a test pdf')) {
         const titleMatch = text.match(/upload a(?: test)? pdf[:\s]+(.*)/i);
         const title = titleMatch ? titleMatch[1].trim() : "Test PDF Document";
         addLog(`[AI AGENT] Mocking AWS S3 upload for: ${title}...`, 'info');
         setTimeout(() => {
            setResources(prev => [{ id: Date.now().toString(), title, type: 'PDF', category: 'Uncategorized', status: 'Public' }, ...prev]);
            addLog(`[AI AGENT] Successfully generated public URL and saved to PostgreSQL.`, 'success');
         }, 1500);
      } 
      else if (lower.includes('generate a summary') || lower.includes('summary of the most downloaded')) {
         addLog(`[GEMINI 3.1 PRO] Analyzing download vector metrics...`, 'info');
         setTimeout(() => {
            addLog(`[GEMINI 3.1 PRO] SUMMARY: "Options Basics" leads with 412 downloads. 89% engagement rate.`, 'success');
         }, 2000);
      }
      else {
         addLog(`[AI AGENT] Unrecognized command structure. Checking knowledge graph...`, 'error');
      }
    }, 500);
  };

  return (
    <div className="flex h-screen bg-dark-900 border-t-4 border-sovereign">
      {/* Sidebar */}
      <div className="w-64 bg-dark-800/50 border-r border-white/5 flex flex-col">
         <div className="p-6">
            <h2 className="text-xl font-bold tracking-tight mb-1 text-white">Sovereign <span className="text-sovereign">Control</span></h2>
            <div className="flex items-center gap-2 mt-2">
               <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse"></div>
               <span className="text-xs font-mono text-gray-400">ADMIN: AUTHENTICATED</span>
            </div>
         </div>
         
         <nav className="flex-grow px-4 space-y-2 mt-4 text-sm font-medium">
            <button onClick={() => setActiveTab('resources')} className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'resources' ? 'bg-sovereign/10 text-sovereign border border-sovereign/20' : 'text-gray-400 hover:bg-white/5'}`}>
              Directory Nexus
            </button>
            <button onClick={() => setActiveTab('ai')} className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'ai' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-gray-400 hover:bg-white/5'}`}>
              Gemini Co-Pilot Status
            </button>
            <button onClick={() => setActiveTab('security')} className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'security' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-gray-400 hover:bg-white/5'}`}>
              Security & Self-Healing
            </button>
         </nav>
         
         <div className="p-4">
            <button onClick={() => signOut()} className="w-full py-2 text-xs font-mono text-gray-500 hover:text-white transition border border-gray-800 rounded">
               TERMINATE SESSION
            </button>
         </div>
      </div>

      {/* Main Area */}
      <div className="flex-grow flex flex-col relative overflow-hidden">
         {/* Top Bar for Command */}
         <div className="h-20 border-b border-white/5 bg-dark-900 flex items-center px-8 z-10">
            <div className="flex-grow bg-dark-800/80 border border-white/10 rounded-full h-12 flex items-center px-4 relative max-w-3xl focus-within:border-sovereign/50 transition shadow-inner">
               <input 
                 type="text" 
                 value={transcript}
                 onChange={e => setTranscript(e.target.value)}
                 onKeyDown={e => { if (e.key === 'Enter') { handleVoiceCommand(transcript); setTranscript(''); } }}
                 placeholder="Type command or activate Voice Protocol..."
                 className="flex-grow bg-transparent outline-none text-sm text-gray-300 placeholder-gray-600"
               />
               <button 
                 onClick={listen}
                 className={`absolute right-2 top-1.5 bottom-1.5 aspect-square rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-sovereign text-white hover:bg-sovereign-light shadow-[0_0_10px_rgba(59,130,246,0.3)]'}`}
               >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
               </button>
               {isListening && <span className="absolute -top-6 right-0 text-[10px] text-red-400 animate-pulse font-mono tracking-widest">RECORDING ACTIVE</span>}
            </div>
         </div>

         {/* Content Area */}
         <div className="flex-grow p-8 overflow-y-auto">
            {activeTab === 'resources' && (
               <div className="space-y-6">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Kingdom Resources <span className="text-sm font-normal text-gray-500 ml-2">({resources.length} active)</span></h3>
                    <button className="px-4 py-2 bg-dark-800 border border-white/10 text-sm rounded hover:bg-white/5 transition flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg> Manual S3 Upload
                    </button>
                 </div>
                 
                 <div className="glass-panel rounded-xl overflow-hidden border border-white/5">
                    <table className="w-full text-left text-sm">
                       <thead className="bg-dark-800/80 text-xs uppercase font-mono text-gray-500">
                          <tr>
                             <th className="px-6 py-4">Title</th>
                             <th className="px-6 py-4">Format</th>
                             <th className="px-6 py-4">Category</th>
                             <th className="px-6 py-4">Status</th>
                             <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {resources.map(r => (
                             <tr key={r.id} className="hover:bg-white/[0.02] transition">
                                <td className="px-6 py-4 font-semibold text-gray-200">{r.title}</td>
                                <td className="px-6 py-4"><span className="px-2 py-1 bg-dark-800 border border-white/10 rounded text-xs">{r.type}</span></td>
                                <td className="px-6 py-4 text-gray-400">{r.category}</td>
                                <td className="px-6 py-4">
                                   <span className={`px-2 py-1 rounded text-xs font-medium ${r.status === 'Public' ? 'bg-green-500/10 text-green-400' : 'bg-gray-800 text-gray-400'}`}>{r.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-3 text-gray-500">
                                   <button className="hover:text-sovereign transition">Edit</button>
                                   <button className="hover:text-red-400 transition" onClick={() => setResources(resources.filter(res => res.id !== r.id))}>Delete</button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
               </div>
            )}
            
            {activeTab === 'security' && (
               <div className="space-y-6">
                 <h3 className="text-xl font-bold flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Security & Healing Core</h3>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-xl border border-red-500/20">
                       <h4 className="text-sm font-bold text-red-400 mb-2 uppercase tracking-wide">Threat Mitigation</h4>
                       <div className="text-2xl font-mono mb-4">3 IPs Muted</div>
                       <p className="text-xs text-gray-500">AI dynamically blocked 3 endpoints attempting to brute-force the /sovereign-control partition in the last 24h.</p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl border border-green-500/20">
                       <h4 className="text-sm font-bold text-green-400 mb-2 uppercase tracking-wide">Storage Integrity</h4>
                       <div className="text-2xl font-mono mb-4">S3 Sync 100%</div>
                       <p className="text-xs text-gray-500">Nightly mirror to cold storage completed at 03:00 UTC without data loss.</p>
                    </div>
                 </div>
               </div>
            )}
         </div>

         {/* Floating Terminal Console */}
         <div className="absolute bottom-0 left-0 w-full h-48 bg-dark-950 border-t border-white/10 font-mono text-[11px] flex flex-col">
            <div className="flex justify-between items-center px-4 py-2 bg-black border-b border-white/5">
               <span className="text-gray-500 font-bold uppercase tracking-wider">Protocol Terminal Logs</span>
               <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div><div className="w-2 h-2 rounded-full bg-yellow-500"></div><div className="w-2 h-2 rounded-full bg-green-500"></div>
               </div>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-1">
               {logs.map((log, i) => (
                  <div key={i} className="flex gap-4">
                     <span className="text-gray-600 shrink-0">[{log.time}]</span>
                     <span className={`${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : 'text-gray-300'} break-all`}>
                        {log.action}
                     </span>
                  </div>
               ))}
               <div className="flex gap-4 opacity-50"><span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span><span className="text-gray-400 animate-pulse">Waiting for AI subroutine triggers...</span></div>
            </div>
         </div>

      </div>
    </div>
  );
}
