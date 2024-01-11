import logoImg from  "../../assets/logo.svg"
import { Link } from "react-router-dom"
import { FiUser, FiLogIn } from "react-icons/fi"

export function Header (){
    const signed = true;
    const loadingAuth = false;



    return (
        <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4">
          <header className="flex w-full max-w-7xl px-4 mx-auto items-center justify-between">
            <Link to="/">
             <img 
                src={logoImg} 
                alt="logo do site" />
            </Link>


            {!loadingAuth && signed && (
                <div className="rounded-full border-2 p-1 border-gray-900">
                    <Link to="/dashboard">
                    <FiUser size={24} color="#000"/> 
                    </Link>
                </div>
            )}

            {!loadingAuth && !signed && (
                 <div className="rounded-full border-2 p-1 border-gray-900">
                    <Link to="/login">
                    <FiLogIn size={24} color="#000"/> 
                    </Link>
                 </div>
            )}


          </header>
        </div>
    )
}