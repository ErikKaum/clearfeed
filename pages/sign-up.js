import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Header from "../components/Header"

import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider'
import { CONTRACT_ADDRESS } from "../utils/address";
import abi from "../utils/ClearFeed.json"

import Spinner from "../assets/spinner"
import Btn2 from "../assets/Button2.svg"
import { TwitterApi } from 'twitter-api-v2';

import predictSentiment from "../models/sentiment"
import { round, median } from "mathjs"
import toast, { Toaster } from "react-hot-toast"

const Signup = ({variables}) => {

    const [step, setStep] = useState(1);
    const [currentAccessToken, setAccessToken] = useState(null)
    const [currentProvider, setProvider] = useState(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const clientId = variables.clientId
    const clientSecret = variables.clientSecret
    const callbackURL = variables.callbackURL

    const twitterClient = new TwitterApi({
      clientId: clientId,
      clientSecret: clientSecret,
    });

    useEffect(() => {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        setStep(2);
      }
    },[])

    useEffect(() => {
        const logging = async () => {
            if (router.query.state) {
                const codeVerifier = localStorage.getItem('codeVerifier')
                const res = await fetch('api/callback?' + new URLSearchParams({
                    state: router.query.state,
                    code: router.query.code,
                    codeVerifier : codeVerifier
                }))
                const currentAccesToken = await res.json()
                setAccessToken(currentAccesToken.accessToken)
                localStorage.setItem('accessToken', currentAccesToken.accessToken)
                setStep(2)
            }    
        }
        logging()
    },[router])
    
    const connectSoMe = async() => {
        const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(callbackURL, { scope: ['like.read', 'tweet.read', 'users.read',] });
        localStorage.setItem('codeVerifier', codeVerifier)
        router.push(url)
    }

    const connectWallet = async () => {
      const ethereum = await detectEthereumProvider({mustBeMetaMask : true})
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        let accounts 
        try {
          accounts = await provider.send("eth_requestAccounts", []);
          setProvider(provider)
          setStep(3)
        } catch(error) {
          toast("Can't continue without connecting wallet", {
            icon: '🤷',
          });
        }
    }
  }

  const mint = async () => {
    // setLoading(true)
    toast("Just a moment, preparing", {
      icon: '⏳',
    });

    const tweets = await getLikedTweets()
    const sentiments = await predictSentiment(tweets)

    const roundedSentiment = round(sentiments, 3)
    // console.log(roundedSentiment)
    const medianSentiment = median(roundedSentiment)
    
    // console.log(medianSentiment)

    const signer = currentProvider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
    try {
      // toast("Waiting for the transaction to finalize... soon", {
      //   icon: '👀',
      // });  
      const tnx = await contract.safeMint('0', medianSentiment.toString(), '0')
      toast.promise(
        tnx.wait(),
         {
           loading: 'Waiting for transaction to finalize 👀',
           success: <b>Success! 🎉</b>,
           error: <b>Something did not go right 🤔</b>,
         }
       );      
      // contract.on('Minted', (to, tokenId) => {
      //   toast("Success!", {
      //     icon: '🎉',
      //   });
      //   setLoading(false)
      //   setStep(4)
      // })
      // return () => {
      //   contract.removeAllListeners();
      // }
    }
    catch(error) {
      console.log(error)
      setLoading(false)
    }
  }

  const getLikedTweets = async () => {
    const accessToken = localStorage.getItem('accessToken')
    const res = await fetch('api/get-tweets?' + new URLSearchParams({
      accessToken: accessToken,
    }))
    const data = await res.json()
    const tweets = data.likedTweets._realData.data
    return tweets
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

              <div className='flex px-5 w-full h-[calc(80%)] justify-center items-center'>

                {/* This component is for overshadoing with the loader  */}
                <div className={loading ? "fixed top-[calc(0%)] left-[calc(0%)] opacity-50 w-screen h-screen z-10 bg-black" : "hidden"}>
                  <div className="flex flex-col w-full h-full items-center justify-center">
                    <div className="flex animate-spin w-1/12 h-1/12">
                      <Spinner /> 
                    </div>
                  </div> 
                </div>
                {/* ends here */}

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

                  <div className="flex flex-col lg:flex-row lg:space-x-5 items-center">
                    <button
                      className="border-2 border-black w-48 h-14 bg-cf-red text-cf-cream text-xl font-semibold disabled:opacity-30"
                      onClick={() => {router.push('/feed')}}
                      disabled={step === 4 ? false : true}
                      >
                        Here!
                    </button>
                    <p className={`${step === 4 ? 'text-black' : 'text-gray-500'} text-2xl md:text-4xl font-bold`}>
                        4. Enjoy your feed!
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

export async function getStaticProps() {

  let callbackURL
  if (process.env.NODE_ENV === 'development') {
    callbackURL = process.env.TWITTER_CALLBACK_URL_LOCAL
  } else {
    if (process.env.TWITTER_CALLBACK_URL_DEV) {
      callbackURL = process.env.TWITTER_CALLBACK_URL_DEV
    } else {
      callbackURL = process.env.TWITTER_CALLBACK_URL_PROD
    }
  }
  

  const variables = ({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret : process.env.TWITTER_CLIENT_SECRET,
    callbackURL : callbackURL
  })
  return {
    props: {
      variables
    }
  }
}

export default Signup
