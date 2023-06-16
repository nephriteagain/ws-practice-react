import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export default function ConnectingModal() {
  return (
    <div className="fixed z-[1100] top-0 left-0 w-full h-full">
      <div className="z-[1101] fixed top-0 left-0 w-full h-full bg-black opacity-60"></div>
      <div className="z-[1102] font-semibold absolute top-[30%] left-[50%] translate-x-[-50%] translate-y-[-100%] w-fit h-fit px-4 py-2 bg-slate-300 flex flex-row items-center justify-center gap-1 rounded-md">
        <span>
          <AiOutlineLoading3Quarters 
            className="animate-spin me-3"
          />
        </span>        
        <span>
        Connecting...
        </span>
      </div>
    </div>
  )
}
