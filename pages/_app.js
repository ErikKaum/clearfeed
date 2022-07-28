import '../styles/globals.css'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
const client = new ApolloClient({
  uri: 'https://api.lens.dev',
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  return(
    <ApolloProvider client={client}>
     <Component {...pageProps} />
     </ApolloProvider>
  )
}

export default MyApp
