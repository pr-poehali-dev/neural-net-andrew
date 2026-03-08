import Icon from '@/components/ui/icon';
import { Session } from './types';

interface HistoryViewProps {
  sessions: Session[];
  currentSession: Session | null;
  onOpenSession: (session: Session) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onStartNewSession: () => void;
}

export default function HistoryView({ sessions, currentSession, onOpenSession, onDeleteSession, onStartNewSession }: HistoryViewProps) {
  const totalMessages = sessions.reduce((acc, s) => acc + s.messages.length, 0);

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-orbitron text-2xl font-bold neon-text-cyan mb-1">ИСТОРИЯ</h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>{sessions.length} диалогов · {totalMessages} сообщений</p>
        </div>
        <button onClick={onStartNewSession} className="neon-glow-btn px-4 py-2 rounded font-orbitron text-xs tracking-widest uppercase">
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
            <div
              key={session.id}
              onClick={() => onOpenSession(session)}
              className="card-glass rounded-lg p-5 cursor-pointer transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${i * 0.06}s`, border: '1px solid rgba(0,255,255,0.08)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,255,255,0.25)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 20px rgba(0,255,255,0.04)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,255,255,0.08)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
            >
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
                <button
                  onClick={e => onDeleteSession(session.id, e)}
                  className="flex-shrink-0 p-2 rounded opacity-0 group-hover:opacity-100 transition-all"
                  style={{ color: 'rgba(255,80,80,0.6)' }}
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
