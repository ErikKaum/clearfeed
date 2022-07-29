import { useEffect, useState, useMemo } from "react"
import { ethers } from "ethers"
import detectEthereumProvider from '@metamask/detect-provider'

export const useWalletData = () => {
    const [account, setAccount] = useState(null)   
    const [provider, setProvider] = useState(null)   

    useEffect(() => {
        const checkConnection = async() => {
            const ethereum = await detectEthereumProvider({mustBeMetaMask : true})            
            try {
              if (ethereum) {
                const currentProvider = new ethers.providers.Web3Provider(ethereum);
                const addresses = await currentProvider.listAccounts(); 
                if (addresses && currentProvider) {
                setAccount(addresses[0])
                setProvider(currentProvider)
                }
              }
            } catch(e) {
              console.log(e)
            }
          }
        checkConnection();
    },[account])

    const walletValue = useMemo(() => ({
            account, setAccount, provider, setProvider
        }), 
        [account, provider]
    );

    return { walletValue }
}

// export const useAgentData = () => {
//     const [agent, setAgent] = useState(null)

//     const agentValue = useMemo(
//         () => ({ agent, setAgent }), 
//         [agent]
//     );

//     return { agentValue }
// }