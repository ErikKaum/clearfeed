import Image from "next/image"
import { useContext } from "react"

import metamask from '../assets/metamask.png'
import walletconnect from '../assets/walletconnect.png'

import { generateChallenge, authenticate, refreshAuth, getDefaultProfile } from '../lensApi/auth'

import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from "ethers"

import { walletContext, LensTokenContext , lensProfileContext} from "../utils/context"

import toast, { Toaster } from "react-hot-toast"

const LogInModal = ({modal, setModal, setStep = false}) => {

  const { account, setAccount, provider, setProvider } = useContext(walletContext)
  const {accessToken, setAccessToken, refreshToken, setRefreshToken } = useContext(LensTokenContext)
  const { profile, setProfile } = useContext(lensProfileContext)

  const connectWallet = async () => {
    if (!account) {
      const ethereum = await detectEthereumProvider({mustBeMetaMask : true})
      if (ethereum) {
        const currentProvider = new ethers.providers.Web3Provider(ethereum)
        let accounts
        try {
          accounts = await currentProvider.send("eth_requestAccounts", []);
          setProvider(provider)
          setAccount(accounts[0])
          // setStep(3)
        } catch(error) {
          toast("Can't continue without connecting wallet", {
            icon: '🤷',
          });
        }
      }    
    }
  }

  const connectLens = async() => {
    let tokens
    if (refreshToken) {
      tokens = await refreshAuth(refreshToken)
      setAccessToken(tokens.data.refresh.accessToken)
      setRefreshToken(tokens.data.refresh.refreshToken)
      localStorage.setItem('accessToken', tokens.data.refresh.accessToken)
      localStorage.setItem('refreshToken', tokens.data.refresh.refreshToken)
  
    } else {
      const challengeResponse = await generateChallenge(account);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(challengeResponse.data.challenge.text);
      tokens = await authenticate(account, signature);
      setAccessToken(tokens.data.authenticate.accessToken)
      setRefreshToken(tokens.data.authenticate.refreshToken)
      localStorage.setItem('accessToken', tokens.data.authenticate.accessToken)
      localStorage.setItem('refreshToken', tokens.data.authenticate.refreshToken)
    }
    
    const defaultProfile = await getDefaultProfile(account)
    console.log(defaultProfile)
    if (defaultProfile.data.defaultProfile === null) {
      toast("No Lens profile found in this wallet", {
        icon: '🤷',
      });
    } else {
      setProfile(defaultProfile.data.defaultProfile)
      localStorage.setItem('profile', JSON.stringify(defaultProfile.data.defaultProfile))
      
      setModal(false)
      setStep(2)     
    }
  }

  return(
      <div className={modal ? "fixed top-[calc(0%)] left-[calc(0%)] w-screen h-screen z-10" : "hidden"}>
      <div className="flex flex-col w-full h-full bg-cf-black-low-opa items-center justify-center">
        <div className="flex flex-col bg-cf-cream py-10 px-16 space-y-2 rounded-md">
          {!account &&
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
          
          {account &&
          <>
            <button className="text-xl font-semibold py-2 px-5 flex justify-start items-center bg-cf-red rounded-md border-2 border-black" onClick={connectLens}>
              {/* <Image alt="metamask" src={lens} width={199*0.2} height={253*0.2}></Image> */}
              {/* <p className="font-medium text-2xl p-2">Log in with Lens</p> */}
              Log in with Lens
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