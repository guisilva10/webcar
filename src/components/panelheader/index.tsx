import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services";

export function PanelHeader(){

    async function handleSignOut(){
        await signOut(auth)
    }



    return (
       <div className="w-full items-center flex h-10 bg-red-500 rounded-lg text-white font-medium gap-4 px-4 mb-4">
         <Link to="/dashboard">
            Dashboard
        </Link>
        <Link to="/dashboard/new">
            Adicionar Carro
        </Link>

        <button onClick={handleSignOut} className="ml-auto">
            Sair
        </button>
       </div>
    )
}