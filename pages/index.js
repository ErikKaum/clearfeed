import { useState } from 'react';

import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider'
import { CONTRACT_ADDRESS } from "../utils/address";
import abi from "../utils/ClearFeed.json"

import Head from 'next/head'
import Link from 'next/link';

import toast, { Toaster } from 'react-hot-toast';
import Header from '../components/Header';

import { useContext } from 'react';
import { walletContext, LensTokenContext, lensProfileContext } from '../utils/context'

export default function Home() {

  const [opened, setOpened] = useState(false);
  const walletInfo = useContext(walletContext)
  const tokenInfo = useContext(LensTokenContext)
  const profileInfo = useContext(lensProfileContext)

  console.log(walletInfo)
  console.log(tokenInfo)
  console.log(profileInfo)


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

          <div className='flex px-5 w-full h-[calc(70%)] justify-center items-center'>
            
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
              Personalized feed<br/>
              while keeping your data private
              </h2>

              <div className='flex flex-col mt-10 w-full h-full items-center justify-evenly space-y-5'>
                <Link href={"/sign-up"}>
                <button className='bg-cf-red font-bold text-3xl text-cf-cream rounded-md border-2 border-black py-3 px-10'>
                  I&apos;m in
                </button>
                </Link>

                <p className='text-2xl font-bold'>or</p>
                
                <Link href={"/example"}>
                <button className='bg-cf-red font-bold text-3xl text-cf-cream rounded-md border-2 border-black py-3 px-10'>
                  See example
                </button>
                </Link>
              </div>


            </div>
          </div> 
          {/* <hr className='border'/> */}
          <footer className='flex w-full h-[calc(10%)] space-x-5 pr-10 justify-end items-center'>
            <Link href={"/feed"}> Feed</Link>
            <Link href={'/about'}>About</Link>
            <a rel="noopener noreferrer" target="_blank" href={'https://twitter.com/clear_feed'}>Contact</a>
          </footer>
        </div>
      </main>
    </div>
  )
}
