import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapInner'), { 
  ssr: false, 
  loading: () => <div className='h-96 bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center text-gray-500'>Loading Map...</div> 
});

export default function CoverageMap() { 
  return <MapComponent />; 
}
