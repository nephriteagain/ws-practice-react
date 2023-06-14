import { FaRegCircle } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'

interface BoxProps {
  box: string
  index: number
  move: (box:string,index:number) => void
}

export default function Box({
  box,
  index,
  move
} : BoxProps) {
  return (
    <div
    className='odd:bg-[#fcfcfc] even:bg-zinc-400 w-[100px] aspect-square even:shadow-lg even:drop-shadow-lg'
    onClick={() => move(box, index)}
    >
      <div className="w-full h-full text-7xl flex items-center justify-center">
        {box === 'x' ? 
        <IoMdClose className="fill-blue-600 scale-[1.3]" /> : 
        box === 'o' ? 
        <FaRegCircle className="fill-red-600" /> : 
        ''}
      </div>
    </div>
  )
}
