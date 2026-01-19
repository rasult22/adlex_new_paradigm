import { useCopilotReadable } from "@copilotkit/react-core"

export const useStepsInfo = () => {
    useCopilotReadable({
        description: 'CRITICAL instruction for step navigation',
        value: `ВАЖНО: Когда описываешь шаг после show_step_transition, ВСЕГДА описывай ТОЛЬКО тот шаг который указан в currentStep.
Даже если данные для этого шага уже заполнены - юзер мог вернуться назад для редактирования.
НЕ переходи к описанию следующих шагов. Фокусируйся только на текущем.`,
    })
    useCopilotReadable({
        description: 'Instructions about the contact-email step.',
        value: `Юзер вводит email в форме. Не проси вводить в чат.`,
    })
    useCopilotReadable({
        description: 'Instructions about the business-activities step.',
        value: `
            Юзер выбирает деятельность бизнеса: 1 основную + до 2 дополнительных.
            Спроси чем занимается и помоги подобрать подходящие активности.
        `,
    })
    useCopilotReadable({
        description: 'Instructions about the company-names step.',
        value: `
            Нужно выбрать 3 названия компании по правилам нейминга IFZA.
            Расскажи основные правила и предложи варианты через action: suggestCompanyNames.
        `,
    })
    useCopilotReadable({
        description: 'Instructions about the visa-packages step.',
        value: `
            Выбор количества виз для акционеров.
            Объясни преимущество покупки сейчас — дешевле чем докупать после регистрации.
        `,
    })
    useCopilotReadable({
        description: 'Instructions about the shareholders-info step.',
        value: `
            Указать: кол-во акционеров (до 10), общее кол-во акций, стоимость акции (мин 10 AED).
            Капитал >150k AED требует письмо из банка. Для визы рекомендуется 48k AED на человека.
        `,
    })
    useCopilotReadable({
        description: 'Instructions about the shareholder-details step.',
        value: `
            Заполнить по каждому акционеру: паспорт (скан), email, телефон, кол-во акций,
            роли (Shareholder/GM/Director/Secretary), адрес, резидент ОАЭ, PEP статус.
            PEP — люди на высоких госдолжностях или их родственники.
        `,
    })
    useCopilotReadable({
        description: 'Instructions about the passport-review step.',
        value: `
            OCR извлекает данные из паспорта (Extract). Юзер проверяет данные,
            редактирует при ошибках, и подтверждает (Confirm). Можно Re-extract если нужно.
        `,
    })
    useCopilotReadable({
        description: 'Instructions about the data-processing step.',
        value: `
            Автоматическая проверка данных системой. Юзер ждет.
            При отклонении покажут причину — нужно исправить данные.
        `,
    })
    useCopilotReadable({
        description: 'Instructions about the payment step.',
        value: `
            Оплата услуг: визы $1,250/шт + регистрация $5,000 + сервис $100.
            Нажать Pay для оплаты.
        `,
    })
    useCopilotReadable({
        description: 'Instructions about the kyc step.',
        value: `
            KYC верификация через Zoho для каждого акционера.
            Можно скопировать ссылку и отправить, или пройти сразу (Complete the verification).
        `,
    })
    useCopilotReadable({
        description: 'Instructions about the e-sign step.',
        value: `
            Подписать документы: E-Agreement, MOA/AOA, Share Capital Letter.
            Для каждого нажать Sign. После всех подписей можно продолжить.
        `,
    })
    useCopilotReadable({
        description: 'Instructions about the license-documents-release step.',
        value: `
            Финальный этап — ожидание документов от IFZA (несколько дней).
            После одобрения доступны: E-License, Certificate of Formation, Share Certificate, MOA/AOA, Lease Agreement.
            Поздравь юзера с регистрацией компании!
        `,
    })
}
