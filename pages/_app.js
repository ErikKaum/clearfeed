import '../styles/globals.css'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { useWalletData } from '../utils/hooks';
import { walletContext } from '../utils/context';
const client = new ApolloClient({
  uri: 'https://api.lens.dev',
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  const { walletValue } = useWalletData();
  return(
  <walletContext.Provider value={walletValue} >
    <ApolloProvider client={client}>
     <Component {...pageProps} />
    </ApolloProvider>
  </walletContext.Provider>

  )
}

export default MyApp
