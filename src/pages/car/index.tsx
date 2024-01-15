import { useState, useEffect } from "react";
import { Container } from "../../components/container";
import { FaWhatsapp } from "react-icons/fa";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services";

import { Swiper, SwiperSlide } from "swiper/react";

interface CarProps{
    id: string
    name: string
    model: string
    year: string
    km: string
    city: string
    price: string | number
    whatsapp: string
    created: string
    description: string
    uid: string
    owner: string
    images: ImagesCarProps[]
}


interface ImagesCarProps{
    uid: string
    name: string
    url: string
}

export function CarDetail (){
    const { id } = useParams()
    const [car, setCars] = useState<CarProps>()
    const [ sliderPerView, setSliderPerView] = useState<number>(2)
    const navigate = useNavigate()

    useEffect(() => {
        async function loadCar() {
            if(!id){
                return;
            }
            const docRef = doc(db, "cars", id)
            getDoc(docRef).then((snapshot) => {

                if(!snapshot.data()){
                    navigate("/")
                }

                setCars({
                    id: snapshot.id,
                    name: snapshot.data()?.name,
                    model: snapshot.data()?.model,
                    year: snapshot.data()?.year,
                    km: snapshot.data()?.km,
                    city: snapshot.data()?.city,
                    price: snapshot.data()?.price,
                    created: snapshot.data()?.created,
                    whatsapp: snapshot.data()?.whatsapp,
                    uid: snapshot.data()?.uid,
                    description: snapshot.data()?.description,
                    owner: snapshot.data()?.owner,
                    images: snapshot.data()?.images
                })
            })
        }

        loadCar();
    }, [id])

    useEffect(() => {
        function handleResize(){
            if(window.innerWidth < 720){
                setSliderPerView(1)
            }else{
                setSliderPerView(2)
            }

        }
        handleResize();

        window.addEventListener("resize", handleResize)

        return() => {
            window.removeEventListener("reset", handleResize)
        }
    }, [])

    return (
        <Container>

          {car && (
              <Swiper
                slidesPerView={sliderPerView}
                pagination={{clickable: true}} 
                >
                {car?.images.map(image => (
                    <SwiperSlide key={image.uid}>
                        <img src={image.url} className="w-full h-96 object-cover" />
                    </SwiperSlide>
                ))}
            </Swiper>
          )}


            {car && (
                <main className="w-full bg-white rounded-lg p-6 my-4">
                    <div className="flex flex-col sm:flex-row mb-4 justify-between items-center">
                        <h1 className="text-3xl text-black font-bold">{car?.name}</h1>
                        <h1  className="text-3xl text-black font-bold">R${car?.price}</h1>
                    </div>
                    <p>{car?.model}</p>

                    <div className="w-full gap-6 my-4 flex">
                        <div className="flex flex-col gap-4">
                            <div>
                                <p>Cidade</p>
                                <strong>{car?.city}</strong>
                            </div>
                            <div>
                                <p>Ano</p>
                                <strong>{car?.year}</strong>
                            </div>
                         </div>
                        <div className="flex flex-col gap-4">
                            <div>
                                <p>KM</p>
                                <strong>{car?.km}</strong>
                            </div>
                         </div>
                    </div>

                    <strong>Descrição:</strong>
                    <p className="mb-4">{car?.description}</p>

                    <strong>Telefone | Whatsapp</strong>
                    <p className="mb-4">{car?.whatsapp}</p>

                    <a
                     href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá, vi esse ${car?.name} e fiquei interessado!`}
                     target="_blank"
                     className="bg-green-500 text-white w-full flex items-center justify-center gap-3 h-12 rounded-lg text-xl font-medium cursor-pointer"
                    >
                        Conversar com o vendedor
                        <Link to={car?.whatsapp}>
                         <FaWhatsapp size={26} color="#fff"/>
                        </Link>
                    </a>
                </main>
            )}
        </Container>
    )
}