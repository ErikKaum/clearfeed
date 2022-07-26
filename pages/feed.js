import Head from "next/head"
import Header from "../components/Header"


const Feed = () => {
    return(
        <div>
        <Head>
          <title>Clear Feed</title>
          <meta name="description" content="Personalized content while keeping your data private" />
          <link rel="icon" href="/surf.png" />
        </Head>
  
        <main>
          <div className="w-full h-screen bg-cf-light-blue">
            <Header />
            <div className='flex px-5 w-full h-[calc(80%)] justify-center items-center'>
                <p className="font-bold text-6xl">Feed coming soon 👀</p>
            </div>

          </div>

        </main>
  
  
        <footer>
        </footer>
      </div>
    )
}


export default Feed