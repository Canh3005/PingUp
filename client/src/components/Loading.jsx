import React from 'react'

const Loading = ({ height = '100vh', dark = false }) => {
  return (
    <div 
      style={{ height }} 
      className={`flex items-center justify-center ${dark ? 'bg-transparent' : ''}`}
    >
      <div className="relative">
        {/* Outer ring */}
        <div className={`w-16 h-16 rounded-full border-4 ${dark ? 'border-white/20' : 'border-gray-200'}`}></div>
        
        {/* Spinning ring */}
        <div 
          className={`absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent ${
            dark ? 'border-t-white' : 'border-t-blue-600'
          } animate-spin`}
        ></div>
        
        {/* Logo or dot in center */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${
          dark ? 'bg-white' : 'bg-blue-600'
        } animate-pulse`}></div>
      </div>
      
      {dark && (
        <span className="ml-4 text-white text-lg font-medium animate-pulse">Loading...</span>
      )}
    </div>
  )
}

export default Loading
