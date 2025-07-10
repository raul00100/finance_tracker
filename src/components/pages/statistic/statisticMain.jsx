import * as React from 'react';
import BalanceLineChart from './lineChart';
import PieActiveArc from './pieChart';
import MostLeast from './mostLeat';

export default function Statistics() {
  return (
    <div className='mb-20 mr-15'>
      < MostLeast />
      <div className='flex flex-col'>
        <div>     
          <h2 className='text-xl mt-10 italic mb-5'>Change of the balance over time</h2> 
          < BalanceLineChart />
        </div>
        <div className='mt-20'>
          <h2 className='text-xl italic mb-5'> Category of expenses/income</h2>
          < PieActiveArc />
        </div>
      </div>
    </div>
  );
}


//сделать такую же ленивую загрузку как на главной страницы для всех графиков когда нужная инофмация отсутсвует ✅
//разбить код на компоненстраницыужно будет отделить верхний таб от списка и тд ✅
//сделать редезайн самой страницы ✅