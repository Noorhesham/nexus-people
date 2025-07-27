import { useContext, useState } from 'react';
import FloorGallery from './FloorGallery';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useIntl } from 'react-intl';
import { LanguageDirectionContext } from '@/helpers/langDirection';
import { Modal, Box, Fade } from '@mui/material';
import ModelManager from './TypeModel';
import { CloseSharp } from '@mui/icons-material';
import axios from 'axios';

interface FloorData {
  units: number;
  models: number;
  bathrooms: number;
  floors: string[];
  imageSrc: string;
  svgImage: React.ReactElement;
  usage: string;
}

interface Model {
  _id: string;
  model: {
    _id: string
    mainType: string;
    secondaryType: { ar?: string; en?: string; };
    details: {
    images: any[],
    length: number,
    width: number,
    height: number,
    squareMeter: number,
    description: { ar?: string; en?: string; };
    }
  }
}

const MallManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>();

  const { formatMessage } = useIntl();
    
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchModelData = async (id: string) => {
    try {
      await axios.post(`${process.env.BACKEND}mall/filter`, { unitIdentifier: id})
      .then(async (res) => {
       setSelectedModel(res.data.result[0] as Model)
       handleOpenModal()
      })
    } catch (error) {
      
    }
  }


  const FirstFloor: FloorData = {
    units: 24,
    models: 9,
    bathrooms: 0,
    floors: [formatMessage({id: 'floor.ground'}), formatMessage({id: 'floor.first'})],
    usage: formatMessage({id: 'floor.commercial'}),
    imageSrc: '/F1.webp',
    svgImage: <svg version="1.0" 
    className='w-full md:w-[25rem] h-fit z-[4]'
    xmlns="http://www.w3.org/2000/svg"
    width="7016.000000pt" height="9922.000000pt"
    viewBox="0 0 7016.000000 9922.000000"
    preserveAspectRatio="xMidYMid meet">
   
   <g transform="translate(0.000000,9922.000000) scale(0.100000,-0.100000)"
   fill="transparent" stroke="none">
   <path onClick={() => fetchModelData('G1-24')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M13460 73865 l0 -3475 5275 0 5275 0 0 3314 c0 1925 -4 3317 -9 3320
   -5 3 -2317 73 -5137 155 -2821 82 -5191 152 -5266 156 l-138 6 0 -3476z"/>
   <path onClick={() => fetchModelData('G1-02')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M45536 76102 c-3 -3 -6 -2142 -6 -4754 l0 -4748 2495 0 2495 0 0
   4649 0 4649 -112 6 c-62 4 -1148 49 -2413 101 -1265 52 -2335 96 -2377 98 -42
   3 -79 2 -82 -1z"/>
   <path onClick={() => fetchModelData('G1-01')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M50730 71245 l0 -4645 2685 0 2685 0 0 4535 c0 2494 -4 4535 -8 4535
   -5 0 -1203 49 -2663 110 -1460 60 -2664 110 -2676 110 l-23 0 0 -4645z"/>
   <path onClick={() => fetchModelData('G1-23')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M16402 67943 l3 -2038 3800 0 3800 0 3 2038 2 2037 -3805 0 -3805 0
   2 -2037z"/>
   <path onClick={() => fetchModelData('G1-03')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M45520 64645 l0 -1685 5295 0 5295 0 0 1685 0 1685 -5295 0 -5295 0
   0 -1685z"/>
   <path onClick={() => fetchModelData('G1-22')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M16850 64770 l0 -900 -1705 0 -1705 0 0 -820 0 -820 5305 0 5305 0 0
   1720 0 1720 -3600 0 -3600 0 0 -900z"/>
   <path onClick={() => fetchModelData('G1-04')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M45520 60590 l0 -2090 3795 0 3795 0 0 2090 0 2090 -3795 0 -3795 0
   0 -2090z"/>
   <path onClick={() => fetchModelData('G1-21')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M13440 60240 l0 -1680 5285 0 5285 0 0 1680 0 1680 -5285 0 -5285 0
   0 -1680z"/>
   <path onClick={() => fetchModelData('G1-20')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M13440 56570 l0 -1780 5285 0 5285 0 -2 1778 -3 1777 -5282 3 -5283
   2 0 -1780z"/>
   <path onClick={() => fetchModelData('G1-05')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M45520 56530 l0 -1710 5283 2 5282 3 3 828 2 827 -1490 0 -1490 0 0
   880 0 880 -3795 0 -3795 0 0 -1710z"/>
   <path onClick={() => fetchModelData('G1-19')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M13440 52815 l0 -1715 5283 2 5282 3 0 1710 0 1710 -5282 3 -5283 2
   0 -1715z"/>
   <path onClick={() => fetchModelData('G1-06')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M45520 52815 l0 -1715 5283 2 5282 3 3 1713 2 1712 -5285 0 -5285 0
   0 -1715z"/>
   <path onClick={() => fetchModelData('G1-18')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M13440 49135 l0 -1655 5283 2 5282 3 0 1650 0 1650 -5282 3 -5283 2
   0 -1655z"/>
   <path onClick={() => fetchModelData('G1-07')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M45520 49135 l0 -1655 5285 0 5285 0 0 1655 0 1655 -5285 0 -5285 0
   0 -1655z"/>
   <path onClick={() => fetchModelData('G1-17')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M13440 45325 l0 -1845 5283 2 5282 3 3 1843 2 1842 -5285 0 -5285 0
   0 -1845z"/>
   <path onClick={() => fetchModelData('G1-08')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M45520 45325 l0 -1845 5283 2 5282 3 3 1843 2 1842 -5285 0 -5285 0
   0 -1845z"/>
   <path onClick={() => fetchModelData('G1-16')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M13440 41295 l0 -1875 5285 0 5285 0 -2 1873 -3 1872 -5282 3 -5283
   2 0 -1875z"/>
   <path onClick={() => fetchModelData('G1-09')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M45520 41295 l0 -1875 5285 0 5285 0 0 1875 0 1875 -5285 0 -5285 0
   0 -1875z"/>
   <path onClick={() => fetchModelData('G1-15')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M13440 37380 l0 -1770 5283 2 5282 3 0 1765 0 1765 -5282 3 -5283 2
   0 -1770z"/>
   <path onClick={() => fetchModelData('G1-10')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M45520 37380 l0 -1770 5283 2 5282 3 0 1765 0 1765 -5282 3 -5283 2
   0 -1770z"/>
   <path onClick={() => fetchModelData('G1-13')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M22502 27808 l3 -7613 2953 -3 2952 -2 0 7615 0 7615 -2955 0 -2955
   0 2 -7612z"/>
   <path onClick={() => fetchModelData('G1-12')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M41200 27805 l0 -7615 2953 2 2952 3 3 7613 2 7612 -2955 0 -2955 0
   0 -7615z"/>
   <path onClick={() => fetchModelData('G1-14')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M13532 24568 l3 -4373 4345 0 4345 0 3 4373 2 4372 -4350 0 -4350 0
   2 -4372z"/>
   <path onClick={() => fetchModelData('G1-11')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M47382 24568 l3 -4373 4345 0 4345 0 3 4373 2 4372 -4350 0 -4350 0
   2 -4372z"/>
   </g>
   </svg>
   
   
  };
  
  const SecondFloor: FloorData = {
    units: 28,
    models: 9,
    bathrooms: 2,
    floors: [formatMessage({id: 'floor.second'}), formatMessage({id: 'floor.third'})],
    usage: formatMessage({id: 'floor.medical'}),
    imageSrc: '/F2.webp',
    svgImage:<svg version="1.0" 
    className='w-full  md:w-[25rem] h-fit z-[4]' 
    xmlns="http://www.w3.org/2000/svg"
    width="7016.000000pt" 
    height="9922.000000pt" 
    viewBox="0 0 7016.000000 9922.000000"
    preserveAspectRatio="xMidYMid meet">
   
   <g transform="translate(0.000000,9922.000000) scale(0.100000,-0.100000)"
   fill="transparent" stroke="none">
   <path onClick={() => fetchModelData('F2-19')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M13516 78772 c-4 -3 -6 -1933 -6 -4289 l0 -4283 1640 0 1640 0 0
   -2365 0 -2365 895 0 895 0 0 2091 0 2090 248 -6 c136 -3 501 -10 812 -16 311
   -5 768 -14 1015 -18 257 -5 1260 -5 2335 -1 1037 5 2212 9 2613 10 l727 0 0
   4330 0 4330 -52 0 c-55 0 -12533 486 -12675 493 -45 3 -84 2 -87 -1z"/>
   <path onClick={() => fetchModelData('F2-18')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M18690 65755 l0 -3705 3805 0 3805 0 0 3705 0 3705 -3805 0 -3805 0
   0 -3705z"/>
   <path onClick={() => fetchModelData('F2-01')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M43577 69313 c-4 -3 -7 -1581 -7 -3505 l0 -3498 3840 0 3840 0 0
   -2045 0 -2045 875 0 875 0 0 2320 0 2320 1645 0 1645 0 -2 3228 -3 3227 -6351
   3 c-3493 1 -6354 -1 -6357 -5z"/>
   <path onClick={() => fetchModelData('F2-02')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M43600 58440 l0 -3720 3800 0 3800 0 0 3720 0 3720 -3800 0 -3800 0
   0 -3720z"/>
   <path onClick={() => fetchModelData('F2-17')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M16010 60125 l0 -1735 5160 0 5160 0 0 1735 0 1735 -5160 0 -5160 0
   0 -1735z"/>
   <path onClick={() => fetchModelData('F2-16')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M16010 56440 l0 -1740 5165 0 5165 0 0 1740 0 1740 -5165 0 -5165 0
   0 -1740z"/>
   <path onClick={() => fetchModelData('F2-15')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M16000 52765 l0 -1755 5160 0 5160 0 0 1755 0 1755 -5160 0 -5160 0
   0 -1755z"/>
   <path onClick={() => fetchModelData('F2-03')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M43600 52765 l0 -1745 5175 0 5175 0 0 1745 0 1745 -5175 0 -5175 0
   0 -1745z"/>
   <path onClick={() => fetchModelData('F2-04')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M43600 49090 l0 -1780 5178 2 5177 3 3 1778 2 1777 -5180 0 -5180 0
   0 -1780z"/>
   <path onClick={() => fetchModelData('F2-14')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M15992 49083 l3 -1768 5158 -3 5157 -2 0 1770 0 1770 -5160 0 -5160
   0 2 -1767z"/>
   <path onClick={() => fetchModelData('F2-13')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M16000 45390 l0 -1750 5160 0 5160 0 0 1750 0 1750 -5160 0 -5160 0
   0 -1750z"/>
   <path onClick={() => fetchModelData('F2-05')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M43600 45390 l0 -1750 5180 0 5180 0 0 1750 0 1750 -5180 0 -5180 0
   0 -1750z"/>
   <path onClick={() => fetchModelData('F2-06')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M43582 41233 l3 -2248 5183 -3 5182 -2 0 2250 0 2250 -5185 0 -5185
   0 2 -2247z"/>
   <path onClick={() => fetchModelData('F2-12')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M16000 41151 c0 -1516 3 -2292 10 -2296 6 -4 10 23 10 74 l0 81 5155
   0 5155 0 0 2215 0 2215 -5165 0 -5165 0 0 -2289z"/>
   <path onClick={() => fetchModelData('F2-11')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M22510 34730 l0 -4100 2950 0 2950 0 0 4100 0 4100 -2950 0 -2950 0
   0 -4100z"/>
   <path onClick={() => fetchModelData('F2-10')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M28550 34730 l0 -4100 2045 0 2045 0 0 4100 0 4100 -2045 0 -2045 0
   0 -4100z"/>
   <path onClick={() => fetchModelData('F2-09')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M32820 34730 l0 -4100 2055 0 2055 0 0 4100 0 4100 -2055 0 -2055 0
   0 -4100z"/>
   <path onClick={() => fetchModelData('F2-08')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M37110 34730 l0 -4100 2050 0 2050 0 0 4100 0 4100 -2050 0 -2050 0
   0 -4100z"/>
   <path onClick={() => fetchModelData('F2-07')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M41360 34730 l0 -4100 2960 0 2960 0 0 4100 0 4100 -2960 0 -2960 0
   0 -4100z"/>
   <path onClick={() => fetchModelData('F2-21')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M21050 22970 l0 -5230 1788 2 1787 3 0 5225 0 5225 -1787 3 -1788 2
   0 -5230z"/>
   <path onClick={() => fetchModelData('F2-22')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M24820 22965 l0 -5235 1785 0 1785 0 -2 5233 -3 5232 -1782 3 -1783
   2 0 -5235z"/>
   <path onClick={() => fetchModelData('F2-24')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M32830 23595 l0 -4605 2085 0 2085 0 -2 4603 -3 4602 -2082 3 -2083
   2 0 -4605z"/>
   <path onClick={() => fetchModelData('F2-25')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M37137 28193 c-4 -3 -7 -2076 -7 -4605 l0 -4598 2045 0 2045 0 0
   4605 0 4605 -2038 0 c-1121 0 -2042 -3 -2045 -7z"/>
   <path onClick={() => fetchModelData('F2-26')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M41420 22970 l0 -5230 1780 0 1780 0 -2 5228 -3 5227 -1777 3 -1778
   2 0 -5230z"/>
   <path onClick={() => fetchModelData('F2-27')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M45175 28188 c-3 -7 -4 -2362 -3 -5233 l3 -5220 1788 -3 1787 -2 -2
   5232 -3 5233 -1783 3 c-1421 2 -1784 0 -1787 -10z"/>
   <path onClick={() => fetchModelData('F2-23')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M28590 23590 l0 -4600 2040 0 2040 0 0 4600 0 4600 -2040 0 -2040 0
   0 -4600z"/>
   <path onClick={() => fetchModelData('F2-28')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M48932 22963 l3 -5218 3705 0 3705 0 3 5218 2 5217 -3710 0 -3710 0
   2 -5217z"/>
   <path onClick={() => fetchModelData('F2-20')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M13340 22955 l0 -5215 3770 0 3770 0 0 5215 0 5215 -3770 0 -3770 0
   0 -5215z"/>
   </g>
   </svg>
  };
  
  const FourthFloor: FloorData = {
    units: 28,
    models: 9,
    bathrooms: 2,
    floors: [formatMessage({id: 'floor.fourth'}), formatMessage({id: 'floor.fifth'})],
    usage: formatMessage({id: 'floor.adminstrative'}),
    imageSrc: '/F4.webp',
    svgImage:<svg version="1.0" 
    className='w-full  md:w-[25rem] h-fit z-[4]' 
    xmlns="http://www.w3.org/2000/svg"
    width="7016.000000pt" 
    height="9922.000000pt" 
    viewBox="0 0 7016.000000 9922.000000"
    preserveAspectRatio="xMidYMid meet">
   
   <g transform="translate(0.000000,9922.000000) scale(0.100000,-0.100000)"
   fill="transparent" stroke="none">
   <path onClick={() => fetchModelData('F4-19')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M13516 78772 c-4 -3 -6 -1933 -6 -4289 l0 -4283 1640 0 1640 0 0
   -2365 0 -2365 895 0 895 0 0 2091 0 2090 248 -6 c136 -3 501 -10 812 -16 311
   -5 768 -14 1015 -18 257 -5 1260 -5 2335 -1 1037 5 2212 9 2613 10 l727 0 0
   4330 0 4330 -52 0 c-55 0 -12533 486 -12675 493 -45 3 -84 2 -87 -1z"/>
   <path onClick={() => fetchModelData('F4-18')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M18690 65755 l0 -3705 3805 0 3805 0 0 3705 0 3705 -3805 0 -3805 0
   0 -3705z"/>
   <path onClick={() => fetchModelData('F4-01')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M43577 69313 c-4 -3 -7 -1581 -7 -3505 l0 -3498 3840 0 3840 0 0
   -2045 0 -2045 875 0 875 0 0 2320 0 2320 1645 0 1645 0 -2 3228 -3 3227 -6351
   3 c-3493 1 -6354 -1 -6357 -5z"/>
   <path onClick={() => fetchModelData('F4-02')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M43600 58440 l0 -3720 3800 0 3800 0 0 3720 0 3720 -3800 0 -3800 0
   0 -3720z"/>
   <path onClick={() => fetchModelData('F4-17')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M16010 60125 l0 -1735 5160 0 5160 0 0 1735 0 1735 -5160 0 -5160 0
   0 -1735z"/>
   <path onClick={() => fetchModelData('F4-16')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M16010 56440 l0 -1740 5165 0 5165 0 0 1740 0 1740 -5165 0 -5165 0
   0 -1740z"/>
   <path onClick={() => fetchModelData('F4-15')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M16000 52765 l0 -1755 5160 0 5160 0 0 1755 0 1755 -5160 0 -5160 0
   0 -1755z"/>
   <path onClick={() => fetchModelData('F4-03')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M43600 52765 l0 -1745 5175 0 5175 0 0 1745 0 1745 -5175 0 -5175 0
   0 -1745z"/>
   <path onClick={() => fetchModelData('F4-04')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M43600 49090 l0 -1780 5178 2 5177 3 3 1778 2 1777 -5180 0 -5180 0
   0 -1780z"/>
   <path onClick={() => fetchModelData('F4-14')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M15992 49083 l3 -1768 5158 -3 5157 -2 0 1770 0 1770 -5160 0 -5160
   0 2 -1767z"/>
   <path onClick={() => fetchModelData('F4-13')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M16000 45390 l0 -1750 5160 0 5160 0 0 1750 0 1750 -5160 0 -5160 0
   0 -1750z"/>
   <path onClick={() => fetchModelData('F4-05')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M43600 45390 l0 -1750 5180 0 5180 0 0 1750 0 1750 -5180 0 -5180 0
   0 -1750z"/>
   <path onClick={() => fetchModelData('F4-06')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M43582 41233 l3 -2248 5183 -3 5182 -2 0 2250 0 2250 -5185 0 -5185
   0 2 -2247z"/>
   <path onClick={() => fetchModelData('F4-12')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M16000 41151 c0 -1516 3 -2292 10 -2296 6 -4 10 23 10 74 l0 81 5155
   0 5155 0 0 2215 0 2215 -5165 0 -5165 0 0 -2289z"/>
   <path onClick={() => fetchModelData('F4-11')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M22510 34730 l0 -4100 2950 0 2950 0 0 4100 0 4100 -2950 0 -2950 0
   0 -4100z"/>
   <path onClick={() => fetchModelData('F4-10')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M28550 34730 l0 -4100 2045 0 2045 0 0 4100 0 4100 -2045 0 -2045 0
   0 -4100z"/>
   <path onClick={() => fetchModelData('F4-09')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M32820 34730 l0 -4100 2055 0 2055 0 0 4100 0 4100 -2055 0 -2055 0
   0 -4100z"/>
   <path onClick={() => fetchModelData('F4-08')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M37110 34730 l0 -4100 2050 0 2050 0 0 4100 0 4100 -2050 0 -2050 0
   0 -4100z"/>
   <path onClick={() => fetchModelData('F4-07')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M41360 34730 l0 -4100 2960 0 2960 0 0 4100 0 4100 -2960 0 -2960 0
   0 -4100z"/>
   <path onClick={() => fetchModelData('F4-21')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M21050 22970 l0 -5230 1788 2 1787 3 0 5225 0 5225 -1787 3 -1788 2
   0 -5230z"/>
   <path onClick={() => fetchModelData('F4-22')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M24820 22965 l0 -5235 1785 0 1785 0 -2 5233 -3 5232 -1782 3 -1783
   2 0 -5235z"/>
   <path onClick={() => fetchModelData('F4-24')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M32830 23595 l0 -4605 2085 0 2085 0 -2 4603 -3 4602 -2082 3 -2083
   2 0 -4605z"/>
   <path onClick={() => fetchModelData('F4-25')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M37137 28193 c-4 -3 -7 -2076 -7 -4605 l0 -4598 2045 0 2045 0 0
   4605 0 4605 -2038 0 c-1121 0 -2042 -3 -2045 -7z"/>
   <path onClick={() => fetchModelData('F4-26')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M41420 22970 l0 -5230 1780 0 1780 0 -2 5228 -3 5227 -1777 3 -1778
   2 0 -5230z"/>
   <path onClick={() => fetchModelData('F4-27')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M45175 28188 c-3 -7 -4 -2362 -3 -5233 l3 -5220 1788 -3 1787 -2 -2
   5232 -3 5233 -1783 3 c-1421 2 -1784 0 -1787 -10z"/>
   <path onClick={() => fetchModelData('F4-23')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M28590 23590 l0 -4600 2040 0 2040 0 0 4600 0 4600 -2040 0 -2040 0
   0 -4600z"/>
   <path onClick={() => fetchModelData('F4-28')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M48932 22963 l3 -5218 3705 0 3705 0 3 5218 2 5217 -3710 0 -3710 0
   2 -5217z"/>
   <path onClick={() => fetchModelData('F4-20')} className="hover:fill-primary hover:opacity-50 cursor-pointer" d="M13340 22955 l0 -5215 3770 0 3770 0 0 5215 0 5215 -3770 0 -3770 0
   0 -5215z"/>
   </g>
   </svg>
   
  };

  const { isRTL } = useContext(LanguageDirectionContext);
  const [AllFloors, setAllFloors] = useState<FloorData[]>([FirstFloor, SecondFloor, FourthFloor]);
  const [activeFloor, setActiveFloor] = useState<FloorData>(isRTL? FirstFloor : FourthFloor);
  
  const handleChange = (event: React.SyntheticEvent, newAlignment: string) => {
    const selectedFloor = AllFloors.find((floor) => floor.usage.toLowerCase() === newAlignment);
    setActiveFloor(selectedFloor as FloorData);
  };

  return (
    <main id='mallManager' dir={isRTL? 'rtl' : 'ltr'} className='min-h-screen pb-8 space-y-8 relative overflow-hidden'>
      {/* Skewed Background */}
      <div className='bg-secondary absolute top-0 left-0 right-0 bottom-0 transform  z-0'></div>

      <div className='relative z-10'>
        <div className='w-full flex justify-center'>
          <Tabs
            value={activeFloor ? activeFloor.usage.toLowerCase() : ''}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
          >
            {AllFloors.map((floor) => (
              <Tab className={`text-white text-md sm:text-lg md:text-xl  ${activeFloor === floor? '' : 'hover:scale-125 transition-all ease-in-out'}`} key={floor.usage} value={floor.usage.toLowerCase()} label={floor.usage} />
            ))}
          </Tabs>
        </div>

        {activeFloor && (
          <div>
            <FloorGallery floorData={activeFloor} imageSrc={activeFloor.imageSrc} svgImage={activeFloor.svgImage} />
          </div>
        )}
      </div>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Fade in={isModalOpen}>
            <Box sx={modalStyle}>
              <div className="flex flex-row-reverse w-full">
                <CloseSharp
                  className="relative right-0 hover:text-red-500 cursor-pointer"
                  onClick={handleCloseModal}
                />
              </div>

              {/* <ModelManager ModelData={selectedModel}/> */}
            </Box>
          </Fade>
        </Modal>
    </main>
  );
};

export default MallManager;

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  transition: 'height 2s',
  width: '80vw',
  borderRadius: '20px',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
