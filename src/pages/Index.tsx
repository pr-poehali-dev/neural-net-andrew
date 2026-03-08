import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Page, Session, Settings, DEFAULT_SETTINGS, ANDREW_RESPONSES } from '@/components/andrew/types';
import HomeView from '@/components/andrew/HomeView';
import DialogView from '@/components/andrew/DialogView';
import HistoryView from '@/components/andrew/HistoryView';
import SettingsView from '@/components/andrew/SettingsView';

const navItems: [Page, string, string][] = [
  ['home', 'Home', 'Главная'],
  ['dialog', 'MessageSquare', 'Диалог'],
  ['history', 'Clock', 'История'],
  ['settings', 'Settings', 'Параметры'],
];

export default function Index() {
  const [page, setPage] = useState<Page>('home');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('andrew_sessions');
    if (saved) setSessions(JSON.parse(saved));
    const savedSettings = localStorage.getItem('andrew_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  useEffect(() => {
    localStorage.setItem('andrew_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('andrew_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setDots(d => (d.length >= 3 ? '' : d + '.'));
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  const startNewSession = () => {
    const session: Session = {
      id: Date.now().toString(),
      title: 'Новый диалог',
      messages: [],
      createdAt: Date.now(),
    };
    setCurrentSession(session);
    setPage('dialog');
  };

  const sendMessage = () => {
    if (!input.trim() || !currentSession) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      text: input.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...currentSession.messages, userMsg];
    const title =
      currentSession.title === 'Новый диалог'
        ? input.trim().slice(0, 40)
        : currentSession.title;

    const updated: Session = { ...currentSession, messages: updatedMessages, title };
    setCurrentSession(updated);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = ANDREW_RESPONSES[Math.floor(Math.random() * ANDREW_RESPONSES.length)];
      const andrewMsg = {
        id: (Date.now() + 1).toString(),
        role: 'andrew' as const,
        text: reply,
        timestamp: Date.now(),
      };
      const final: Session = { ...updated, messages: [...updatedMessages, andrewMsg] };
      setCurrentSession(final);
      setSessions(prev => {
        const idx = prev.findIndex(s => s.id === final.id);
        if (idx >= 0) {
          const arr = [...prev];
          arr[idx] = final;
          return arr;
        }
        return [final, ...prev];
      });
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const openSession = (session: Session) => {
    setCurrentSession(session);
    setPage('dialog');
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSession?.id === id) setCurrentSession(null);
  };

  return (
    <div className="min-h-screen grid-bg flex flex-col" style={{ backgroundColor: 'var(--bg-deep)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vh] rounded-full blur-[120px]" style={{ background: 'rgba(0,255,255,0.06)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vh] rounded-full blur-[140px]" style={{ background: 'rgba(191,0,255,0.05)' }} />
        <div className="absolute top-[40%] right-[20%] w-[20vw] h-[20vh] rounded-full blur-[80px]" style={{ background: 'rgba(0,255,136,0.03)' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b scan-line" style={{ borderColor: 'rgba(0,255,255,0.15)', background: 'rgba(5,10,16,0.92)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-full border animate-glow-pulse" style={{ borderColor: 'var(--neon-cyan)', background: 'rgba(0,255,255,0.05)' }}>
              <span className="font-orbitron text-xs font-bold neon-text-cyan">AI</span>
            </div>
            <div>
              <h1 className="font-orbitron text-lg font-bold neon-text-cyan tracking-widest">ЭНДРЬЮ</h1>
              <p className="text-xs" style={{ color: 'rgba(0,255,255,0.4)', fontFamily: 'IBM Plex Sans' }}>Нейронная система v1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse-neon" style={{ background: 'var(--neon-green)', boxShadow: '0 0 8px var(--neon-green)' }} />
            <span className="text-xs font-orbitron tracking-widest" style={{ color: 'var(--neon-green)' }}>ONLINE</span>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="relative z-10 border-b" style={{ borderColor: 'rgba(0,255,255,0.08)', background: 'rgba(5,10,16,0.75)' }}>
        <div className="max-w-6xl mx-auto px-4 flex">
          {navItems.map(([id, icon, label]) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className="flex items-center gap-2 px-4 py-3 text-sm transition-all duration-300 border-b-2"
              style={{
                borderBottomColor: page === id ? 'var(--neon-cyan)' : 'transparent',
                color: page === id ? 'var(--neon-cyan)' : 'rgba(0,255,255,0.35)',
                background: page === id ? 'rgba(0,255,255,0.04)' : 'transparent',
                fontFamily: 'IBM Plex Sans',
              }}
            >
              <Icon name={icon} size={14} />
              <span className="hidden sm:inline">{label}</span>
              {id === 'history' && sessions.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full font-orbitron" style={{ background: 'rgba(0,255,255,0.12)', color: 'var(--neon-cyan)', fontSize: '10px' }}>
                  {sessions.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 relative z-10 max-w-6xl mx-auto w-full px-4 py-8">
        {page === 'home' && (
          <HomeView
            sessions={sessions}
            settings={settings}
            onStartNewSession={startNewSession}
            onNavigateHistory={() => setPage('history')}
          />
        )}
        {page === 'dialog' && (
          <DialogView
            currentSession={currentSession}
            sessions={sessions}
            input={input}
            isTyping={isTyping}
            dots={dots}
            onSetInput={setInput}
            onSendMessage={sendMessage}
            onStartNewSession={startNewSession}
            onOpenSession={openSession}
            onBack={() => setCurrentSession(null)}
          />
        )}
        {page === 'history' && (
          <HistoryView
            sessions={sessions}
            currentSession={currentSession}
            onOpenSession={openSession}
            onDeleteSession={deleteSession}
            onStartNewSession={startNewSession}
          />
        )}
        {page === 'settings' && (
          <SettingsView
            settings={settings}
            onSetSettings={setSettings}
            onClearMemory={() => { setSessions([]); setCurrentSession(null); }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t py-4 text-center" style={{ borderColor: 'rgba(0,255,255,0.06)', background: 'rgba(5,10,16,0.5)' }}>
        <p className="font-orbitron text-xs tracking-widest" style={{ color: 'rgba(0,255,255,0.18)' }}>
          ЭНДРЬЮ · НЕЙРОННАЯ СИСТЕМА · 2026
        </p>
      </footer>
    </div>
  );
}
