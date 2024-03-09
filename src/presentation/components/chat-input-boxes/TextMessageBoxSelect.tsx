import { FormEvent, useState } from "react"

interface Props {
    onSendMessage: (message: string, selectedOption: string) => void,
    placeholder?: string,
    disableCorrections?: boolean,
    options: Option[],
}

interface Option {
    id: string,
    text: string
}

export const TextMessageBoxSelect = ({ options, onSendMessage, disableCorrections = false, placeholder }: Props) => {
    const [message, setMessage] = useState('')

    const [selectedOption, setSelectedOption] = useState<string>('')

    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (message.trim().length === 0) return;
        onSendMessage(message, selectedOption);
        setMessage('')


    }

    return (
        <form onSubmit={handleSendMessage} className="flex items-center h-16 rounded-xl w-full px-4">
            <div className=" flex-grow">
                <div className=" flex">

                    <input type="text" autoFocus name="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={placeholder}
                        autoComplete={disableCorrections ? 'on' : 'off'}
                        autoCorrect={disableCorrections ? 'on' : 'off'}
                        spellCheck={disableCorrections ? 'true' : 'false'}
                        className="flex w-full 
                         rounded-xl border-0 bg-white bg-opacity-5 text-gray-200 focus:outline-none  pl-4 h-10"
                    />

                    <select
                        name="select"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="w-2/5 ml-5 pl-4 h-10  rounded-xl bg-white bg-opacity-5 text-gray-200 focus:outline-none"
                    >
                        <option className="bg-gray-700" >Seleccione una opcion</option>
                        {
                            options.map(opt => (
                                <option className="bg-gray-700   " key={opt.id}>{opt.text}</option>
                            ))
                        }
                    </select>
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
