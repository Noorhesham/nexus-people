import { PieChart } from '@mui/x-charts/PieChart';
import Image from 'next/image'
const data = [
    { id: 0, value: 10, label: 'series A' },
    { id: 1, value: 15, label: 'series B' },
    { id: 2, value: 20, label: 'series C' },
  ];

const Dashboard = () => {
    return (  
        <main className='w-full flex items-center justify-center'>
            {/* <PieChart
                series={[
                    {
                        innerRadius: 0,
                        
                    data,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 0, additionalRadius: -30, color: 'gray' },
                    },
                ]}
                height={200}
            /> */}
            {/* <Image width={1016} height={635} className='w-auto h-auto scale-75' src={'/logo.png'} alt=''/> */}
        </main>
    );
}
 
export default Dashboard;