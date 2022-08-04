import { useEffect, useState, useMemo } from "react"
import { ethers } from "ethers"
import detectEthereumProvider from '@metamask/detect-provider'

export const useWalletData = () => {
    const [account, setAccount] = useState(undefined)   
    const [provider, setProvider] = useState(undefined)   

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

export const useLensToken = () => {
    const [accessToken, setAccessToken] = useState(undefined)
    const [refreshToken, setRefreshToken] = useState(undefined)

    useEffect(() => {
      try{
        const currentAccessToken = localStorage.getItem('accessToken')
        const currentrefreshToken = localStorage.getItem('refreshToken')
        if (currentAccessToken !== 'null') {
          setAccessToken(currentAccessToken)
        }
        if (currentrefreshToken !== 'null') {
          setRefreshToken(currentrefreshToken)
        }
      } catch(error){
        console.log(error)
        setAccessToken(undefined)
        setRefreshToken(undefined)
      }
    },[])

    const LensTokenValue = useMemo(
        () => ({ accessToken, setAccessToken, refreshToken, setRefreshToken }), 
        [accessToken, refreshToken]
    );

    return { LensTokenValue }
}

export const useLensProfile = () => {
  const [profile, setProfile] = useState(undefined)

  useEffect(() => {
    try{
      const currentProfile = localStorage.getItem('profile')
      if (currentProfile !== 'null') {
        setProfile(JSON.parse(currentProfile))
      }
    } catch(error){
      console.log(error)
      setProfile(undefined)
    }
  },[])

  const lensProfileValue = useMemo(
      () => ({ profile, setProfile }), 
      [profile]
  );

  return { lensProfileValue }
}