import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./MapView'), { 
  ssr: false, 
  loading: () => (
    <div className='h-full w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center'>
      <span className='text-gray-400'>Loading map...</span>
    </div>
  )
});

export default DynamicMap;
