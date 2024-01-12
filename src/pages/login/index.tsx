import logoImg from "../../assets/logo.svg"
import { Container } from "../../components/container"
import { Link, useNavigate } from "react-router-dom"
import { Input } from "../../components/input"
 
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver} from "@hookform/resolvers/zod"

import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "../../services"
import { useEffect } from "react"

const schema = z.object({
    email: z.string().email("Insira um email válido").nonempty("Este campo é obrigatório"),
    password: z.string().nonempty("Este campo é obrigatório"),
})

type FormData = z.infer<typeof schema>

export function Login (){
    const navigate = useNavigate()
    
    const { register, handleSubmit, formState: { errors }} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    useEffect(() => {
        async function handleLogout(){
            await signOut(auth)
        }
        handleLogout()
    }, [])

    function onSubmit (data: FormData){
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then((user) => {
            navigate("/dashboard", {replace: true})
            console.log("Login feito com sucesso")
            console.log(user)


        }).catch(error => {
            console.log("Erro ao fazer Login")
            console.log(error)
        })
    }

    return (
        <Container>
            <div className="w-full min-h-screen justify-center items-center flex flex-col gap-4">
                <Link to="/" className="mb-6 max-w-sm w-full">
                    <img src={logoImg} alt="logo do site" className="w-full"/>
                </Link>



                <form 
                  className="w-full mx-w-xl rounded-lg bg-white"
                  onSubmit={handleSubmit(onSubmit)}
                >

                    <div className="mb-3">
                        <Input
                            type="email"
                            placeholder="Digite seu Email" 
                            name="email"
                            error={errors.email?.message}
                            register={register}
                        />
                    </div>

                   <div className="mb-3">
                    <Input
                            type="password"
                            placeholder="Digite sua Senha" 
                            name="password"
                            error={errors.password?.message}
                            register={register}
                        />
                   </div>

                    <button type="submit" className="bg-zinc-900 font-medium text-white w-full rounded-md h-10">
                        Acessar
                    </button>
                </form>

                <Link to="/Register">
                    Ainda não possui uma conta ? Faça seu cadastro
                </Link>

            </div>
        </Container>
    )
}