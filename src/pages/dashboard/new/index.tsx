import { ChangeEvent, useState, useContext } from "react";
import { Container } from "../../../components/container";
import { PanelHeader } from "../../../components/panelheader";
import { FiUpload, FiTrash } from "react-icons/fi";

import { useForm } from "react-hook-form";
import { Input } from "../../../components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthContext } from "../../../contexts/AuthContext";
import { v4 as uuidV4} from "uuid"

import { addDoc, collection } from "firebase/firestore";

import { storage, db } from "../../../services";
import {
     ref, 
     getDownloadURL, 
     deleteObject, 
     uploadBytes 
} from "firebase/storage";
import { toast } from "react-hot-toast";


const schema = z.object({
    name: z.string().nonempty("O campo nome é obrigatório"),
    model: z.string().nonempty("O campo modelo é obrigatório"),
    year: z.string().nonempty("O campo ano do carro é obrigatório"),
    km: z.string().nonempty("O campo KM é obrigatório"),
    price: z.string().nonempty("O campo preço é obrigatório"),
    city: z.string().nonempty("O campo cidade é obrigatório"),
    whatsapp: z.string().min(1, "O whatsap é obrigatorio").refine((value) => /^(\d{11,12})$/.test(value),{
        message: "Este número de whatsapp é invalido"
    }),
    description: z.string().nonempty("O campo de descrição é obrigatório")
})


type FormData = z.infer<typeof schema>

interface ImageItemProps {
    uid: string
    name: string
    previewUrl: string
    url: string
}

export function NewCar (){
    const { user } = useContext(AuthContext)

    const { register, handleSubmit, formState: { errors }, reset} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    const [ carImages, setCarImages] = useState<ImageItemProps[]>([])


  async  function handleFile(e: ChangeEvent<HTMLInputElement>){
        if(e.target.files && e.target.files[0]){
            const image = e.target.files[0]
            
            if(image.type === "image/jpeg"  || image.type === "image/png"){
              await  handleUpdate(image)
            }else{
                alert("Envie uma imagem jpeg ou png")
            }
        }
    }


    async function handleUpdate(image: File){
        if(!user?.uid){
            return;
        }

        const currentUid = user?.uid
        const uidImage = uuidV4()

        const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

        uploadBytes(uploadRef, image)
        .then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadUrl) => {
                const imageItem = {
                    name: uidImage,
                    uid: currentUid,
                    previewUrl: URL.createObjectURL(image),
                    url: downloadUrl
                }
                setCarImages((images) => [...images, imageItem])
            })
        })
    }

    function onSubmit(data: FormData){
        if(carImages.length === 0){
            alert("Envie uma imagem deste carro")
            return;
        }


        const carListImages = carImages.map(car => {
            return {
                uid: car.uid,
                name: car.name,
                url: car.url
            }
        })

        addDoc(collection(db, "cars"), {
            name: data.name.toUpperCase(),
            model: data.model,
            year: data.year,
            km: data.km,
            price: data.price,
            city: data.city,
            whatsapp: data.whatsapp,
            description: data.description,
            created: new Date(),
            owner: user?.name,
            uid: user?.uid,
            images: carListImages
        }).then(() => {
            reset();
            setCarImages([]);
            console.log("Carro cadastrado com sucesso")
            toast.success("Carro cadastrado com sucesso")
        }).catch((error) => {
            console.log(error)
            console.log("Erro ao cadastrar veiculo")
            toast.error("Ops, algo deu errado!, tente novamente")
        })
}


async function handleDeleteImage(item: ImageItemProps){
    const imagePth = `images/${item.uid}/${item.name}`

    const imageRef = ref(storage, imagePth)

    try{
    await deleteObject(imageRef)
    toast.success("Imagem deletada com sucesso!")
    setCarImages(carImages.filter((car) => car.url !== item.url))
    }catch{
        console.log("Erro ao deletar")
        toast.error("Ops, algo deu errado, tente novamente!")
    }
}

    return (
        <Container>
            <PanelHeader/>

            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 ">
                <button className="border-2 w-48 rounded-lg cursor-pointer flex items-center justify-center md:w-42 h-32 border-gray-600">
                  <div className="absolute cursor-pointer">
                  <FiUpload size={24} color="#000"/>
                  </div>
                  <div className="cursor-pointer">
                    <input type="file" accept="image" className="opacity-0 cursor-pointer" onChange={handleFile}/>
                  </div>
                </button>
                {carImages.map(item => (
                    <div key={item.name} className="w-full h-32 flex justify-center items-center relative">
                        <button className="absolute" onClick={() => handleDeleteImage(item)}>
                            <FiTrash size={28} color="#fff"/>
                        </button>
                        <img src={item.previewUrl} alt="Foto do carro" className="rounded-lg w-full h-32 object-cover" />
                    </div>
                ))}
            </div>

            <div className="w-full rounded-lg bg-white p-3 flex flex-col sm:flex-row items-center gap-2 mt-2">
                <form 
                className="w-full"
                onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="mb-3">
                        <p className="mb-2 font-medium">
                            Nome do carro
                        </p>
                        <Input
                            type="text"
                            register={register}
                            name="name"
                            error={errors.name?.message}
                            placeholder="EX: Onix JOY ..."
                        />

                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">
                            Modelo do carro
                        </p>
                        <Input
                            type="text"
                            register={register}
                            name="model"
                            error={errors.model?.message}
                            placeholder="EX: Onix 1.0 flex manual  ..."
                        />
                    </div>

                    <div className="w-full items-center gap-4 flex-row flex mb-3">
                        <div className="w-full">
                            <p className="mb-2 font-medium">
                                Ano do carro
                            </p>
                            <Input
                                type="text"
                                register={register}
                                name="year"
                                error={errors.year?.message}
                                placeholder="EX: 2018/2019  ..."
                            />
                        </div>
                        
                        <div className="w-full">
                            <p className="mb-2 font-medium">
                                KM do carro
                            </p>
                            <Input
                                type="text"
                                register={register}
                                name="km"
                                error={errors.km?.message}
                                placeholder="EX: 23.000km ..."
                            />
                         </div>
                    </div>


                    <div className="w-full items-center gap-4 flex-row flex mb-3">
                        <div className="w-full">
                            <p className="mb-2 font-medium">
                                Telefone / Whatsapp para contato
                            </p>
                            <Input
                                type="text"
                                register={register}
                                name="whatsapp"
                                error={errors.whatsapp?.message}
                                placeholder="EX: 011 9 98788909  ..."
                            />
                        </div>
                        
                        <div className="w-full">
                            <p className="mb-2 font-medium">
                                Cidade
                            </p>
                            <Input
                                type="text"
                                register={register}
                                name="city"
                                error={errors.city?.message}
                                placeholder="EX: Cajamar - São Paulo ..."
                            />
                         </div>
                    </div>
                    
                    <div className="mb-3">
                        <p className="mb-2 font-medium">
                            Preço do carro
                        </p>
                        <Input
                            type="text"
                            register={register}
                            name="price"
                            error={errors.price?.message}
                            placeholder="EX: 82.000,00 ..."
                        />

                    </div>


                    <div className="mb-3">
                        <p className="mb-2 font-medium">
                            Descrição do carro do carro
                        </p>
                        <textarea 
                         className="w-full rounded-md border-2 h-24 px-2"
                         {...register("description")}
                         name="description"
                         id="description"
                         placeholder="Digite a descrição completa do carro"
                        />
                        {errors.description && <p className=" mb-1 text-red-500">{errors.description.message}</p>}

                    </div>

                <button type="submit" className="rounded-md font-medium text-white bg-zinc-900 w-full h-10">
                    Cadastrar Veículo
                </button>

                </form>
            </div>
        </Container>
    )
}