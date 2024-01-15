import { Link } from "react-router-dom";
import { Container } from "../../components/container";
import { db } from "../../services";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { useState, useEffect } from "react";




interface CarsProps{
    id: string;
    name: string;
    year: string;
    uid: string;
    price: string | number;
    city: string;
    km: string;
    images: CarsImagesProps[];
}
interface CarsImagesProps{
    name: string;
    uid: string;
    url: string;
}

export function Home (){
const [ cars, setCars ] = useState<CarsProps[]>([])
const [ loadImages, setLoadImages ] = useState<string[]>([])
const [input, setInput ] = useState("")


    useEffect(() => {
            loadCars();
    }, [])

    function loadCars(){
        const carsRef = collection(db, "cars")
        const queryRef = query(carsRef, orderBy("created", "desc"))

        getDocs(queryRef)
        .then((snapshot) => {
            const listcars = [] as CarsProps[];

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

    function handleImageLoad(id: string){
        setLoadImages((prevImageLoaded) => [...prevImageLoaded, id] )
    }


   async function handleSearchCar(){
        if(input === ''){
            loadCars();
            return;
        }

        setCars([]);
        setLoadImages([]);


        const q = query(collection(db, "cars"),
        where("name", ">=", input.toUpperCase()),
        where("name", "<=", input.toUpperCase() + "\uf8ff")
        )

        const querySnapshot = await getDocs(q)

        const listcars = [] as CarsProps[];

        querySnapshot.forEach(doc => {
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
    }



    return (
       <Container>
         <section className="bg-white p-4 w-full rounded-lg max-w-3xl mx-auto flex justify-center items-center gap-2">
            <input 
            className="rounded-lg w-full border-2 outline-none h-9 px-3"
            placeholder="Digite o carro que deseja"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            />
            <button 
            className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
            onClick={handleSearchCar}
            >
                Buscar
            </button>
         </section>

         <h1 className="text-center font-bold mt-6 text-2xl mb-4">
            Carros novos e usados em todo brasil
        </h1>

        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
           {cars.map(car => (
            <Link key={car.id} to={`/car/${car.id}`}>
                <section  className="w-full bg-white rounded-lg">
                    <div 
                    style={{ display: loadImages.includes(car.id) ? "none" : "block"}}
                    className="h-72 w-full bg-slate-300 rounded-lg"
                    ></div>
                    <img 
                    src={car.images[0].url}
                    alt="imagem do fiat PULSE" 
                    className="w-full rounded-lg max-h-72 mb-2 hover:scale-105 transition-all"
                    onLoad={() => handleImageLoad(car.id)}
                    style={{ display: loadImages.includes(car.id) ? "block" : "none"}}
                    />

                    <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>


                    <div className="px-2 flex flex-col">
                        <span className="text-zinc-700 mb-6">Ano - {car.year} | {car.km}km</span>
                        <strong className="text-black font-medium text-xl">R${car.price}</strong>
                    </div>

                    <div className="w-full h-px bg-slate-300 my-2 "></div>

                    <div className="pb-2 px-2"> 
                        <span className="text-zinc-700">{car.city}</span>
                    </div>

                </section>
            </Link>
           ))}
        </main>



       </Container>
    )
}