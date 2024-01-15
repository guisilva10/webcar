import { FaWhatsapp } from "react-icons/fa6";

export function Whatsapp(){
    return(
        <div    className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-lg inline-flex items-center z-50">
            <a 
            className="flex justify-center items-center gap-2 font-medium text-xl"
            href="https://api.whatsapp.com/send?phone=5511948798912&text=Ola, venho da WebCarros, poderia me ajudar ?"
            target="_blank"
            >
                Suporte
                <FaWhatsapp size={28} color="#fff"/>
            </a>
        </div>
    )
}