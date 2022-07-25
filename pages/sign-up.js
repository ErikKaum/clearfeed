import Head from "next/head"
import Image from "next/image"
import { useState } from "react"
import Header from "../components/Header"

import Btn2 from "../assets/Button2.svg"

const Signup = () => {
    const [step, setStep] = useState(1);

    const connectSoMe = () => {
        setStep(2)
    }

    const connectWallet = () => {
        setStep(3)
    }

    const mint = () => {
        setStep(1)
    }

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

              <div className='flex px-5 w-full h-[calc(80%)] justify-center items-center'>
        
                <div className='flex flex-col space-y-10 justify-center'>
                  
                  <div className="flex flex-col lg:flex-row lg:space-x-5 items-center">
                    <button
                      className="border-2 border-black w-48 h-14 bg-cf-red text-cf-cream text-xl font-semibold disabled:opacity-30"
                      onClick={connectSoMe}
                      disabled={step === 1 ? false : true}
                      >
                        Twitter
                    </button>
                    <p className={`${step === 1 ? 'text-black' : 'text-gray-500'} text-2xl md:text-4xl font-bold`}>
                        1. Log in with your social media
                    </p>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:space-x-5 items-center">
                    <button
                      className="border-2 border-black w-48 h-14 bg-cf-red text-cf-cream text-xl font-semibold disabled:opacity-30"
                      onClick={connectWallet}
                      disabled={step === 2 ? false : true}
                      >
                        Connect
                    </button>
                    <p className={`${step === 2 ? 'text-black' : 'text-gray-500'} text-2xl md:text-4xl font-bold`}>
                        2. Connect your wallet
                    </p>                  
                  </div> 

                  <div className="flex flex-col lg:flex-row lg:space-x-5 items-center">
                    <button
                      className="border-2 border-black w-48 h-14 bg-cf-red text-cf-cream text-xl font-semibold disabled:opacity-30"
                      onClick={mint}
                      disabled={step === 3 ? false : true}
                      >
                        Let&apos;s do this!
                    </button>
                    <p className={`${step === 3 ? 'text-black' : 'text-gray-500'} text-2xl md:text-4xl font-bold`}>
                        3. Get your personalized feed!
                    </p>
                  </div>
                  
                  <div className="flex flex-col justify-center items-center space-y-5">
                    <p className='text-xl font-bold'>or</p>
                    <button>
                        <Image src={Btn2} alt="button" height={110*0.5} width={412*0.5} />
                    </button>        
                  </div>

                </div>
              </div> 
        
        
            </div>
        
          </main>
        
        
          <footer>
          </footer>
        </div>
    )
}

export default Signup