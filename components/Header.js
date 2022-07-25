import Link from "next/link"


const Header = () => {
    return(
        <div className='flex w-full h-[calc(20%)] items-center justify-around'>
        
        {/* placeholder for top left content */}
        <div>
        </div>

        <div className='flex hover:cursor-pointer'>
          <Link href={"/"}>
            <h1 className='font-bold text-4xl'>Clear Feed</h1>
          </Link>
        </div>

        {/* placeholder for top right content */}
        <div>
        </div>

      </div>

    )
}

export default Header