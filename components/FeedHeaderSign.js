import Link from "next/link"
import { useContext } from "react"
import { lensProfileContext } from "../utils/context"

const FeedHeaderSign = ({ setModal }) => {
  const { profile, setProfile } = useContext(lensProfileContext)

  const Text = () => {
    if (profile?.handle) {
      return profile?.handle
    } else {
      return 'Log in'
    }
  }

  return(
      <div className='flex w-full h-[calc(7%)] items-center justify-between px-12 xl:px-40 2xl:px-64 border-b-2 border-cf-blue'>
      

      <div className='flex hover:cursor-pointer'>
        <Link href={"/"}>
          <h1 className='font-bold text-3xl'>Clear Feed 🏄‍♂️</h1>
        </Link>
      </div>

      {/* placeholder for top left content */}
      <div className="flex w-32">
      </div>


      {/* placeholder for top right content */}
      <div className="flex min-w-32 justify-center">
        <button onClick={() => setModal(true)} className="rounded-md font-semibold bg-cf-cream py-2 px-5 w-full">
          <Text />
        </button>
      </div>

    </div>

  )
}

export default FeedHeaderSign