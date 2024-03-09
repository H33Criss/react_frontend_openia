import { useState } from 'react'
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from '../../components'
import { prosConsUseCase } from '../../../core/use-cases'

interface Message {
    text: string,
    isGPT: boolean,
}

export const ProsConsPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])

    const handlePost = async (text: string) => {
        setIsLoading(true)

        setMessages((prev) => [...prev, { text, isGPT: false }])
        
        const { message} = await prosConsUseCase(text);
        
        setMessages((prev) => [...prev, { text:message, isGPT: true }])
        setIsLoading(false)


    }

    return (
        <div className='chat-container'>
            <div className='chat-messages'>
                <div className='grid grid-cols-12 gap-y-2'>
                    <GptMessage text='Hola, puedes escribir lo que sea que quieres que compare y te daré mis puntos de vista' />

                    {
                        messages.map((message, i) => (
                            message.isGPT
                                ? (
                                    <GptMessage key={i} text={message.text} />
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
