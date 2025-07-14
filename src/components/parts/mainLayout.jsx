// import React from 'react';
// import VerticalTabs from './tabs';
// import { Outlet } from 'react-router-dom';
// import Box from '@mui/material/Box';

// export default function MainLayout() {
//   return (
//     <Box sx={{display: 'flex'}} className="bg-[#f7f7f7]">
//       <Box sx={{display: 'flex', marginRight: '50px', width: '172px'}}>
//         <VerticalTabs/>
//       </Box>
//       <Box sx={{width: '100%'}} className='h-screen'>
//         <Outlet />
//       </Box>
//     </Box>
//   );
// } 

import React from 'react';
import VerticalTabs from './tabs';
import { Outlet } from 'react-router-dom';
// import Box from '@mui/material/Box';

export default function MainLayout() {
  return (
    <div className="bg-[#EFEFEF] h-screen flex">
      <div className='flex mr-[50px] w-[180px]'>
        <VerticalTabs/>
      </div>
      <div className='overflow-auto w-screen'>
        <Outlet />
      </div>
    </div>
  );
} 