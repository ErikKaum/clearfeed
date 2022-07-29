import Image from "next/image"
import { useState } from "react"

import metamask from '../assets/metamask.png'
import walletconnect from '../assets/walletconnect.png'
import lens from '../assets/lens.png'

import { ApolloClient, InMemoryCache } from '@apollo/client'
import { gql } from '@apollo/client'

import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from "ethers"

import toast, { Toaster } from "react-hot-toast"

const LogInModal = ({modal, setModal, setStep}) => {

  const apolloClient= new ApolloClient({
    uri: 'https://api.lens.dev',
    cache: new InMemoryCache(),
  })
      

  const [currentProvider, setProvider] = useState(null)
  const [currentAddress, setCurrentAddress] = useState()
  const [logInLens, setLogInLens] = useState(false)
  
  const connectWallet = async () => {
    const ethereum = await detectEthereumProvider({mustBeMetaMask : true})
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      let accounts
      try {
        accounts = await provider.send("eth_requestAccounts", []);
        setProvider(provider)
        setCurrentAddress(accounts[0])
        setLogInLens(true)
        // setStep(3)
      } catch(error) {
        toast("Can't continue without connecting wallet", {
          icon: '🤷',
        });
      }
    }
  }

  const GET_CHALLENGE = `
  query($request: ChallengeRequest!) {
    challenge(request: $request) { text }
  }`
  const generateChallenge = (address) => {
    return apolloClient.query({
     query: gql(GET_CHALLENGE),
     variables: {
       request: {
          address,
       },
     },
   })
  }

  const AUTHENTICATION = `
  mutation($request: SignedAuthChallenge!) { 
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
  }`

  const authenticate = (address, signature) => {
    return apolloClient.mutate({
     mutation: gql(AUTHENTICATION),
     variables: {
       request: {
         address,
         signature,
       },
     },
   })
  }

  const connectLens = async() => {
    const challengeResponse = await generateChallenge(currentAddress);
    const signer = currentProvider.getSigner();
    const signature = await signer.signMessage(challengeResponse.data.challenge.text);
    const accessTokens = await authenticate(currentAddress, signature);
    console.log(accessTokens);
    setModal(false)
    setStep(2)
  }


  return(
      <div className={modal ? "fixed top-[calc(0%)] left-[calc(0%)] w-screen h-screen z-10" : "hidden"}>
      <div className="flex flex-col w-full h-full bg-cf-black-low-opa items-center justify-center">
        <div className="flex flex-col bg-cf-cream py-10 px-16 space-y-2 rounded-md">
          {logInLens === false &&
          <>
            <button className="flex justify-start items-center" onClick={connectWallet}>
              <Image alt="metamask" src={metamask} width={1200*0.04} height={1200*0.04}></Image>
              <p className="font-medium text-2xl">Metamask</p>
            </button>
            <hr className="border border-black"/>
            <div className="flex justify-start items-center">
              <Image alt="metamask" src={walletconnect} width={1200*0.04} height={675*0.04}></Image>
              <p className="font-medium text-2xl">WalletConnect</p>
            </div>
            <div className="flex justify-end items-center">
              <button onClick={() => setModal(false)}>
                close
              </button>
            </div>
          </>
          }
          
          {logInLens === true &&
          <>
            <button className="flex justify-start items-center" onClick={connectLens}>
              {/* <Image alt="metamask" src={lens} width={199*0.2} height={253*0.2}></Image> */}
              <p className="font-medium text-2xl">Log in with Lens</p>
            </button>
            <div className="flex justify-end items-center">
              <button onClick={() => setModal(false)}>
                close
              </button>
            </div>
          </>
          }
        </div>
      </div> 
    </div>
  )
}


export default LogInModal