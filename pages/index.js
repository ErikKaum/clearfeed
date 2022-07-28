import { useState } from 'react';

import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider'
import { CONTRACT_ADDRESS } from "../utils/address";
import abi from "../utils/ClearFeed.json"

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import Btn from "../assets/Button.svg";
import Btn2 from "../assets/Button2.svg";

import toast, { Toaster } from 'react-hot-toast';
import Header from '../components/Header';


export default function Home() {

  const [opened, setOpened] = useState(false);

  const handleClick = async() => {
    const ethereum = await detectEthereumProvider({mustBeMetaMask : true})

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      let accounts 
      try {
        accounts = await provider.send("eth_requestAccounts", []);
      } catch(error) {
        toast("Can't continue without connecting wallet", {
          icon: '🤷',
        });
        
      }

      if (accounts) {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
        try {
          await contract.safeMint('zero','one','two') 
        }
        catch(error) {
          console.log(error)
        }
      }
    } else {  
      console.log('here')
    }
    // try {
    //   const { ethereum } = window
    //   if (ethereum) {
    //     const provider = new ethers.providers.Web3Provider(ethereum);
        
    //     let accounts 
    //     try {
    //       accounts = await provider.send("eth_requestAccounts", []);
    //     } catch(error) {
    //       toast("Can't continue without connecting wallet", {
    //         icon: '🤷',
    //       });
          
    //     }

    //     if (accounts) {
    //       const signer = provider.getSigner();
    //       const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
    //       try {
    //         await contract.safeMint('zero','one','two') 
    //       }
    //       catch(error) {
    //         console.log(error)
    //       }
    //     }
    //   }
    // } catch(error) {
    //   toast('You need metamask to make this work!', {
    //     icon: '🤷',
    //   });
      
    // }
  }

  // const handleClick2 = async () => {
  //   setOpened(true)      
  // }

  return (
    <div>
      <Toaster />
      <Head>
        <title>Clear Feed</title>
        <meta name="description" content="Personalized content while keeping your data private" />
        <link rel="icon" href="/surf.png" />
      </Head>

      <main>
        <div className="w-full h-screen bg-cf-light-blue">
          <Header />

          <div className='flex px-5 w-full h-[calc(80%)] justify-center items-center'>
            
            <div className={opened ? 'fixed top-[calc(40%)] left-[calc(30%)] right-[calc(30%)] z-10 bg-cf-cream border-2 border-black p-10' : 'hidden'}>
              <div className='flex divide-y w-full h-full flex-col items-center justify-center'>
                <p className='text-xl'>MetaMask</p>
                <p className='text-xl'>WalletConnect</p>
              </div>
              <button className='' onClick={() => setOpened(false)}>
                Close
              </button>
            </div>

            <div className='flex flex-col space-y-10 justify-center items-center'>
              <h2 className='text-center text-4xl sm:text-6xl font-bold'>
              Personalized feed 🏄‍♂️ <br/>
              while keeping your data private
              </h2>

              <div className='flex flex-col mt-10 w-full h-full items-center justify-evenly space-y-5'>
                <Link href={"/sign-up"}>
                  <button>
                    <Image src={Btn} alt="button" height={110*0.7} width={300*0.7} />
                  </button>
                </Link>

                <p className='text-2xl font-bold'>or</p>
                
                <Link href={"/example"}>
                <button>
                  <Image src={Btn2} alt="button" height={110*0.7} width={412*0.7} />
                </button>
                </Link>
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
