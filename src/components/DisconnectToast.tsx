

export default function DisconnectToast() {
  return (
    <div 
    style={{position: 'absolute', left: '50%', bottom: '-10%', transform: 'translateX(-50%)' }}
    className='disconnect-toast px-3 py-2 absolute left-[50%] z-[0000] text-lg font-semibold bg-red-300 border-2 border-red-600 rounded-md shadow-md drop-shadow-md transition-all duration-300 text-center'
    >
      A Player Has Disconnected
    </div>
  )
}
