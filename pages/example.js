import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import Header from "../components/Header"
import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from "react"

import predictSentiment from "../models/sentiment"
import ReactMarkdown from 'react-markdown';
import { abs, floor } from "mathjs"
import FeedHeader from "../components/FeedHeader"
import LogInModal from "../components/modal"

const Feed = () => {
  
  const [publications, setPublications] = useState([])
  const [myNumber, setMyNumber] = useState(1)
  const [modal, setModal] = useState(false)
  
  const { data, loading, error, fetchMore, refetch } = useQuery(EXPLORE_FEED_QUERY, {
      async onCompleted(data) {
        let result = await predictSentiment(data?.explorePublications?.items)
        result = result.map((item) => {
          const newRes = abs(item.res.score - myNumber)
          return {...item, newRes: newRes}
        })
        result.sort((a,b)=> (a.newRes > b.newRes ? 1 : -1))
        setPublications(result.slice(0,20))
        console.log(result.slice(0,20))
      }
  })
  
  const updateData = () => {
    setPublications([])
    refetch() 
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
            <FeedHeader setModal={setModal} />
            <LogInModal modal={modal} setModal={setModal} />
                        
            <div className="flex h-32 w-full">
            </div>

            <div className='flex  w-full min-h-[calc(80%)] space-x-10 px-12 xl:px-40 2xl:px-64 justify-center items-start bg-inherit'>

              {/* Placeholder for left content */}
              {/* <div className="flex w-1/4 justify-center px-10"> */}
                {/* <div className="flex flex-col w-full h-52 items-center justify-around py-5 rounded-md bg-cf-cream">
                    <h2 className="font-bold">Elmos&apos;s example feed</h2>
                    
                    <label htmlFor="default-range" className="block mb-2 text-sm mt-3 font-medium">What happens if you change this? 👀</label>
                    <input onChange={(e) => {setMyNumber(e.target.value/100)}} id="default-range" type="range" defaultValue={myNumber*100} min={0} max={100} className="h-2 w-1/2 bg-cf-light-blue rounded-lg appearance-none cursor-pointer"></input>
                    <p>{floor(myNumber*100)}</p> 
                    <button onClick={updateData} className="bg-cf-red text-cf-cream rounded-md font-semibold border border-black mt-10 p-2 w-1/2">
                        Refresh
                    </button>
                </div> */}
              {/* </div> */}

              <div className="flex flex-col w-2/3">
                {publications && publications.map((post ) => {
                  return(
                    <div key={post.id} className="h-1/6 p-5 mb-5 bg-cf-cream rounded-md">

                      <p className="font-bold">{post.profile.handle}</p>
                      <ReactMarkdown>{post.metadata.content}</ReactMarkdown>
                    </div>              
                  )
                })}
                {publications && publications.length === 0 &&
                  <>
                  <div className="flex justify-center items-center h-32 animate-pulse p-5 mb-5 bg-cf-cream rounded-md">
                    <p className="text-white text-4xl font-bold">Loading...</p>
                  </div>
                  <div className="h-32 animate-pulse p-5 mb-5 bg-cf-cream rounded-md">
                  </div>
                  <div className="h-32 animate-pulse p-5 mb-5 bg-cf-cream rounded-md">
                  </div>
                  </>
                }
              </div>
              
              {/* Placeholder for right content */}
              <div className="flex flex-col w-1/3 justify-center">
                <div className="mb-5 flex flex-col w-full items-center justify-around py-5 rounded-md bg-cf-cream">
                    <h2 className="font-bold">What is this?</h2>

                    <p className="p-5">
                      You can tune from 0% to 100% how much our algorithm
                      changes the default explore feed. <br/><br/>

                      You like it? We offer a custom algortihm for you based
                      on your previous interactions on the Lens protocol. <br/><br/>

                      The algortihm will be 100% owned by you and only visible
                      to you.
                    </p>
                    
                    <Link href={'/sign-up'}>
                        <button disabled className="bg-cf-red disabled:opacity-50 text-cf-cream rounded-md font-semibold border border-black mt-10 p-2 w-1/2">
                            I&apos;m in!
                        </button>
                    </Link>
                    <p>Coming soon!</p>
                </div>

                <div className="flex flex-col w-full h-52 items-center justify-around py-5 rounded-md bg-cf-cream">
                    <h2 className="font-bold">Settings 🔧</h2>
                    
                    <label htmlFor="default-range" className="block mb-2 text-sm mt-3 font-medium">See what happens if you change this? 👀</label>
                    <input onChange={(e) => {setMyNumber(e.target.value/100)}} id="default-range" type="range" defaultValue={myNumber*100} min={0} max={100} className="h-2 w-1/2 bg-cf-light-blue rounded-lg appearance-none cursor-pointer"></input>
                    <p>{floor(myNumber*100)} %</p> 
                    <button onClick={updateData} className="bg-cf-red text-cf-cream rounded-md font-semibold border border-black mt-10 p-2 w-1/2">
                        Refresh
                    </button>
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


export default Feed


const EXPLORE_FEED_QUERY = gql`
query ExplorePublications {
  explorePublications(request: {
    sortCriteria: TOP_COMMENTED,
    publicationTypes: [POST],
    limit: 50
  }) {
    items {
      __typename 
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentFields
      }
      ... on Mirror {
        ...MirrorFields
      }
    }
    pageInfo {
      prev
      next
      totalCount
    }
  }
}

fragment MediaFields on Media {
  url
  width
  height
  mimeType
}

fragment ProfileFields on Profile {
  id
  name
  bio
  attributes {
    displayType
    traitType
    key
    value
  }
  isFollowedByMe
  isFollowing(who: null)
  followNftAddress
  metadata
  isDefault
  handle
  picture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
    }
    ... on MediaSet {
      original {
        ...MediaFields
      }
      small {
        ...MediaFields
      }
      medium {
        ...MediaFields
      }
    }
  }
  coverPicture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
    }
    ... on MediaSet {
      original {
        ...MediaFields
      }
      small {
       ...MediaFields
      }
      medium {
        ...MediaFields
      }
    }
  }
  ownedBy
  dispatcher {
    address
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
          name
          symbol
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

fragment PublicationStatsFields on PublicationStats { 
  totalAmountOfMirrors
  totalAmountOfCollects
  totalAmountOfComments
}

fragment MetadataOutputFields on MetadataOutput {
  name
  description
  content
  media {
    original {
      ...MediaFields
    }
    small {
      ...MediaFields
    }
    medium {
      ...MediaFields
    }
  }
  attributes {
    displayType
    traitType
    value
  }
}

fragment Erc20Fields on Erc20 {
  name
  symbol
  decimals
  address
}

fragment CollectModuleFields on CollectModule {
  __typename
  ... on FreeCollectModuleSettings {
    type
  }
  ... on FeeCollectModuleSettings {
    type
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
  }
  ... on LimitedFeeCollectModuleSettings {
    type
    collectLimit
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
  }
  ... on LimitedTimedFeeCollectModuleSettings {
    type
    collectLimit
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
    endTimestamp
  }
  ... on RevertCollectModuleSettings {
    type
  }
  ... on TimedFeeCollectModuleSettings {
    type
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
    endTimestamp
  }
}

fragment PostFields on Post {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
  createdAt
  collectModule {
    ...CollectModuleFields
  }
  referenceModule {
    ... on FollowOnlyReferenceModuleSettings {
      type
    }
  }
  appId
  hidden
  reaction(request: null)
  mirrors(by: null)
  hasCollectedByMe
}

fragment MirrorBaseFields on Mirror {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
  createdAt
  collectModule {
    ...CollectModuleFields
  }
  referenceModule {
    ... on FollowOnlyReferenceModuleSettings {
      type
    }
  }
  appId
  hidden
  reaction(request: null)
  hasCollectedByMe
}

fragment MirrorFields on Mirror {
  ...MirrorBaseFields
  mirrorOf {
   ... on Post {
      ...PostFields          
   }
   ... on Comment {
      ...CommentFields          
   }
  }
}

fragment CommentBaseFields on Comment {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
  createdAt
  collectModule {
    ...CollectModuleFields
  }
  referenceModule {
    ... on FollowOnlyReferenceModuleSettings {
      type
    }
  }
  appId
  hidden
  reaction(request: null)
  mirrors(by: null)
  hasCollectedByMe
}

fragment CommentFields on Comment {
  ...CommentBaseFields
  mainPost {
    ... on Post {
      ...PostFields
    }
    ... on Mirror {
      ...MirrorBaseFields
      mirrorOf {
        ... on Post {
           ...PostFields          
        }
        ... on Comment {
           ...CommentMirrorOfFields        
        }
      }
    }
  }
}

fragment CommentMirrorOfFields on Comment {
  ...CommentBaseFields
  mainPost {
    ... on Post {
      ...PostFields
    }
    ... on Mirror {
       ...MirrorBaseFields
    }
  }
}`
