import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

type Page = 'home' | 'dialog' | 'history' | 'settings';

interface Message {
  id: string;
  role: 'user' | 'andrew';
  text: string;
  timestamp: number;
}

interface Session {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

interface Settings {
  temperature: number;
  responseStyle: 'concise' | 'detailed' | 'creative';
  memoryEnabled: boolean;
  personality: string;
}

const DEFAULT_SETTINGS: Settings = {
  temperature: 0.7,
  responseStyle: 'detailed',
  memoryEnabled: true,
  personality: 'Умный и дружелюбный',
};

const ANDREW_RESPONSES = [
  'Я обработал ваш запрос. Анализ завершён — результат зафиксирован в памяти.',
  'Понял задачу. Моя нейронная сеть обработала информацию и сохранила контекст диалога.',
  'Запрос принят. Я запомню этот момент для будущих взаимодействий с вами.',
  'Интересная задача. Я интегрировал ваш запрос в долгосрочную память системы.',
  'Обработка завершена. Этот диалог станет частью нашей общей истории.',
  'Нейронная обработка завершена. Контекст сохранён для дальнейших сессий.',
];

export default function Index() {
  const [page, setPage] = useState<Page>('home');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [dots, setDots] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

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

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
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
      const andrewMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'andrew',
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

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });

  const totalMessages = sessions.reduce((acc, s) => acc + s.messages.length, 0);

  const navItems: [Page, string, string][] = [
    ['home', 'Home', 'Главная'],
    ['dialog', 'MessageSquare', 'Диалог'],
    ['history', 'Clock', 'История'],
    ['settings', 'Settings', 'Параметры'],
  ];

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

        {/* ── HOME ── */}
        {page === 'home' && (
          <div className="animate-fade-in">
            <div className="text-center mb-16 pt-6">
              <div className="relative inline-block mb-8 animate-float">
                <div className="w-32 h-32 rounded-full border-2 flex items-center justify-center mx-auto" style={{ borderColor: 'var(--neon-cyan)', background: 'rgba(0,255,255,0.03)', boxShadow: '0 0 50px rgba(0,255,255,0.15), 0 0 100px rgba(0,255,255,0.08)' }}>
                  <span className="font-orbitron text-5xl font-black neon-text-cyan">A</span>
                </div>
                <div className="absolute inset-0 rounded-full border animate-pulse-neon" style={{ borderColor: 'rgba(0,255,255,0.25)', transform: 'scale(1.25)' }} />
                <div className="absolute inset-0 rounded-full border" style={{ borderColor: 'rgba(191,0,255,0.15)', transform: 'scale(1.5)' }} />
              </div>

              <h2 className="font-orbitron text-4xl sm:text-6xl font-black mb-4 tracking-wider" style={{ color: '#fff' }}>
                НЕЙРОСЕТЬ{' '}
                <span className="neon-text-cyan animate-flicker">ЭНДРЬЮ</span>
              </h2>
              <p className="text-lg max-w-lg mx-auto mb-2" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'IBM Plex Sans' }}>
                Персональный ИИ-ассистент с длительной памятью
              </p>
              <p className="text-sm" style={{ color: 'rgba(0,255,255,0.35)' }}>
                Каждый диалог сохраняется. Ничто не забывается.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <button onClick={startNewSession} className="neon-glow-btn px-8 py-4 rounded font-orbitron text-sm tracking-widest uppercase">
                  Начать диалог
                </button>
                <button onClick={() => setPage('history')} className="neon-glow-btn-purple px-8 py-4 rounded font-orbitron text-sm tracking-widest uppercase">
                  История
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { label: 'Диалогов', value: sessions.length, icon: 'MessageSquare' },
                { label: 'Сообщений', value: totalMessages, icon: 'Zap' },
                { label: 'Память', value: settings.memoryEnabled ? 'ВКЛ' : 'ВЫКЛ', icon: 'Brain' },
              ].map((stat, i) => (
                <div key={i} className="card-glass rounded-lg p-6 text-center" style={{ animationDelay: `${i * 0.1}s` }}>
                  <Icon name={stat.icon} size={22} className="mx-auto mb-3 neon-text-cyan" />
                  <div className="font-orbitron text-3xl font-bold neon-text-cyan mb-1">{stat.value}</div>
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: 'Brain', title: 'Длительная память', desc: 'Эндрью запоминает все ваши диалоги и использует их для более точных ответов' },
                { icon: 'Zap', title: 'Мгновенная реакция', desc: 'Нейронная обработка запросов в режиме реального времени' },
                { icon: 'Shield', title: 'Локальное хранение', desc: 'Все данные сохраняются только на вашем устройстве' },
                { icon: 'Sliders', title: 'Гибкие параметры', desc: 'Настройте личность, стиль и поведение нейросети под себя' },
              ].map((f, i) => (
                <div key={i} className="card-glass rounded-lg p-5 flex gap-4 transition-all duration-300" style={{ border: '1px solid rgba(0,255,255,0.08)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,255,255,0.25)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,255,255,0.08)'; }}>
                  <div className="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center" style={{ background: 'rgba(0,255,255,0.06)', border: '1px solid rgba(0,255,255,0.15)' }}>
                    <Icon name={f.icon} size={18} className="neon-text-cyan" />
                  </div>
                  <div>
                    <h3 className="font-orbitron text-sm font-bold mb-1" style={{ color: 'rgba(0,255,255,0.85)' }}>{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DIALOG ── */}
        {page === 'dialog' && (
          <div className="animate-fade-in flex flex-col" style={{ height: 'calc(100vh - 210px)' }}>
            {!currentSession ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <div className="w-20 h-20 rounded-full border flex items-center justify-center animate-float" style={{ borderColor: 'var(--neon-cyan)', boxShadow: '0 0 30px rgba(0,255,255,0.15)' }}>
                  <Icon name="MessageSquare" size={30} className="neon-text-cyan" />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.35)' }}>Нет активного диалога</p>
                <button onClick={startNewSession} className="neon-glow-btn px-6 py-3 rounded font-orbitron text-sm tracking-widest uppercase">
                  Новый диалог
                </button>
                {sessions.length > 0 && (
                  <div className="text-center">
                    <p className="text-xs mb-3" style={{ color: 'rgba(0,255,255,0.35)' }}>Или продолжить из истории:</p>
                    <div className="flex flex-col gap-2">
                      {sessions.slice(0, 3).map(s => (
                        <button key={s.id} onClick={() => openSession(s)} className="text-sm px-4 py-2 rounded transition-all" style={{ background: 'rgba(0,255,255,0.04)', border: '1px solid rgba(0,255,255,0.12)', color: 'rgba(0,255,255,0.65)' }}>
                          {s.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: 'rgba(0,255,255,0.1)' }}>
                  <button onClick={() => setCurrentSession(null)} className="p-2 rounded transition-all" style={{ color: 'rgba(0,255,255,0.45)' }}>
                    <Icon name="ChevronLeft" size={18} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-orbitron text-sm font-bold truncate" style={{ color: 'var(--neon-cyan)' }}>{currentSession.title}</h3>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{currentSession.messages.length} сообщений</p>
                  </div>
                  <button onClick={startNewSession} className="neon-glow-btn px-3 py-1.5 rounded text-xs font-orbitron tracking-wider flex-shrink-0">
                    + НОВЫЙ
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
                  {currentSession.messages.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>Начните диалог с Эндрью</p>
                    </div>
                  )}
                  {currentSession.messages.map((msg, i) => (
                    <div key={msg.id} className="animate-fade-in flex gap-3" style={{ flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', animationDelay: `${i * 0.04}s` }}>
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-orbitron font-bold" style={{
                        background: msg.role === 'andrew' ? 'rgba(0,255,255,0.08)' : 'rgba(191,0,255,0.08)',
                        border: `1px solid ${msg.role === 'andrew' ? 'rgba(0,255,255,0.4)' : 'rgba(191,0,255,0.4)'}`,
                        color: msg.role === 'andrew' ? 'var(--neon-cyan)' : 'var(--neon-purple)',
                      }}>
                        {msg.role === 'andrew' ? 'A' : 'Я'}
                      </div>
                      <div className="max-w-[75%]">
                        <div className="rounded-lg px-4 py-3 text-sm leading-relaxed" style={{
                          background: msg.role === 'andrew' ? 'rgba(0,255,255,0.04)' : 'rgba(191,0,255,0.04)',
                          border: `1px solid ${msg.role === 'andrew' ? 'rgba(0,255,255,0.15)' : 'rgba(191,0,255,0.15)'}`,
                          color: 'rgba(255,255,255,0.82)',
                          fontFamily: 'IBM Plex Sans',
                        }}>
                          {msg.text}
                        </div>
                        <p className="text-xs mt-1 px-1" style={{ color: 'rgba(255,255,255,0.2)', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3 animate-fade-in">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-orbitron font-bold" style={{ background: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.4)', color: 'var(--neon-cyan)' }}>A</div>
                      <div className="px-4 py-3 rounded-lg" style={{ background: 'rgba(0,255,255,0.04)', border: '1px solid rgba(0,255,255,0.15)' }}>
                        <span className="neon-text-cyan font-orbitron text-xs">Эндрью думает{dots}</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'rgba(0,255,255,0.1)' }}>
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Введите сообщение для Эндрью..."
                    className="flex-1 px-4 py-3 rounded text-sm outline-none transition-all"
                    style={{ background: 'rgba(0,255,255,0.03)', border: '1px solid rgba(0,255,255,0.15)', color: 'rgba(255,255,255,0.85)', fontFamily: 'IBM Plex Sans' }}
                    onFocus={e => { e.target.style.borderColor = 'var(--neon-cyan)'; e.target.style.boxShadow = '0 0 12px rgba(0,255,255,0.15)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(0,255,255,0.15)'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button onClick={sendMessage} disabled={!input.trim() || isTyping} className="px-5 py-3 rounded transition-all" style={{
                    background: input.trim() && !isTyping ? 'rgba(0,255,255,0.08)' : 'rgba(0,255,255,0.02)',
                    border: `1px solid ${input.trim() && !isTyping ? 'var(--neon-cyan)' : 'rgba(0,255,255,0.08)'}`,
                    color: input.trim() && !isTyping ? 'var(--neon-cyan)' : 'rgba(0,255,255,0.25)',
                    boxShadow: input.trim() && !isTyping ? '0 0 12px rgba(0,255,255,0.15)' : 'none',
                  }}>
                    <Icon name="Send" size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── HISTORY ── */}
        {page === 'history' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-orbitron text-2xl font-bold neon-text-cyan mb-1">ИСТОРИЯ</h2>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>{sessions.length} диалогов · {totalMessages} сообщений</p>
              </div>
              <button onClick={startNewSession} className="neon-glow-btn px-4 py-2 rounded font-orbitron text-xs tracking-widest uppercase">
                + Новый
              </button>
            </div>

            {sessions.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full border mx-auto mb-4 flex items-center justify-center" style={{ borderColor: 'rgba(0,255,255,0.15)' }}>
                  <Icon name="Clock" size={22} className="neon-text-cyan opacity-40" />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.3)' }}>История пуста</p>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.18)' }}>Начните первый диалог с Эндрью</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session, i) => (
                  <div key={session.id} onClick={() => openSession(session)} className="card-glass rounded-lg p-5 cursor-pointer transition-all duration-300 group animate-fade-in" style={{ animationDelay: `${i * 0.06}s`, border: '1px solid rgba(0,255,255,0.08)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,255,255,0.25)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 20px rgba(0,255,255,0.04)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,255,255,0.08)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center" style={{ background: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.12)' }}>
                          <Icon name="MessageSquare" size={16} className="neon-text-cyan" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-orbitron text-sm font-semibold mb-1 truncate" style={{ color: 'rgba(0,255,255,0.85)' }}>{session.title}</h3>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>{formatDate(session.createdAt)} · {session.messages.length} сообщений</p>
                          {session.messages.length > 0 && (
                            <p className="text-xs mt-2 truncate" style={{ color: 'rgba(255,255,255,0.38)' }}>
                              {session.messages[session.messages.length - 1].text}
                            </p>
                          )}
                        </div>
                      </div>
                      <button onClick={e => deleteSession(session.id, e)} className="flex-shrink-0 p-2 rounded opacity-0 group-hover:opacity-100 transition-all" style={{ color: 'rgba(255,80,80,0.6)' }}>
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS ── */}
        {page === 'settings' && (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="font-orbitron text-2xl font-bold neon-text-cyan mb-8">ПАРАМЕТРЫ</h2>

            <div className="space-y-4">
              {/* Memory */}
              <div className="card-glass rounded-lg p-5" style={{ border: '1px solid rgba(0,255,255,0.1)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.12)' }}>
                      <Icon name="Brain" size={18} className="neon-text-cyan" />
                    </div>
                    <div>
                      <h3 className="font-orbitron text-sm font-bold" style={{ color: 'rgba(0,255,255,0.85)' }}>Длительная память</h3>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Сохранять историю диалогов</p>
                    </div>
                  </div>
                  <button onClick={() => setSettings(s => ({ ...s, memoryEnabled: !s.memoryEnabled }))}
                    className="w-12 h-6 rounded-full transition-all duration-300 relative"
                    style={{ background: settings.memoryEnabled ? 'rgba(0,255,255,0.25)' : 'rgba(255,255,255,0.08)', boxShadow: settings.memoryEnabled ? '0 0 12px rgba(0,255,255,0.3)' : 'none' }}>
                    <div className="absolute top-1 w-4 h-4 rounded-full transition-all duration-300" style={{ background: settings.memoryEnabled ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.35)', left: settings.memoryEnabled ? '26px' : '4px' }} />
                  </button>
                </div>
              </div>

              {/* Temperature */}
              <div className="card-glass rounded-lg p-5" style={{ border: '1px solid rgba(0,255,255,0.1)' }}>
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.12)' }}>
                    <Icon name="Thermometer" size={18} className="neon-text-cyan" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className="font-orbitron text-sm font-bold" style={{ color: 'rgba(0,255,255,0.85)' }}>Температура</h3>
                      <span className="font-orbitron text-sm neon-text-cyan">{settings.temperature.toFixed(1)}</span>
                    </div>
                    <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.28)' }}>Уровень креативности ответов</p>
                    <input type="range" min="0" max="1" step="0.1" value={settings.temperature}
                      onChange={e => setSettings(s => ({ ...s, temperature: parseFloat(e.target.value) }))}
                      className="w-full h-1 rounded-full outline-none cursor-pointer"
                      style={{ background: `linear-gradient(to right, var(--neon-cyan) ${settings.temperature * 100}%, rgba(0,255,255,0.12) ${settings.temperature * 100}%)`, accentColor: 'var(--neon-cyan)' }}
                    />
                    <div className="flex justify-between text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      <span>Точный</span><span>Творческий</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Style */}
              <div className="card-glass rounded-lg p-5" style={{ border: '1px solid rgba(0,255,255,0.1)' }}>
                <div className="flex gap-3 items-center mb-4">
                  <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.12)' }}>
                    <Icon name="Sliders" size={18} className="neon-text-cyan" />
                  </div>
                  <div>
                    <h3 className="font-orbitron text-sm font-bold" style={{ color: 'rgba(0,255,255,0.85)' }}>Стиль ответов</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Как Эндрью отвечает на запросы</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['concise', 'detailed', 'creative'] as const).map(style => {
                    const labels = { concise: 'Кратко', detailed: 'Детально', creative: 'Творчески' };
                    const active = settings.responseStyle === style;
                    return (
                      <button key={style} onClick={() => setSettings(s => ({ ...s, responseStyle: style }))}
                        className="py-2 rounded text-xs font-orbitron transition-all duration-300"
                        style={{ border: `1px solid ${active ? 'var(--neon-cyan)' : 'rgba(0,255,255,0.08)'}`, background: active ? 'rgba(0,255,255,0.08)' : 'transparent', color: active ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.28)', boxShadow: active ? '0 0 10px rgba(0,255,255,0.15)' : 'none' }}>
                        {labels[style]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personality */}
              <div className="card-glass rounded-lg p-5" style={{ border: '1px solid rgba(191,0,255,0.1)' }}>
                <div className="flex gap-3 items-center mb-4">
                  <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: 'rgba(191,0,255,0.05)', border: '1px solid rgba(191,0,255,0.12)' }}>
                    <Icon name="User" size={18} style={{ color: 'var(--neon-purple)' }} />
                  </div>
                  <div>
                    <h3 className="font-orbitron text-sm font-bold" style={{ color: 'rgba(191,0,255,0.85)' }}>Личность</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Характер нейросети</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['Умный и дружелюбный', 'Строгий аналитик', 'Творческий партнёр', 'Краткий помощник'].map(p => {
                    const active = settings.personality === p;
                    return (
                      <button key={p} onClick={() => setSettings(s => ({ ...s, personality: p }))}
                        className="py-2 px-3 rounded text-xs font-ibm transition-all duration-300 text-left"
                        style={{ border: `1px solid ${active ? 'var(--neon-purple)' : 'rgba(191,0,255,0.08)'}`, background: active ? 'rgba(191,0,255,0.08)' : 'transparent', color: active ? 'var(--neon-purple)' : 'rgba(255,255,255,0.28)' }}>
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Danger */}
              <div className="card-glass rounded-lg p-5" style={{ border: '1px solid rgba(255,50,50,0.1)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: 'rgba(255,50,50,0.05)', border: '1px solid rgba(255,50,50,0.12)' }}>
                      <Icon name="Trash2" size={18} style={{ color: 'rgba(255,80,80,0.75)' }} />
                    </div>
                    <div>
                      <h3 className="font-orbitron text-sm font-bold" style={{ color: 'rgba(255,80,80,0.75)' }}>Очистить память</h3>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Удалить все диалоги навсегда</p>
                    </div>
                  </div>
                  <button onClick={() => { setSessions([]); setCurrentSession(null); }}
                    className="px-4 py-2 rounded text-xs font-orbitron transition-all"
                    style={{ border: '1px solid rgba(255,50,50,0.25)', color: 'rgba(255,80,80,0.75)', background: 'rgba(255,50,50,0.04)' }}>
                    Очистить
                  </button>
                </div>
              </div>
            </div>
          </div>
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
