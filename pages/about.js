import Link from "next/link"
import Header from "../components/Header"
import Head from "next/head"

const About = () => {
  return(
    <div>
      <Head>
        <title>Clear Feed</title>
        <meta name="description" content="Sign up for Clear Feed"/>
        <link rel="icon" href="/surf.png" />
      </Head>
     
      <main>
        <div className="w-full h-screen bg-cf-light-blue">
          <Header />

          <div className='flex flex-col space-y-20 px-10 pb-10 w-full h-[calc(80%)] justify-center items-center'>
            
            <div className="flex flex-col justify-center items-left space-y-10">
            <div className="flex flex-col">
              <h2 className="font-bold text-3xl">Problem:</h2>
              <p className="text-xl">currently there is no way to get personalized content recommendations <br />
              without trusting your data to someone else.</p>
            </div>

            <div className="flex flex-col">
              <h2 className="font-bold text-3xl">Solution:</h2>
              <p className="text-xl">by creating a personalized feed on the Lens Protocol based on: <br />
              1. Your second order follows – meaning the users your follows follow. <br />
              2. and then ranking them based on how many common follows they have
              </p>         
            </div> 

            <div className="flex flex-col">
              <h2 className="font-bold text-3xl">Result:</h2>
              <p className="text-xl">A personalized and fully private feed on social media. <br />
              We store your personalized feed parameters in an NFT, meaning that you have full ownership of your feed. <br/>
              The parameters can be open for the public or private, however you want it. <br />
              </p>    
            </div>
            
            <div className="flex flex-col">
              <h2 className="font-bold text-3xl">In the future:</h2>
              <p className="text-xl">Long term vision is that the NFT feed parameters in your wallet can augment any feed you encounter in the Lens ecosystem<br />
              </p>               
            </div>
            </div>
            
            <div className="flex">
              <Link href={"/example"}>
                <button className='bg-cf-red font-bold text-3xl text-cf-cream rounded-md border-2 border-black py-3 px-10'>
                  See example
                </button>
              </Link>
            </div>

          </div>
        
        </div>      
      </main>

    </div>
  )
}






export default About
