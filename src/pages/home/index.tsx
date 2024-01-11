import { Container } from "../../components/container";

export function Home (){
    return (
       <Container>
         <section className="bg-white p-4 w-full rounded-lg max-w-3xl mx-auto flex justify-center items-center gap-2">
            <input 
            className="rounded-lg w-full border-2 outline-none h-9 px-3"
            placeholder="Digite o carro que deseja"/>
            <button className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg">
                Buscar
            </button>
         </section>

         <h1 className="text-center font-bold mt-6 text-2xl mb-4">
            Carros novos e usados em todo brasil
        </h1>

        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <section className="w-full bg-white rounded-lg">

                <img 
                 src="https://image.webmotors.com.br/_fotos/anunciousados/gigante/2023/202311/20231128/fiat-pulse-1.0-turbo-200-flex-audace-cvt-wmimagem17235195057.jpg?s=fill&w=1920&h=1440&q=75" 
                 alt="imagem do fiat PULSE" 
                 className="w-full rounded-lg max-h-72 mb-2 hover:scale-105 transition-all"
                />

                <p className="font-bold mt-1 mb-2 px-2">Fiat Pulse</p>


                <div className="px-2 flex flex-col">
                    <span className="text-zinc-700 mb-6">Ano - 2018 | 23.000km</span>
                    <strong className="text-black font-medium text-xl">R$80.000</strong>
                </div>

                <div className="w-full h-px bg-slate-300 my-2 "></div>

                <div className="pb-2 px-2"> 
                    <span className="text-zinc-700">Cajamar - SP</span>
                </div>

            </section>
        </main>



       </Container>
    )
}