# AIChat Component - Custom Headless Chat UI

Кастомная реализация чата с использованием `useCopilotChatHeadless_c` от CopilotKit с использованием цветовой схемы Untitled UI и Tailwind CSS.

## Возможности

### 1. Все типы сообщений AG-UI

Компонент поддерживает отображение всех стандартных типов сообщений:

- **User** - сообщения пользователя (справа, фиолетовый фон)
- **Assistant** - сообщения AI ассистента (слева, светлый фон)
- **Tool** - сообщения от инструментов (с синим бейджем "Tool")
- **System** - системные сообщения (по центру, серый фон)
- **Developer** - сообщения разработчика (по центру, серый фон)

### 2. Кастомные типы сообщений

Вы можете отправлять **кастомные сообщения** с дополнительным полем `type`:

```typescript
// Пример отправки кастомного сообщения
sendMessage({
    id: Date.now().toString(),
    role: 'assistant',
    content: 'Это кастомное сообщение',
    type: 'custom-notification' // Любой кастомный тип
});
```

Кастомные сообщения будут отображаться с фиолетовым фоном и бейджем с названием типа.

### 3. Функциональность

- ✅ **Автоматический скролл** к новым сообщениям
- ✅ **Индикатор загрузки** (typing indicator) с анимированными точками
- ✅ **Кнопка Stop** - остановка генерации сообщения (показывается только во время загрузки)
- ✅ **Кнопка Reset** - очистка чата
- ✅ **Toggle для системных сообщений** - показать/скрыть system и developer сообщения
- ✅ **Suggestions** - отображение предложенных действий
- ✅ **Generate Suggestions** - кнопка для генерации предложений
- ✅ **Поддержка Enter** для отправки (Shift+Enter для новой строки)
- ✅ **Пустое состояние** с приветственным сообщением

### 4. Цветовая схема Untitled UI

Компонент использует семантические токены цветов из Untitled UI:

- `bg-primary`, `bg-secondary`, `bg-tertiary` - фоны
- `text-primary`, `text-secondary`, `text-tertiary` - тексты
- `border-secondary` - границы
- `bg-brand-solid`, `bg-brand-primary` - брендовые цвета
- `utility-*` цвета для бейджей и специальных элементов

## Примеры использования

### Базовое использование

```typescript
import { AIChat } from '@/pages/home-screen/components/AIChat';

function MyApp() {
    const [started, setStarted] = useState(false);

    return (
        <AIChat
            showStartButton={!started}
            onStart={() => setStarted(true)}
        />
    );
}
```

### Отправка кастомных сообщений программно

Если вам нужно отправить кастомное сообщение из другой части приложения:

```typescript
import { useCopilotChatHeadless_c } from '@copilotkit/react-core';

function MyComponent() {
    const { sendMessage } = useCopilotChatHeadless_c();

    const sendCustomNotification = () => {
        sendMessage({
            id: Date.now().toString(),
            role: 'assistant',
            content: 'Ваша заявка была успешно отправлена!',
            type: 'success-notification'
        });
    };

    return <button onClick={sendCustomNotification}>Send Notification</button>;
}
```

### Создание собственных типов кастомных сообщений

Вы можете легко добавить свои типы в компонент `MessageBubble`. Например, для уведомлений об ошибках:

```typescript
// В MessageBubble component
if (customType === 'error-notification') {
    return (
        <div className="flex justify-start mb-4">
            <div className="flex items-start gap-2 max-w-[80%]">
                <div className="bg-utility-error-50 text-utility-error-700 rounded-lg px-4 py-3 shadow-xs ring-1 ring-utility-error-600/20">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center rounded-md bg-utility-error-100 px-2 py-1 text-xs font-medium text-utility-error-700 ring-1 ring-inset ring-utility-error-600/30">
                            Error
                        </span>
                    </div>
                    <p className="text-sm leading-5">{content}</p>
                </div>
            </div>
        </div>
    );
}
```

## API Reference

### Props

```typescript
interface AIChatProps {
    onStart: () => void;        // Вызывается при нажатии "Start Application"
    showStartButton?: boolean;  // Показывать ли стартовый экран (default: true)
}
```

### useCopilotChatHeadless_c Hook

```typescript
const {
    messages,              // Массив всех сообщений
    sendMessage,          // Функция отправки сообщения
    isLoading,            // Идет ли генерация
    stopGeneration,       // Остановить генерацию
    reset,                // Очистить чат
    suggestions,          // Массив предложений
    generateSuggestions,  // Сгенерировать предложения
} = useCopilotChatHeadless_c();
```

## Типы сообщений

### Стандартное сообщение

```typescript
{
    id: string;
    role: 'user' | 'assistant' | 'system' | 'developer' | 'tool';
    content: string;
}
```

### Кастомное сообщение

```typescript
{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    type: string;  // Например: 'success', 'warning', 'custom-action'
}
```

## Стилизация

Все стили используют Tailwind CSS с семантическими токенами Untitled UI. Для кастомизации:

1. Измените классы в компоненте `MessageBubble`
2. Используйте CSS переменные из `theme.css`
3. Добавьте свои утилитарные классы в Tailwind конфигурацию

## Дальнейшие улучшения

Потенциальные доработки:

- [ ] Поддержка markdown в сообщениях
- [ ] Прикрепление файлов/изображений
- [ ] Reactions на сообщения
- [ ] Редактирование отправленных сообщений
- [ ] Поиск по истории чата
- [ ] Экспорт истории чата
- [ ] Voice input
- [ ] Typing indicators для нескольких пользователей
