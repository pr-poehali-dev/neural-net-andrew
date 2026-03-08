import Icon from '@/components/ui/icon';
import { Settings } from './types';

interface SettingsViewProps {
  settings: Settings;
  onSetSettings: (updater: (prev: Settings) => Settings) => void;
  onClearMemory: () => void;
}

export default function SettingsView({ settings, onSetSettings, onClearMemory }: SettingsViewProps) {
  return (
    <div className="animate-fade-in max-w-2xl">
      <h2 className="font-orbitron text-2xl font-bold neon-text-cyan mb-8">ПАРАМЕТРЫ</h2>

      <div className="space-y-4">
        {/* Memory toggle */}
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
            <button
              onClick={() => onSetSettings(s => ({ ...s, memoryEnabled: !s.memoryEnabled }))}
              className="w-12 h-6 rounded-full transition-all duration-300 relative"
              style={{ background: settings.memoryEnabled ? 'rgba(0,255,255,0.25)' : 'rgba(255,255,255,0.08)', boxShadow: settings.memoryEnabled ? '0 0 12px rgba(0,255,255,0.3)' : 'none' }}
            >
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
              <input
                type="range" min="0" max="1" step="0.1" value={settings.temperature}
                onChange={e => onSetSettings(s => ({ ...s, temperature: parseFloat(e.target.value) }))}
                className="w-full h-1 rounded-full outline-none cursor-pointer"
                style={{ background: `linear-gradient(to right, var(--neon-cyan) ${settings.temperature * 100}%, rgba(0,255,255,0.12) ${settings.temperature * 100}%)`, accentColor: 'var(--neon-cyan)' }}
              />
              <div className="flex justify-between text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.2)' }}>
                <span>Точный</span><span>Творческий</span>
              </div>
            </div>
          </div>
        </div>

        {/* Response style */}
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
                <button
                  key={style}
                  onClick={() => onSetSettings(s => ({ ...s, responseStyle: style }))}
                  className="py-2 rounded text-xs font-orbitron transition-all duration-300"
                  style={{ border: `1px solid ${active ? 'var(--neon-cyan)' : 'rgba(0,255,255,0.08)'}`, background: active ? 'rgba(0,255,255,0.08)' : 'transparent', color: active ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.28)', boxShadow: active ? '0 0 10px rgba(0,255,255,0.15)' : 'none' }}
                >
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
                <button
                  key={p}
                  onClick={() => onSetSettings(s => ({ ...s, personality: p }))}
                  className="py-2 px-3 rounded text-xs font-ibm transition-all duration-300 text-left"
                  style={{ border: `1px solid ${active ? 'var(--neon-purple)' : 'rgba(191,0,255,0.08)'}`, background: active ? 'rgba(191,0,255,0.08)' : 'transparent', color: active ? 'var(--neon-purple)' : 'rgba(255,255,255,0.28)' }}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Danger zone */}
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
            <button
              onClick={onClearMemory}
              className="px-4 py-2 rounded text-xs font-orbitron transition-all"
              style={{ border: '1px solid rgba(255,50,50,0.25)', color: 'rgba(255,80,80,0.75)', background: 'rgba(255,50,50,0.04)' }}
            >
              Очистить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
