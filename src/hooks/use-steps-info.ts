import { useCopilotReadable } from "@copilotkit/react-core"

export const useStepsInfo = () => {
    useCopilotReadable({
        description: 'Instructions about the contact-email step.',
        value: `
            На этом этапе юзеру нужно указать контактную информацию в инпут поле в форме (его email).
            Тебе не нужно у него просить его вводить email в чате. 
        `,
    })
    useCopilotReadable({
        description: 'Instructions about the business-activities step.',
        value: `
            На этом этапе юзеру нужно указать деятельность бизнеса. 
            Ты можешь спросить у него чем он занимается и на основе этого порекомендуй ему деятельность бизнеса.
            Он может выбрать 1 основную и 2 дополнительные деятельности.
        `,
    })
    useCopilotReadable({
        description: 'Instructions about the company-names step.',
        value: `
            На этом этапе юзеру нужно выбрать 3 названия компаний которые подходят по требованиями гайдлайна который у тебя есть.
            Тебе нужно сразу рассказать основные правила и требования для названия компании. И сразу же спросить предложить ли ему несколько вариантов используя его email и деятельность бизнеса? Для рекомендации имен используй action: suggestCompanyNames
        `,
    })
    useCopilotReadable({
        description: 'Instructions about the visa-packages step.',
        value: `
            На этом этапе юзеру нужно указать пакет виз.
            Тебе нужно рассказать о преимуществах покупки визы на этом этапе, так это будет дешевле, чем докупать потом.
        `,
    })
}

//     | 'shareholders-info'
//     | 'shareholder-details'
//     | 'passport-review'
//     | 'payment'
//     | 'kyc';