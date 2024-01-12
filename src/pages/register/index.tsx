import { useEffect, useContext } from "react"
import logoImg from "../../assets/logo.svg"
import { Container } from "../../components/container"
import { Link, useNavigate } from "react-router-dom"
import { Input } from "../../components/input"
 
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver} from "@hookform/resolvers/zod"


import { auth } from "../../services"
import { createUserWithEmailAndPassword, signOut, updateProfile} from "firebase/auth"
import { AuthContext } from "../../contexts/AuthContext"




const schema = z.object({
    name: z.string().nonempty("Este campo é obrigatório"),
    email: z.string().email("Insira um email válido").nonempty("Este campo é obrigatório"),
    password: z.string().min(6, "A senha deve conter no minímo 6 caracteres").nonempty("Este campo é obrigatório"),
})

type FormData = z.infer<typeof schema>

export function Register (){
    const { handleInfoUser } = useContext(AuthContext)
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

 async  function onSubmit (data: FormData){
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async(user) => {
            await updateProfile(user.user,{
                displayName: data.name



            })
            handleInfoUser({
                name: data.name,
                email: data.email,
                uid: user.user.uid
            })
            console.log("Conta cadastrada com sucesso!")
            navigate("/dashboard", {replace: true})
        })
        .catch(error => {
            console.log("Erro ao cadastrar conta")
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
                            type="text"
                            placeholder="Digite seu Nome Completo" 
                            name="name"
                            error={errors.name?.message}
                            register={register}
                        />
                    </div>
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
                        Cadastrar
                    </button>
                </form>

                <Link to="/Login">
                    Já possui uma conta ? Faça o Login
                </Link>
            </div>
        </Container>
    )
}