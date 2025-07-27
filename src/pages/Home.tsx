import React from 'react';

import TemporadaForm from '../components/TemporadaForm';
import JugadorForm from '../components/JugadorForm';

export default function Home() {
  return (
    <div className="w-screen min-h-screen overflow-x-hidden">
      <div className="max-w-full px-4 py-5 space-y-5">
        <div className="bg-cyan-500 p-4 rounded shadow-md flex flex-wrap gap-3 items-center justify-center w-full">
          <span className='text-xl font-bold text-white'>Menú principal</span>
        </div>
        <div className="max-w-full flex gap-4 items-start">
          <div className='w-full w-1/2'><TemporadaForm /></div>
          <div className='w-full w-1/2'><JugadorForm /></div>
          
        </div>
      </div>
    </div>
  )

}