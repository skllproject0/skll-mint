import Image from 'next/image'
import { useState,useEffect } from "react"
import { initOnboard } from "../ulits/onboard"
import { config } from '../dapp.config'
import data from "./data.json";
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import Darkmodebutton from './darkmode';
import {Link} from 'react-scroll/modules';
import {
  getTotalMinted,
  getMaxSupply,
  isPausedState,
  isPublicSaleState,
  publicMint          } from '../ulits/interact'

//REMEMBER TO ADD A LOGO

export default function Base () {
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalMinted, setTotalMinted] = useState(0)
  const [maxMintAmount, setMaxMintAmount] = useState(0)
  const [paused, setPaused] = useState(false)
  const [isPublicSale, setIsPublicSale] = useState(false)
  

  const [status, setStatus] = useState(null)
  const [mintAmount, setMintAmount] = useState(1)
  const [isMinting, setIsMinting] = useState(false)
  const [onboard, setOnboard] = useState(null)
  const [walletAddress, setWalletAddress] = useState('')

  const [nav, setNav] = useState(false);

  useEffect(() => {
    const init = async () => {
      setMaxSupply(await getMaxSupply())
      setTotalMinted(await getTotalMinted())

      setPaused(await isPausedState())
      const isPublicSale = await isPublicSaleState()
      setIsPublicSale(isPublicSale)

      setMaxMintAmount(
        isPublicSale ? config.maxMintAmount : '0'
      )
      
      
    }

    init()
  }, [])
  
  useEffect( () => {
    const onboardData = initOnboard( {
      address: (address) => setWalletAddress(address ? address : ''),
      wallet: (wallet) => {
        if (wallet.provider) {
          window.localStorage.setItem('selectedWallet', wallet.name)
        } else {
          window.localStorage.removeItem('selectedWallet') }}
    }
    )
  setOnboard(onboardData)
  }, [])

  const previouslySelectedWallet = typeof window !== 'undefined' &&
  window.localStorage.getItem('selectedWallet')

useEffect(() => {
  if (previouslySelectedWallet !== null && onboard) {
    onboard.walletSelect(previouslySelectedWallet)
  }
}, [onboard, previouslySelectedWallet])

const handleNav = () => {
  setNav(!nav);
}

  const connectWalletHandler = async () => {
    const walletSelected = await onboard.walletSelect()
    if (walletSelected) {
      await onboard.walletCheck()
      window.location.reload(false)
    }
  }

  const connectWalletHandlerMobile = async () => {
    setNav(false)
    const walletSelected = await onboard.walletSelect()
    if (walletSelected) {
      await onboard.walletCheck()
      window.location.reload(false)
      
    }
  }

  const incrementMintAmount = () => {
    if (mintAmount < maxMintAmount) {
      setMintAmount(mintAmount + 1)
    }
  }

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1)
    }
  }


  const publicMintHandler = async () => {
    setIsMinting(true)

    const { success, status } = await publicMint(mintAmount)

    setStatus({
      success,
      message: status
    })

    setIsMinting(false)
  }

  
  return (
    <>
    {/* nav */}
    <div>
    <div className='fixed z-[100] top-0 flex items-center justify-between w-full h-20 px-2 lg:px-8 bg-transparent filter backdrop-blur-md'>
          <Link className="cursor-pointer" activeClass ="active" to='home' spy={true} smooth={true} duration={500}>
          <a>
            <img
              src="/logo.jpeg"
              alt='/'
              className='cursor-pointer rounded-lg w-[40px] h-[40px]'
            /> 
            
          </a>
        </Link>
        <div>
          <ul className='hidden md:flex font-Archivo front-medium items-center justify-betweeen '>
            <li className='mx-3 text-[18px] hover:tracking-wide hover:underline hover:underline-offset-8 font-medium'>
            <Link className="cursor-pointer" activeClass ="active" to='home' spy={true} smooth={true} offset={-70} duration={500}>Home</Link>
            </li>
            <li className='mx-3 text-[18px]  hover:tracking-wide hover:underline hover:underline-offset-8 font-medium'>
            <Link className="cursor-pointer" activeClass ="active" to='mint' spy={true} smooth={true} offset={-70} duration={500}>Mint</Link>
            </li>
            <li className='mx-3 text-[18px]  hover:tracking-wide hover:underline hover:underline-offset-8 font-medium'>
              <Link className="cursor-pointer" activeClass ="active" to='contact' spy={true} smooth={true} offset={-70} duration={500}>Contact Us</Link>
            </li>
            <li className='mx-3 text-[18px]  hover:tracking-wide hover:underline hover:underline-offset-8 font-medium'>
              <Link className="cursor-pointer" activeClass ="active" to='faqs' spy={true} smooth={true} offset={50} duration={500}>FAQs</Link>
            </li>
            {/* dark mode button and wallet button */}
          <div className='flex items-center justify-between mx-4'>
              <div className='mx-6'>
                 <Darkmodebutton/>
              </div>
             
              {walletAddress ? (
                  <button
                    className='text-white dark:text-black font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 rounded-sm text-sm px-5 py-2.5 text-center'
                     >
                    Connected: {walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4)}
                  </button>
                ) : ( 
                  <button
                    className='text-white dark:text-black font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 rounded-sm text-sm px-5 py-2.5 text-center'
                    onClick={connectWalletHandler}
                     >
                    Connect wallet
                  </button> 
                  )} 
            

          </div>
          </ul>
          </div>
          
          <div onClick={handleNav}
          className=' md:hidden rounded-md p-2 bg-white dark:bg-gray-700 mr-2 cursor-pointer' >
            <AiOutlineMenu size={18} />
          </div>

        
      
          </div>

      {/* Mobile Menu */}
      {/* Overlay */}
      <div className={
         nav? 'z-[120] md:hidden fixed left-0 top-0 w-full h-screen dark:bg-gray-400/10 bg:gray-100/10 backdrop-filter backdrop-blur-sm' : ""
        }>
        
        {/* Side Drawer Menu */}
      <div className ={
        nav? "fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[45%] h-screen p-10 ease-in duration-500 border-r-2 backdrop-filter backdrop-blur-md"
      :'fixed left-[-100%] top-0 p-10 ease-in duration-500 h-screen'
      }>
      <div className='flex w-full items-center justify-between'>
      <Link className="cursor-pointer" activeClass ="active" to='home' spy={true} smooth={true} duration={500}>
                <a>
                   <img
              src="/logo.jpeg"
              alt='/'
              className='cursor-pointer rounded-lg w-[40px] h-[40px]'
            /> 
                </a>
              </Link>
              <div onClick={handleNav}
              className='rounded-full bg-gray-400 hover:shadow-lg hover:shadow-gray-600 p-3 cursor-pointer '>
              <AiOutlineClose size={18} />
             </div>
          </div>
          <div className='border-b py-4 flex flex-col mt-4'>
              <p className='uppercase text-[18px] font-Archivo text-center font-semibold'>
              Skull Klub Limit Less
              </p>
            </div>
            <div  className='py-4 flex flex-col '>
        <ul className='font-Archivo text-center font-medium'>
            <li  className='py-4 text-sm'>
            <Link onClick={() => setNav(false)}  className="cursor-pointer" activeClass ="active" to='home' spy={true} smooth={true} offset={-70} duration={500}>Home</Link>
            </li>
            <li  className='py-4 text-sm'>
            <Link onClick={() => setNav(false)}  className="cursor-pointer" activeClass ="active" to='mint' spy={true} smooth={true} offset={-70} duration={500}>Mint</Link>
            </li>
            <li  className='py-4 text-sm'>
            <Link onClick={() => setNav(false)} className="cursor-pointer" activeClass ="active" to='contact' spy={true} smooth={true} offset={-70} duration={500}>Contact Us</Link>
            </li>
            <li  className='py-4 text-sm'>
            <Link onClick={() => setNav(false)} className="cursor-pointer" activeClass ="active" to='faqs' spy={true} smooth={true} offset={-100} duration={500}>FAQs</Link>
            </li>
            
          </ul>

        </div>

        <div className='flex flex-col items-center justify-between'>
                    <div className='mx-6'>
                        <Darkmodebutton/>
                    </div>
                    <button type="button" class="mt-4 text-white dark:text-black font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 rounded-sm text-sm px-5 py-2.5 text-center"
             onClick={connectWalletHandlerMobile}>{walletAddress?'Connected' :'Connect Wallet'}</button>
        </div>
        </div>
        

      </div>
    </div>

    {/* home */}

    <div className="mt-[100px]" id='home'data-aos="fade">
        <div className="flex md:flex-row flex-col items-center lg:mx-16 md:mx-8 mx-2 justify-between">
            <div className="lg:mx-8 md:mx-4 mx-2 flex flex-col md:items-start items-center">
                
                <ul className="font-Archivo md:hidden items-center ">
                    <li className="mx-4 text-start flex items-end">
                        <h1 className="md:text-8xl text-6xl uppercase font-bold bg-gradient-to-r from-rose-600 via-red-700 to-red-600 bg-clip-text text-transparent">S</h1>
                        <h1 className="md:text-5xl text-4xl font-medium">kull</h1>
                    </li>
                    <li className="mx-4 text-start flex items-end">
                        <h1 className="md:text-8xl text-6xl uppercase font-bold bg-gradient-to-r from-rose-600 via-red-700 to-red-600  bg-clip-text text-transparent">K</h1>
                        <h1 className="md:text-5xl text-4xl font-medium">lub</h1>
                    </li>
                    <li className="mx-4 text-start flex items-end">
                        <h1 className="md:text-8xl text-6xl uppercase font-bold bg-gradient-to-r from-rose-600 via-red-700 to-red-600  bg-clip-text text-transparent">L</h1>
                        <h1 className="md:text-5xl text-4xl font-medium">imit<span className='bg-gradient-to-r from-rose-600 via-red-700 to-red-600 bg-clip-text text-transparent'>l</span>ess</h1>
                    </li>
                </ul>

                <ul className="hidden font-Archivo md:flex items-center ml-[-16px] ">
                    <li className="mx-4 text-start items-end">
                        <h1 className="md:text-9xl text-6xl uppercase font-bold bg-gradient-to-r from-rose-600 via-red-700 to-red-600 bg-clip-text text-transparent ml-[-2px]">SKLL</h1>
                        <h1 className="md:text-6xl text-4xl font-medium">
                          <span className='font-bold uppercase '>S</span>kull{' '}
                          <span className='font-bold uppercase '>K</span>lub{' '}
                          <span className='font-bold uppercase '>L</span>imit{' '}
                          <span className='font-bold uppercase '>L</span>ess{' '}
                          </h1>
                    </li>
                </ul>

                <p className="font-Archivo mt-4 md:text-md text-justify">
                  <ul className='list-none '>
                    <li>9-0 uniquely generated charachters</li>
                    <li>Every SKLL has own profile page that shows their attributes.</li>
                    <li>Collection with proof of ownership stored on Ethereum blockchain.</li>
                    <li>A single person on the Ethereum blockchain can officially own each one of this unique collection.</li>
                  </ul>
                </p>
                <div className="w-full h-auto flex flex-col md:items-start items-center mt-8">
                <Link className="cursor-pointer" activeClass ="active" to='mint' spy={true} smooth={true} offset={-70} duration={500}>
                    <button type="button" class="flex text-white dark:text-black bg-gradient-to-r from-rose-600 via-red-700 to-red-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-semibold tracking-widest rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                    Get your SKLL now
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                    </button>
                </Link>
                </div>
            </div>
           {/* <div className="lg:mx-8 md:mx-4 mx-2 md:mt-0 mt-2 flex flex-col items-end justify-center">
                <img src="/bg-gif.gif"
                className='md:w-[500px] md:h-[500px] w-[400px] h-[400px]'/> 
            </div>*/}
        </div>
        </div>

    {/* slide */}
    <div className="lg:mx-16 mx-2 ">
      {/* slider */}
        <div className="flex justify-center items-center my-20">
  <div className="md:mx-4 grid grid-cols-1 lg:grid-cols-5 gap-5 md:mt-0 mt-2">
    
   {data.map((item) =>
   <div key={item.id}className="max-w-sm bg-transpaent rounded-xl transform hover:scale-105 transition duration-500" data-aos="fade-up">
      <div className="relative">
        <img className="md:w-[500px] md:h-[300px] w-auto h-auto rounded-xl" src={item.image}alt="img" />
      </div>
    </div>
    )}
    </div>
    </div>
    </div>

    {/* mint */}
    <div id='mint'data-aos="fade">
    <div className='flex flex-col items-center lg:mx-16 mx-2'>
        <div className='lg:w-auto w-full h-full lg:px-16 lg:py-16 filter backdrop-blur-sm rounded-lg'>

      
    <img src='/web01.png' class="hidden md:flex blob w-[500px] h-[500px]  absolute top-[-50px] right-[-250px] -z-10 blur-md  bg-opacity-50 animate-pulse-slow overflow-x-hidden"/>
    <img src='/web02.png' class=" blob w-[500px] h-[500px] absolute bottom-[-70px] left-[-280px] -z-10 blur-md bg-opacity-60 animate-pulse-slow overflow-x-hidden"/>
    

        <div className=" bg-gray-300/40 dark:bg-gray-700/40 filter rounded-md flex flex-col items-center
    bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border-2 border-gray-100  md:w-auto w-full shadow-lg shadow-black/60 relative">
        <div className="flex flex-col items-center md:w-auto w-full"> 
          <div className="flex flex-col items-center w-full py-4 mt-6 md:mt-0 md:px-16 px-4">
          
          <div className='pb-4  flex flex-col items-center'>

            <h1 className="font-Kanit uppercase font-semibold text-3xl md:text-5xl bg-gradient-to-r from-rose-600 via-red-700 to-red-600 bg-clip-text text-transparent tracking-wider text-center mt-5">
            {paused ? 'Will be Live soon' : 'Minting is Live'}
            </h1>

            <h3 className="text-sm tracking-widest">
                {walletAddress
                ? walletAddress.slice(0, 8) + '...' + walletAddress.slice(-4)
                : 'Not connected'} 
                
            </h3>
          </div>
          <div className='flex flex-col'>
            <p className="text-2xl font-medium font-Kanit mt-5 tracking-wide">
                  <span className="text-red-600">{totalMinted}{'  '} </span>/<span className="text-red-600">{'  '} 910{'  '}</span>Minted
            </p>
          </div>
          
                  
            {/* Increment decrement buttons */}
            <div className="font-Kanit flex items-center justify-between w-full mt-5">
                  <button
                    className="w-12 h-8 md:w-14 md:h-10 flex items-center justify-center text-black hover:shadow-lg bg-gray-300 font-bold rounded-md"
                    onClick={decrementMintAmount}
                    >
                     <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 md:h-8 md:w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 12H6"
                      />
                    </svg>
                  </button>
                  <p className="flex items-center justify-center flex-1 grow text-center font-bold text-yellow-900 text-3xl md:text-4xl">
                  {mintAmount}  
                  </p>
                  <button
                    className="w-12 h-8 md:w-14 md:h-10 flex items-center justify-center text-black hover:shadow-lg bg-gray-300 font-bold rounded-md"
                    onClick={incrementMintAmount} 
                    >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 md:h-8 md:w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button> 
                </div> 

                <h1 className='text-xl font-medium font-Kanit mt-5 tracking-wide"'>Max mint amount per wallet: {config.maxMintAmount}</h1>

                <div className="border-t border-b py-4 mt-5 w-full font-semibold">
                  <div className="w-full text-xl font-Kanit flex items-center justify-between text-yellow-900">
                    <p>Total</p>

                    <div className="flex items-center space-x-3">
                    <p>
                         {Number.parseFloat((config.publicSalePrice)*mintAmount).toFixed(
                          2
                        )} {' '} 
                       
                         ETH
                      </p>{' '}
                      <span className="text-yellow-900">+ GAS</span>
                    </div>


                  </div>
                </div>

                
                    {/* mint button */}
                     {walletAddress ? (
                  <button
                    className={` ${
                      paused || isMinting 
                        ? 'bg-gray-900 cursor-not-allowed'
                        : 'bg-gradient-to-br from-gray-900 to-black shadow-lg border border-transparent hover:shadow-black/60'
                    } font-Kanit mt-5 mb-0 font-medium w-full px-6 py-3 rounded-md text-2xl text-white  mx-4 tracking-wide uppercase border-violet-50`}
                    disabled={paused || isMinting}
                    onClick={publicMintHandler}
                  >
                    {isMinting ? 'Busy...' : 'Mint Now'}
                  </button>
                ) : ( 
                  <button
                    className='bg-gradient-to-br from-gray-900 to-black shadow-lg border border-transparent hover:shadow-black/60
                     font-Kanit mt-5 mb-0 font-medium w-full px-6 py-3 rounded-md text-2xl text-white  mx-4 tracking-wide uppercase border-violet-50'
                    onClick={connectWalletHandler}
                     >
                    Connect wallet
                  </button> 
                  )} 

{/* social media icons paste correct links down below */}
<div className="flex w-full items-center justify-evenly mt-5 px-10">
  <a className="bg-white rounded-full mx-2 shadow-lg hove:shadow-black/60 hover:rotate-12" href='https://discord.gg/pHUcMAzn'>
    <img src='discord.svg' className='h-8 w-8 m-1'/>
  </a>
  <a className="bg-white rounded-full mx-2 shadow-lg hove:shadow-black/60 hover:rotate-12" href='https://twitter.com/skllproject0'>
    <img src='twitter.svg' className='h-8 w-8 m-1'/>
  </a>
  <a className="bg-white rounded-full mx-2 shadow-lg hove:shadow-black/60 hover:rotate-12" href={config.etherscanLink}>
    <img src='etherscansvg.svg' className='h-8 w-8 m-1'/>
  </a>
</div>

            <div className="font-Kanit max-w-screen-sm">
              {status && (
              <div
                className={`border ${
                  status.success ? 'border-green-500 text-white' : 'border-red-600 text-white'
                } rounded-md text-start h-full px-4 py-4 w-full mx-auto mt-8 md:mt-5"`}
              >
                <p className="flex flex-col space-y-2 text-sm md:text-base break-words ...">
                  {status.message}
                </p>
              </div>
            )}
            </div> 


                </div>
        </div>
      </div>
        </div>
        
    </div>
    
    </div>
    </>
  )
}

