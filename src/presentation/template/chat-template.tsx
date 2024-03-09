import { useState } from 'react'
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from '../components'

interface Message {
    text: string,
    isGPT: boolean,
}

export const ChatTemplatePage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])

    const handlePost = async (text: string) => {
        setIsLoading(true)

        setMessages((prev) => [...prev, { text, isGPT: false }])

        //TODO: UseCase

        setIsLoading(false)

        //TODO: Añadir el mensaje de isGPT en true

    }

    return (
        <div className='chat-container'>
            <div className='chat-messages'>
                <div className='grid grid-cols-12 gap-y-2'>
                    <GptMessage text='Hola, puedes escribir tu texto en español, y te ayudo con las correciones' />

                    {
                        messages.map((message, i) => (
                            message.isGPT
                                ? (
                                    <GptMessage key={i} text='Esto es de OpenAI' />
                                )
                                : (<MyMessage key={i} text={message.text} />)
                        ))
                    }
                    {
                        isLoading && (
                            <div className='fade-in'>
                                <TypingLoader />
                            </div>
                        )
                    }

                </div>
            </div>
            <TextMessageBox disableCorrections placeholder='Escribe aqui lo que deseas'
                onSendMessage={(message) => handlePost(message)} />

        </div>
    )
}
