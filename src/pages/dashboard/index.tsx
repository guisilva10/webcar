import { useContext, useEffect, useState } from "react";
import { Container } from "../../components/container";
import { PanelHeader } from "../../components/panelheader";
import { FiTrash2 } from "react-icons/fi"
import { collection, getDocs, where, query, doc, deleteDoc} from "firebase/firestore";
import { db, storage } from "../../services";
import { AuthContext } from "../../contexts/AuthContext";
import { deleteObject, ref } from "firebase/storage";
import toast from "react-hot-toast";

interface CarProps{
    id: string;
    name: string;
    year: string;
    uid: string;
    price: string | number;
    city: string;
    km: string;
    images: ImagesCarsProps[];
}

interface ImagesCarsProps{
    name: string;
    uid: string;
    url: string;
}

export function Dashboard (){
    const [cars, setCars] = useState<CarProps[]>([])
    const {user} = useContext(AuthContext)
    

    useEffect(() => {
        function loadCars(){
            if(!user?.uid){
                return;
            }

            const carsRef = collection(db, "cars")
            const queryRef = query(carsRef, where("uid", "==", user.uid))
    
            getDocs(queryRef)
            .then((snapshot) => {
                const listcars = [] as CarProps[];
    
                snapshot.forEach( doc => {
                    listcars.push({
                        id: doc.id,
                        name: doc.data().name,
                        year: doc.data().year,
                        uid: doc.data().uid,
                        price: doc.data().price,
                        city: doc.data().city,
                        km: doc.data().km,
                        images: doc.data().images
                    })
                })
    
                setCars(listcars)
            })
        }
        loadCars();
    }, [user])


    async function handleDeleteCar(car: CarProps){
        const itemCar = car;
        const docRef = doc(db, "cars", itemCar.id)
        await deleteDoc(docRef)


        itemCar.images.map(async (image) => {
            const imagePath = `images/${image.uid}/${image.name}`;
            const imageRef = ref(storage, imagePath);

           
            try{
             await deleteObject(imageRef)
             setCars(cars.filter(car => car.id != itemCar.id))
            }catch(error){
                console.log("Erro ao deletar essa imagem")
                toast.error("Ops, algo deu errado, tente novamente!")
            }
        })
        
    }


    return (
        <Container>
            <PanelHeader/>

            <p className="my-1">Ola, {user?.name}</p>
            <strong className="mb-6font-bold text-xl">Seus veículos:</strong>
            <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">  
            {cars.map(car => (
                <section key={car.id} className="w-full rounded-lg relative bg-white">
                   
                    <button 
                    className="absolute w-14 h-14 flex rounded-full items-center justify-center bg-white right-2 top-2 drop-shadow"
                    onClick={() => handleDeleteCar(car)}
                    >
                        <FiTrash2 size={26} color="#000"/>
                    </button>
                    <img
                        className="w-full rounded-lg max-h-70 mb-2" 
                        src={car.images[0].url} 
                        alt="imagem do carro" 
                       
                    />
                    <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>
                    <div className="flex flex-col px-2">
                        <span className="text-zinc-700">
                            Ano - {car.year} | {car.km}Km
                        </span>
                        <strong className="font-bold text-black mt-4">
                            R$ {car.price}
                        </strong>
                    </div>

                    <div className="w-full bg-slate-300 h-px my-2"></div>
                    <div className="px-2 pb-2">
                        <span className="text-black">{car.city}</span>
                    </div>
                </section>
            ))}

            </main>
        </Container>
    )
}