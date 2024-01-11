import logoImg from "../../assets/logo.svg"
import { Container } from "../../components/container"
import { Link } from "react-router-dom"
 


export function Login (){
    return (
        <Container>
            <div className="w-full min-h-screen justify-center items-center flex flex-col gap-4">
                <Link to="/" className="mb-6 max-w-sm w-full">
                    <img src={logoImg} alt="logo do site" className="w-full"/>
                </Link>
            </div>


            <form 
             className="w-full mx-w-xl rounded-lg bg-white"
            >

            </form>
        </Container>
    )
}