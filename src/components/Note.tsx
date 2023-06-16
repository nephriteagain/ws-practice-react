


export default function Note() {
  return (
    <div className='z-[5000] absolute bottom-[20%] left-[50%] max-w-[280px] h-fit px-3 py-1 rounded-md bg-slate-300 text-sm text-center text-gray-800 border-2 border-red-400 transition-all duration-500'
      id="note"
      style={{transform: 'translate(-50%, 1000%)'}}
    >
      backend is hosted in a free tier service, cold start might take a while
    </div>
  )
}
