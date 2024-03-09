import { FormEvent, useState } from "react"

interface Props {
    onSendMessage: (message: string) => void,
    placeholder?: string,
    disableCorrections?: boolean,
}

export const TextMessageBox = ({ onSendMessage, disableCorrections = false, placeholder }: Props) => {
    const [message, setMessage] = useState('')

    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (message.trim().length === 0) return;
        onSendMessage(message);
        setMessage('')


    }

    return (
        <form onSubmit={handleSendMessage} className="flex items-center h-16 rounded-xl w-full px-4">
            <div className=" flex-grow">
                <div className=" relative w-full">

                    <input type="text" autoFocus name="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={placeholder}
                        autoComplete={disableCorrections ? 'on' : 'off'}
                        autoCorrect={disableCorrections ? 'on' : 'off'}
                        spellCheck={disableCorrections ? 'true' : 'false'}
                        className="flex w-full 
                         rounded-xl border-0 bg-white bg-opacity-5 text-gray-200 focus:outline-none focus:border-indigo-300 pl-4 h-10"
                    />
                </div>
            </div>

            <div className="ml-4">
                <button className="btn-primary">
                    <span className="mr-2">Enviar</span>
                    <i className="fa-regular fa-paper-plane" />
                </button>
            </div>
        </form>
    )
}
