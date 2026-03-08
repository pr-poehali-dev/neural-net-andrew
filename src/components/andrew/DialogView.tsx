import { useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Session } from './types';

interface DialogViewProps {
  currentSession: Session | null;
  sessions: Session[];
  input: string;
  isTyping: boolean;
  dots: string;
  onSetInput: (val: string) => void;
  onSendMessage: () => void;
  onStartNewSession: () => void;
  onOpenSession: (session: Session) => void;
  onBack: () => void;
}

export default function DialogView({
  currentSession,
  sessions,
  input,
  isTyping,
  dots,
  onSetInput,
  onSendMessage,
  onStartNewSession,
  onOpenSession,
  onBack,
}: DialogViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="animate-fade-in flex flex-col" style={{ height: 'calc(100vh - 210px)' }}>
      {!currentSession ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="w-20 h-20 rounded-full border flex items-center justify-center animate-float" style={{ borderColor: 'var(--neon-cyan)', boxShadow: '0 0 30px rgba(0,255,255,0.15)' }}>
            <Icon name="MessageSquare" size={30} className="neon-text-cyan" />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)' }}>Нет активного диалога</p>
          <button onClick={onStartNewSession} className="neon-glow-btn px-6 py-3 rounded font-orbitron text-sm tracking-widest uppercase">
            Новый диалог
          </button>
          {sessions.length > 0 && (
            <div className="text-center">
              <p className="text-xs mb-3" style={{ color: 'rgba(0,255,255,0.35)' }}>Или продолжить из истории:</p>
              <div className="flex flex-col gap-2">
                {sessions.slice(0, 3).map(s => (
                  <button key={s.id} onClick={() => onOpenSession(s)} className="text-sm px-4 py-2 rounded transition-all" style={{ background: 'rgba(0,255,255,0.04)', border: '1px solid rgba(0,255,255,0.12)', color: 'rgba(0,255,255,0.65)' }}>
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
            <button onClick={onBack} className="p-2 rounded transition-all" style={{ color: 'rgba(0,255,255,0.45)' }}>
              <Icon name="ChevronLeft" size={18} />
            </button>
            <div className="flex-1 min-w-0">
              <h3 className="font-orbitron text-sm font-bold truncate" style={{ color: 'var(--neon-cyan)' }}>{currentSession.title}</h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{currentSession.messages.length} сообщений</p>
            </div>
            <button onClick={onStartNewSession} className="neon-glow-btn px-3 py-1.5 rounded text-xs font-orbitron tracking-wider flex-shrink-0">
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
              onChange={e => onSetInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && onSendMessage()}
              placeholder="Введите сообщение для Эндрью..."
              className="flex-1 px-4 py-3 rounded text-sm outline-none transition-all"
              style={{ background: 'rgba(0,255,255,0.03)', border: '1px solid rgba(0,255,255,0.15)', color: 'rgba(255,255,255,0.85)', fontFamily: 'IBM Plex Sans' }}
              onFocus={e => { e.target.style.borderColor = 'var(--neon-cyan)'; e.target.style.boxShadow = '0 0 12px rgba(0,255,255,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(0,255,255,0.15)'; e.target.style.boxShadow = 'none'; }}
            />
            <button onClick={onSendMessage} disabled={!input.trim() || isTyping} className="px-5 py-3 rounded transition-all" style={{
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
  );
}
