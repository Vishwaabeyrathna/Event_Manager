import { useEffect, useState } from 'react';

const API = "http://localhost:5000/api/events";

export default function App() {
  const [events, setEvents] = useState([]);
  const [merged, setMerged] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [form, setForm] = useState({ title: '', start_time: '', end_time: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  // --- API HELPER WITH ERROR HANDLING ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Failed to fetch");
      setEvents(await res.json());
    } catch (err) {
      alert("Error loading events: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getMerged = async () => {
    try {
      const res = await fetch(`${API}/merged`);
      setMerged(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    return (new Date(date - offset)).toISOString().slice(0, 16);
  };

  const save = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API}/${editingId}` : API;

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      setForm({ title: '', start_time: '', end_time: '', description: '' });
      setEditingId(null);
      fetchData(); // Refresh list
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const del = async (id) => {
    if(!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const startEditing = (event) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description || '',
      start_time: formatDateForInput(event.start_time),
      end_time: formatDateForInput(event.end_time)
    });
    // Scroll to top for mobile usability
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-20 selection:bg-fuchsia-500 selection:text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 mb-2">
            Event Planner
          </h1>
          <p className="text-slate-400">Organize your schedule efficiently</p>
        </div>

        {/* Input Form */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl mb-10">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-white">
                {editingId ? '✏️ Edit Event' : '✨ New Event'}
             </h2>
          </div>

          <form onSubmit={save} className="flex flex-col gap-5">
            <input 
              placeholder="Event Title" 
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})} 
              required 
              disabled={isSaving}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-fuchsia-500 outline-none disabled:opacity-50"
            />
            
            <input 
              placeholder="Description (Optional)" 
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})} 
              disabled={isSaving}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-fuchsia-500 outline-none disabled:opacity-50"
            />
            
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Start</label>
                <input 
                  type="datetime-local" 
                  value={form.start_time}
                  onChange={e => setForm({...form, start_time: e.target.value})} 
                  required 
                  disabled={isSaving}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none disabled:opacity-50 [color-scheme:dark]"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">End</label>
                <input 
                  type="datetime-local" 
                  value={form.end_time}
                  onChange={e => setForm({...form, end_time: e.target.value})} 
                  required 
                  disabled={isSaving}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none disabled:opacity-50 [color-scheme:dark]"
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-2">
              <button 
                type="submit" 
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:scale-[1.02] active:scale-95 transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
              >
                {isSaving ? (
                  <span className="animate-pulse">Saving...</span>
                ) : (editingId ? 'Update Event' : 'Create Event')}
              </button>
              
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => { setEditingId(null); setForm({ title: '', start_time: '', end_time: '', description: '' }); }} 
                  className="bg-slate-700 text-slate-200 font-semibold py-3 px-6 rounded-xl hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Algorithm Button */}
        <div className="mb-12">
            <button onClick={getMerged} className="w-full bg-indigo-900/40 border border-indigo-500/30 rounded-2xl p-4 text-indigo-300 font-bold hover:bg-indigo-900/60 transition">
               🔍 Check Busy time slots
            </button>
            {merged.length > 0 && (
                <div className="mt-4 bg-slate-900 border border-indigo-500/50 rounded-2xl p-6">
                    <h3 className="text-indigo-400 font-bold mb-4">Busy Time Blocks</h3>
                    {merged.map((m, i) => (
                        <div key={i} className="text-sm p-2 text-indigo-200 border-b border-indigo-500/20 last:border-0">
                            {new Date(m.start_time).toLocaleString()} ➜ {new Date(m.end_time).toLocaleString()}
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Event List with Loading State */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Upcoming Events</h3>
          
          {isLoading ? (
            <div className="text-center py-10 text-slate-500 animate-pulse">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-10 text-slate-500 border border-slate-800 border-dashed rounded-2xl">
              No events yet. Create one above!
            </div>
          ) : (
            <div className="space-y-4">
              {events.map(ev => (
                <div key={ev.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-fuchsia-500/50 transition flex justify-between items-start group">
                  <div>
                    <h4 className="text-xl font-bold text-white group-hover:text-fuchsia-400 transition">{ev.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">
                       {new Date(ev.start_time).toLocaleString()} - {new Date(ev.end_time).toLocaleString()}
                    </p>
                    {ev.description && <p className="text-slate-500 text-sm mt-2">{ev.description}</p>}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => startEditing(ev)} className="px-3 py-1 text-cyan-400 bg-cyan-400/10 rounded hover:bg-cyan-400/20">Edit</button>
                    <button onClick={() => del(ev.id)} className="px-3 py-1 text-rose-500 bg-rose-500/10 rounded hover:bg-rose-500/20">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}