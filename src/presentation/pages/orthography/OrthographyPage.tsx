import { useState } from 'react'
import { GptMessage, GptOrthographyMessage, MyMessage, TextMessageBox, TextMessageBoxFile, TextMessageBoxSelect, TypingLoader } from '../../components'
import { orthographyUseCase } from '../../../core/use-cases'

interface Message {
    text: string,
    isGPT: boolean,
    info?:{
        userScore: number;
        errors:    string[];
        message:   string;
    }
}

export const OrthographyPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])

    const handlePost = async (text: string) => {
        setIsLoading(true)

        setMessages((prev) => [...prev, { text, isGPT: false }])
        
        const {ok, message,errors, userScore}= await orthographyUseCase(text);
        console.log({message, ok, userScore})
        if(!ok){
            setMessages((prev) => [...prev, { text:'No se pudo realizar la correcion', isGPT: false }])
        }else{
            setMessages((prev) => [...prev, 
                { 
                    text:message, 
                    isGPT: true ,
                    info:{
                        errors,
                        userScore,
                        message,
                    }
                }])
        }
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
                                    <GptOrthographyMessage 
                                    key={i} 
                                    {...message.info!}
                                    // message={message.info!.message} 
                                    // errors={message.info!.errors}
                                    // userScore={message.info!.userScore}
                                    />
                                    // <GptMessage key={i} text='Esto es de OpenAI' />
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
            {/* <TextMessageBoxSelect
                options={[
                    {
                        id: '1',
                        text: 'Hola'
                    },
                    {
                        id: '2',
                        text: 'Mundo'
                    },
                ]}

                disableCorrections placeholder='Escribe aqui lo que deseas'
                onSendMessage={(message) => handlePost(message)} /> */}
            {/* <TextMessageBoxFile disableCorrections placeholder='Escribe aqui lo que deseas'
                onSendMessage={(message) => handlePost(message)} /> */}
            <TextMessageBox disableCorrections placeholder='Escribe aqui lo que deseas'
                onSendMessage={(message) => handlePost(message)} />

        </div>
    )
}
