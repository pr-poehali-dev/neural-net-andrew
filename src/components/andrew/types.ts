export type Page = 'home' | 'dialog' | 'history' | 'settings';

export interface Message {
  id: string;
  role: 'user' | 'andrew';
  text: string;
  timestamp: number;
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export interface Settings {
  temperature: number;
  responseStyle: 'concise' | 'detailed' | 'creative';
  memoryEnabled: boolean;
  personality: string;
}

export const DEFAULT_SETTINGS: Settings = {
  temperature: 0.7,
  responseStyle: 'detailed',
  memoryEnabled: true,
  personality: 'Умный и дружелюбный',
};

export const ANDREW_RESPONSES = [
  'Я обработал ваш запрос. Анализ завершён — результат зафиксирован в памяти.',
  'Понял задачу. Моя нейронная сеть обработала информацию и сохранила контекст диалога.',
  'Запрос принят. Я запомню этот момент для будущих взаимодействий с вами.',
  'Интересная задача. Я интегрировал ваш запрос в долгосрочную память системы.',
  'Обработка завершена. Этот диалог станет частью нашей общей истории.',
  'Нейронная обработка завершена. Контекст сохранён для дальнейших сессий.',
];
