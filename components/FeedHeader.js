import Link from "next/link"


const FeedHeader = ({ setModal }) => {
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
        <div className="flex w-32 justify-center">
          {/* <button onClick={() => setModal(true)} className="rounded-md font-semibold bg-cf-cream py-2 w-full">
            Sign in
          </button> */}
        </div>

      </div>

    )
}

export default FeedHeader