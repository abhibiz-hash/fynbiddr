import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className='w-auto bg-white/60 backdrop-blur-lg border border-gray-200/80 rounded-full shadow lg'>
      <div className='px-6 py-3 flex items-center space-x-8'>
        <Link to="/" className='font-bold text-xl text-gray-900'>Fynbiddr 🚀</Link>

        {/* Placeholder for center links */}
        <div className="flex-grow"></div>

        <div className='flex items-center space-x-2'>
            <a href="/login" className='text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium'>Login</a>
            <a href="/register" className='bg-gray-900 text-white font-semibold px-4 py-2 rounded-full text-sm'>Sign Up</a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
