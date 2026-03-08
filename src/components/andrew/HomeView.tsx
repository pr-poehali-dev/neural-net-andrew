import Icon from '@/components/ui/icon';
import { Session, Settings } from './types';

interface HomeViewProps {
  sessions: Session[];
  settings: Settings;
  onStartNewSession: () => void;
  onNavigateHistory: () => void;
}

export default function HomeView({ sessions, settings, onStartNewSession, onNavigateHistory }: HomeViewProps) {
  const totalMessages = sessions.reduce((acc, s) => acc + s.messages.length, 0);

  return (
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
          <button onClick={onStartNewSession} className="neon-glow-btn px-8 py-4 rounded font-orbitron text-sm tracking-widest uppercase">
            Начать диалог
          </button>
          <button onClick={onNavigateHistory} className="neon-glow-btn-purple px-8 py-4 rounded font-orbitron text-sm tracking-widest uppercase">
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
          <div key={i} className="card-glass rounded-lg p-6 text-center">
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
  );
}
