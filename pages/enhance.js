import Link from "next/link"
import Head from "next/head"
import Header from "../components/Header"

import { useState, useContext } from "react"
import { walletContext } from "../utils/context"

import { generateAndVerifyProof, convertProof } from "../zk/proof" 

import { ethers  } from 'ethers';
import { CONTRACT_ADDRESS } from "../utils/address";
import abi from"../utils/ClearFeed.json"

const Enhance = () => {

    const { account, setAccount, provider, setProvider } = useContext(walletContext)

    const [statement1, setStatement1] = useState(0)
    const [statement2, setStatement2] = useState(0)
    const [statement3, setStatement3] = useState(0)
    const [myNumber, setMyNumber] = useState(0)
    
    const SCALE_SMALL = 10
    const SCALE = 100_000 

    const submitEnhance = async(e) => {
        e.preventDefault()

        if (statement1 !== 0 && statement2 !== 0 && statement3 !== 0) {
            let extraversion_sum = parseInt(statement1)+parseInt(statement2)+parseInt(statement3) 
            let extraversion = parseInt((extraversion_sum/3)*SCALE_SMALL)
            
            console.log(extraversion)
            console.log('here')
    
            const x = extraversion
            const y = myNumber*SCALE_SMALL

            const x_squared_minus = parseInt(x**(-2)*SCALE)

            console.log({
                x : x,
                y : y,
                x_squared_minus :  x_squared_minus
            })
            
            const { proof, publicSignals } = await generateAndVerifyProof(x, y, 0, 0, x_squared_minus)
                   
            console.log(proof)
            console.log(publicSignals)
            
            const { _proof, _input } = convertProof({proof, publicSignals})

            console.log(_proof)
            console.log(_input)

            const new_x0 = publicSignals[0]
            const new_x1 = publicSignals[1]

            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
            let tokenId = await contract.tokenOfOwnerByIndex(account, 0)
            tokenId = tokenId.toNumber()
      
            await contract.enhance(tokenId, _proof, _input, new_x0, new_x1)

        } else {
            console.log('not all are filled')
        }
    } 

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

            <div className='flex flex-col bg-inherit pb-10 px-5 w-full min-h-[calc(70%)] justify-center items-center'>

                <div>
                    <h2 className='text-3xl font-semibold mb-5'>
                        What is this?
                    </h2>
                </div>

                <div className="flex flex-col xl:w-1/3 w-1/2 items-center bg-cf-cream p-10 rounded-md">
            
                <form className="flex flex-col items-center" onSubmit={submitEnhance}>

                    <h2 className='text-3xl font-semibold mb-5'>
                        I see myself as someone who...
                    </h2>

                    <p>is talkative</p>
                    <select className="mb-5" onChange={(e) => setStatement1(e.target.value)}>
                        <option value={0}> choose options below </option>
                        <option value={1}> strongly disagree </option>
                        <option value={2}> disagree </option>
                        <option value={3}> somewhat disagree </option>
                        <option value={4}> neither agree nor disagree </option>
                        <option value={5}> somewhat agree </option>
                        <option value={6}> agree </option>
                        <option value={7}> strongly agree </option>
                    </select>

                    <p>is outgoing, sociable</p>
                    <select className="mb-5" onChange={(e) => setStatement2(e.target.value)}>
                        <option value={0}> choose options below </option>
                        <option value={1}> strongly disagree </option>
                        <option value={2}> disagree </option>
                        <option value={3}> somewhat disagree </option>
                        <option value={4}> neither agree nor disagree </option>
                        <option value={5}> somewhat agree </option>
                        <option value={6}> agree </option>
                        <option value={7}> strongly agree </option>
                    </select>

                    <p>is reserved</p>
                    <select className="mb-5" onChange={(e) => setStatement3(e.target.value)}>
                        <option value={0}> choose options below </option>
                        <option value={7}> strongly disagree </option>
                        <option value={6}> disagree </option>
                        <option value={5}> somewhat disagree </option>
                        <option value={4}> neither agree nor disagree </option>
                        <option value={3}> somewhat agree </option>
                        <option value={2}> agree </option>
                        <option value={1}> strongly agree </option>
                    </select>

                    <h2 className='text-3xl font-semibold mt-10 mb-5 text-center'>
                    Rate this post from 0 to 10
                    </h2>

                    <div className="border border-black rounded-md p-5 m-2">
                        <p>Well observed! Thanks for your feedback. This use case among many others will indeed be a big change in the exchange of value and the ability to collect it. We are living in the early hours of something fantastic 🪄</p>
                    </div>

                    <div className="flex flex-col w-1/2 justify-center items-center m-10">
                        <input onChange={(e) => {setMyNumber(e.target.value)}} id="default-range" type="range" defaultValue={0} min={0} max={10} className="h-2 w-1/2 bg-white rounded-lg appearance-none cursor-pointer"></input>
                        <p>{myNumber}</p>
                    </div>

                <button className="bg-cf-red text-cf-cream text-xl py-5 w-1/2 border-2 border-black rounded-md font-semibold" >
                    <input className={'hove: cursor-pointer'} type="submit" value="Enhance"></input>
                </button>
                
                </form>
                </div>
            </div>
  
          
          </div>
        </main>
      </div>
  
    )
}


export default Enhance