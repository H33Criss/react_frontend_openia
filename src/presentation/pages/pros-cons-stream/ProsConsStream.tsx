import { useRef, useState } from 'react'
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from '../../components'
import { prosConsStreamGeneratorUseCase } from '../../../core/use-cases'

interface Message {
    text: string,
    isGPT: boolean,
}

export const ProsConsStream = () => {
    const abortController= useRef(new AbortController);
    const isRunning= useRef(false)
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])

    const handlePost = async (text: string) => {
        if(isRunning.current){
            abortController.current.abort();
            abortController.current=new AbortController();
        }
        setIsLoading(true)
        isRunning.current=true;
        setMessages((prev) => [...prev, { text, isGPT: false }])
        
        const stream =  prosConsStreamGeneratorUseCase(text, abortController.current.signal);
        setIsLoading(false)
        setMessages((messages)=>[...messages,{text:'', isGPT:true}]);

        for await(const text of stream){
            setMessages((messages)=>{
                const newMessages=[...messages];
                newMessages[newMessages.length-1].text=text;
                return newMessages;
            });
        }

        isRunning.current=false;


        // const reader = await prosConsStreamUseCase(text);

        // setIsLoading(false)
        // if(!reader) return alert('El reader no se pudo generar')

        // const decoder = new TextDecoder();
        // let message='';
        // setMessages((messages)=>[...messages,{text:message, isGPT:true}]);

        // while(true){
        //     const {value, done} = await reader.read();
        //     if(done) break;

        //     const decodedChunk =  decoder.decode(value,{stream:true})
        //     message+= decodedChunk;
        //     setMessages((messages)=>{
        //         const newMessages=[...messages];
        //         newMessages[newMessages.length-1].text=message;
        //         return newMessages;
        //     });
        // }

        //TODO: Añadir el mensaje de isGPT en true

    }

    return (
        <div className='chat-container'>
            <div className='chat-messages'>
                <div className='grid grid-cols-12 gap-y-2'>
                    <GptMessage text='¿Que deseas comparar hoy? Te dire los pros y contras.' />

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
