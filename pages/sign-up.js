import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import Header from "../components/Header"
import LogInModal from "../components/Modal"

import { ethers  } from 'ethers';
import { CONTRACT_ADDRESS } from "../utils/address";
import abi from"../utils/ClearFeed.json"

import predictSentiment from "../models/sentiment"
import relations from "../models/relations"
import { round, median } from "mathjs"
import toast, { Toaster } from "react-hot-toast"

import { getPublications } from "../lensApi/queries"
import { lensProfileContext, walletContext } from "../utils/context"

const Signup = () => {

  const [step, setStep] = useState(1);
  const [modal, setModal] = useState(false)
  const router = useRouter()
  const { profile, setProfile } = useContext(lensProfileContext)
  const { account, setAccount, provider, setProvider } = useContext(walletContext)

  const mint = async () => {
    toast("Just a moment, preparing", {
      icon: '⏳',
    });
    const relationList = await relations(account)
    const relationsData = {data: relationList}

    console.log(relationsData)

    const publications = await getPublications(profile.id)
    const res = await predictSentiment(publications.data.publications.items)
    const sentiments = res.map((item) => item.res.score)
    const roundedSentiment = round(sentiments, 3)
    console.log(roundedSentiment)
    const medianSentiment = median(roundedSentiment)
    
    console.log(medianSentiment)

    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
    try {
      await contract.safeMint('0', medianSentiment.toString(), JSON.stringify(relationsData))
      
      toast.promise(
        new Promise((res, rej) => {
          contract.on('Minted', (to, tokenId) => {
            if (tokenId) {
              res()
            }
          })
          return () => {
            contract.removeAllListeners()
          }
        })
        .then(() => {
          setStep(3)
        })
        .catch((error) => console.log(error)),
          {
            loading: 'Waiting for transaction to finalize 👀',
            success: <b>Success! 🎉</b>,
            error: <b>Something did not go right 🤔</b>,
          }
      )
    }
    catch(error) {
      console.log(error)
    }
  }


    return(
        <div>
          <Toaster />
          <Head>
            <title>Clear Feed</title>
            <meta name="description" content="Sign up for Clear Feed"/>
            <link rel="icon" href="/surf.png" />
          </Head>
        
          <main>
            <div className="w-full h-screen bg-cf-light-blue">
              <Header />
              <LogInModal modal={modal} setModal={setModal} setStep={setStep}/>

              <div className='flex px-5 w-full h-[calc(80%)] justify-center items-center'>

                {/* This component is for overshadowing with the loader  */}
                {/* <div className={loading ? "fixed top-[calc(0%)] left-[calc(0%)] opacity-50 w-screen h-screen z-10 bg-black" : "hidden"}>
                  <div className="flex flex-col w-full h-full items-center justify-center">
                    <div className="flex animate-spin w-1/12 h-1/12">
                      <Spinner /> 
                    </div>
                  </div> 
                </div> */}
                {/* ends here */}

                <div className='flex flex-col space-y-10 justify-center'>
                  
                  {/* <div className="flex flex-col lg:flex-row lg:space-x-5 items-center">
                    <button
                      className="border-2 border-black rounded-md w-48 h-14 bg-cf-red text-cf-cream text-xl font-semibold disabled:opacity-30"
                      onClick={connectSoMe}
                      disabled={step === 1 ? false : true}
                      >
                        Twitter
                    </button>
                    <p className={`${step === 1 ? 'text-black' : 'text-gray-500'} text-2xl md:text-4xl font-bold`}>
                        1. Log in with your social media
                    </p>
                  </div> */}

                  <div className="flex flex-col lg:flex-row lg:space-x-5 items-center">
                    <button
                      className="border-2 rounded-md border-black w-48 h-14 bg-cf-red text-cf-cream text-xl font-semibold disabled:opacity-30"
                      onClick={() => setModal(true)}
                      disabled={step === 1 ? false : true}
                      >
                        Log in
                    </button>
                    <p className={`${step === 1 ? 'text-black' : 'text-gray-500'} text-2xl md:text-4xl font-bold`}>
                        1. Log in with Lens
                    </p>                  
                  </div> 

                  <div className="flex flex-col lg:flex-row lg:space-x-5 items-center">
                    <button
                      className="border-2 rounded-md border-black w-48 h-14 bg-cf-red text-cf-cream text-xl font-semibold disabled:opacity-30"
                      onClick={mint}
                      disabled={step === 2 ? false : true}
                      >
                        Let&apos;s do this!
                    </button>
                    <p className={`${step === 2 ? 'text-black' : 'text-gray-500'} text-2xl md:text-4xl font-bold`}>
                        2. Get your personalized feed!
                    </p>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:space-x-5 items-center">
                    <button
                      className="border-2 rounded-md border-black w-48 h-14 bg-cf-red text-cf-cream text-xl font-semibold disabled:opacity-30"
                      onClick={() => {router.push('/feed')}}
                      disabled={step === 3 ? false : true}
                      >
                        Here!
                    </button>
                    <p className={`${step === 3 ? 'text-black' : 'text-gray-500'} text-2xl md:text-4xl font-bold`}>
                        3. Enjoy your feed!
                    </p>
                  </div>

                  
                  {/* <div className="flex flex-col justify-center items-center space-y-5">
                    <p className='text-xl font-bold'>or</p>
                    <button>
                        <Image src={Btn2} alt="button" height={110*0.5} width={412*0.5} />
                    </button>        
                  </div> */}

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
