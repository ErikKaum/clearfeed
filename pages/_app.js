import '../styles/globals.css'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { useWalletData, useLensToken, useLensProfile } from '../utils/hooks';
import { walletContext, LensTokenContext, lensProfileContext } from '../utils/context';

const client = new ApolloClient({
  uri: 'https://api.lens.dev',
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  const { walletValue } = useWalletData();
  const { LensTokenValue } = useLensToken();
  const { lensProfileValue } = useLensProfile();

  return(
    <walletContext.Provider value={walletValue} >
      <LensTokenContext.Provider value={LensTokenValue} >
        <lensProfileContext.Provider value={lensProfileValue} >
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </lensProfileContext.Provider>
      </LensTokenContext.Provider>
    </walletContext.Provider>
  )
}

export default MyApp
