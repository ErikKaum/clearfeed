import { ApolloClient, InMemoryCache } from "@apollo/client"
import { gql } from "@apollo/client"

const apolloClient= new ApolloClient({
    uri: 'https://api.lens.dev',
    cache: new InMemoryCache(),
})

const AUTHENTICATION = `
  mutation($request: SignedAuthChallenge!) { 
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
}`

const GET_CHALLENGE = `
query($request: ChallengeRequest!) {
  challenge(request: $request) { text }
}`

const REFRESH_AUTHENTICATION = `
  mutation($request: RefreshRequest!) { 
    refresh(request: $request) {
      accessToken
      refreshToken
    }
}`

export const generateChallenge = (address) => {
  return apolloClient.query({
   query: gql(GET_CHALLENGE),
   variables: {
     request: {
        address,
     },
   },
 })
}

export const authenticate = (address, signature) => {
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

export const refreshAuth = (refreshToken) => {
  return apolloClient.mutate({
   mutation: gql(REFRESH_AUTHENTICATION),
   variables: {
     request: {
       refreshToken,
     },
   },
 })
}

const GET_DEFAULT_PROFILE = `
  query($request: DefaultProfileRequest!) {
    defaultProfile(request: $request) {
      id
      name
      bio
      attributes {
        displayType
        traitType
        key
        value
      }
      followNftAddress
      metadata
      isDefault
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      handle
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              symbol
              name
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
         type
        }
        ... on RevertFollowModuleSettings {
         type
        }
      }
    }
  }
`;

export const getDefaultProfile = (ethereumAddress) => {
   return apolloClient.query({
    query: gql(GET_DEFAULT_PROFILE),
    variables: {
      request: {
        ethereumAddress
      }
    },
  })
}