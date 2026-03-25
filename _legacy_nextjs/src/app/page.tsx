import Link from 'next/link';

export default function PublicKingdom() {
  const publicResources = [
    { id: '1', title: 'Macroeconomics for Traders', type: 'PDF', category: 'Trading Notes', description: 'A comprehensive 50-page guide on inflation, yield curves, and market impact.', price: null, downloads: 1420 },
    { id: '2', title: 'Volume Profile Masterclass', type: 'Video', category: 'Premium Course', description: '4-hour video deep dive into identifying institutional support zones.', price: 149.99, downloads: 85 },
    { id: '3', title: 'Elliott Wave Cheat Sheet', type: 'Image', category: 'Quick Reference', description: 'High-res structural maps of motive and corrective waves.', price: null, downloads: 3004 },
    { id: '4', title: 'Prop Firm Passing Strategy', type: 'Bundle', category: 'Trading Notes', description: 'Mechanical ruleset with a 65% win rate over 500 backtested trades.', price: 49.99, downloads: 412 },
  ];

  return (
    <main className="min-h-screen bg-dark-900 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-sovereign/20 bg-dark-950 pb-20 pt-32 text-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sovereign/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sovereign/10 border border-sovereign/30 text-sovereign text-xs font-mono font-bold tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-sovereign animate-pulse"></span> PUBLIC VAULT ACTIVE
           </div>
           <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
              The Sovereign <span className="text-transparent bg-clip-text bg-gradient-to-r from-sovereign-light to-sovereign-dark">Library</span>
           </h1>
           <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Open-source trading notes, premium video courses, and high-probability mechanical systems. Browse the vault.
           </p>
           
           <div className="mt-10 flex flex-wrap justify-center gap-4">
              <input type="text" placeholder="Search the archives..." className="w-full max-w-md bg-dark-800 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-sovereign/50 text-white shadow-inner" />
              <button className="bg-sovereign hover:bg-sovereign-light text-white font-bold px-8 py-4 rounded-xl transition shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                 Search
              </button>
           </div>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
         <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
            <h2 className="text-2xl font-bold text-white">Latest Additions</h2>
            <div className="flex gap-2 text-sm font-mono text-gray-400">
               <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition">PDFs</button>
               <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition">Videos</button>
               <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition">Premium</button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {publicResources.map(res => (
               <div key={res.id} className="glass-panel p-6 rounded-2xl flex flex-col group hover:border-sovereign/40 transition duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sovereign/5 rounded-full blur-2xl -z-10 group-hover:bg-sovereign/20 transition duration-500"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                     <span className="text-[10px] font-mono uppercase tracking-widest text-sovereign bg-sovereign/10 px-2 py-1 rounded border border-sovereign/20">
                        {res.category}
                     </span>
                     <span className="text-xs text-gray-500 font-mono">{res.type}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-100 mb-2 group-hover:text-sovereign-light transition">{res.title}</h3>
                  <p className="text-sm text-gray-400 flex-grow mb-6 leading-relaxed">{res.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-4">
                     {res.price ? (
                        <span className="text-xl font-bold text-white">${res.price}</span>
                     ) : (
                        <span className="text-sm font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">FREE</span>
                     )}
                     
                     <button className={`px-4 py-2 rounded font-bold text-sm transition ${res.price ? 'bg-white text-black hover:bg-gray-200' : 'bg-dark-800 border border-white/10 text-white hover:border-sovereign/50'}`}>
                        {res.price ? 'Add to Cart' : 'Download'}
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>
      
      {/* Footer Meta */}
      <footer className="max-w-7xl mx-auto px-6 mt-24 text-center border-t border-white/5 pt-8">
         <p className="text-xs text-gray-500 font-mono">© {new Date().getFullYear()} TradeSovereign Resource Kingdom. All rights reserved.</p>
         <Link href="/sovereign-control" className="text-[10px] text-gray-800 mt-2 inline-block hover:text-gray-600 transition">Classified Access</Link>
      </footer>
    </main>
  );
}
