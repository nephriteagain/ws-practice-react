

export default function QuitToast() {
  return (
    <div 
      style={{position: 'absolute', left: '50%', bottom: '-10%', transform: 'translateX(-50%)' }}
      className='quit-toast px-3 py-2 z-[50000] text-lg font-semibold bg-orange-300 border-2 border-orange-600 rounded-md shadow-md drop-shadow-md transition-all duration-300 text-center'
    >
      A Player Has Left The Game
    </div>
  )
}
