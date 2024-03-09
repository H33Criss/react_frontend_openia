import { FormEvent, useRef, useState } from "react"

interface Props {
    onSendMessage: (message: string) => void,
    placeholder?: string,
    disableCorrections?: boolean,
    accept?: string,
}

export const TextMessageBoxFile = ({ accept, onSendMessage, disableCorrections = false, placeholder }: Props) => {
    const [message, setMessage] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>()
    const inputFileRef = useRef<HTMLInputElement>(null)
    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (message.trim().length === 0) return;
        onSendMessage(message);
        setMessage('')


    }

    return (
        <form onSubmit={handleSendMessage} className="flex items-center h-16 rounded-xl w-full px-4">
            <div className="mr-3">
                <button
                    onClick={() => inputFileRef.current?.click()}
                    type="button" className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                    <i className="fa-solid fa-paperclip text-xl" />
                </button>
                <input
                    hidden
                    onChange={(e) => setSelectedFile(e.target.files?.item(0))}
                    accept={accept} type="file" ref={inputFileRef} />
            </div>

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
                <button
                    disabled={!selectedFile}
                    className="btn-primary">
                    {
                        (!selectedFile)
                            ? <span className="mr-2">Enviar</span>
                            : <span className="mr-2">{selectedFile.name.substring(0, 10) + '...'}</span>
                    }
                    <i className="fa-regular fa-paper-plane" />
                </button>
            </div>
        </form>
    )
}
