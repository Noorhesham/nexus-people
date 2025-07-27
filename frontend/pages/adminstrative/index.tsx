import { LanguageDirectionContext } from "@/helpers/langDirection";
import Typography from '@mui/material/Typography';
import { FormattedMessage } from "react-intl";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Card from '@mui/material/Card';
import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Modal, Box, Fade } from '@mui/material';
import { CloseSharp, FilterAlt, Info, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import axios from 'axios';
import ModelManager from "@/components/home/TypeModel";
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Drawer from "@mui/material/Drawer";
import MobileStepper from '@mui/material/MobileStepper';
import ProjectNavigation from "@/components/PojectNavigation";
import Shots from "@/components/Shots";
import CrudComponent from "@/helpers/CRUD";

interface DataProps{
    _id: string,
    image: string,
    page: string
}

interface Props {
    windows?: () => Window;
}
  
interface FloorData {
    name: string;
    units: number;
    models: number;
    bathrooms: number;
    floors: number[];
    imageSrc: string;
    svgImage: React.ReactElement;
    usage: string;
    areas: { value: number, label: {ar: string, en: string}}[],
    unitCriteria: Record<string, UnitCriteria>
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
            unitIdentifier: string;
            availability: boolean
        }
    }
}

interface UnitCriteria {
    size: number;
    availability: boolean;
    facade: string[];
}

interface FilterCriteria {
    size: number | null;
    availability: boolean | null;
    facade: string | null;
}

const FouthFloorUnitCriteria: Record<string, UnitCriteria> = {
    'F4-01': { size: 108, availability: true, facade: ['Front', 'Side', 'Inner'] },
    'F4-02': { size: 63, availability: false, facade: ['Inner'] },
    'F4-03': { size: 41, availability: true, facade: ['Inner'] },
    'F4-04': { size: 41, availability: false, facade: ['Inner'] },
    'F4-05': { size: 41, availability: true, facade: ['Inner'] },
    'F4-06': { size: 52, availability: true, facade: ['Inner'] },
    'F4-07': { size: 54, availability: false, facade: ['Inner'] },
    'F4-08': { size: 38, availability: true, facade: ['Inner'] },
    'F4-09': { size: 38, availability: false, facade: ['Inner'] },
    'F4-10': { size: 38, availability: true, facade: ['Inner'] },
    'F4-11': { size: 54, availability: false, facade: ['Inner'] },
    'F4-12': { size: 52, availability: true, facade: ['Inner']  },
    'F4-13': { size: 41, availability: false, facade: ['Inner'] },
    'F4-14': { size: 41, availability: true, facade: ['Inner']  },
    'F4-15': { size: 41, availability: false, facade: ['Inner'] },
    'F4-16': { size: 41, availability: true, facade: ['Inner']  },
    'F4-17': { size: 41, availability: false, facade: ['Inner'] },
    'F4-18': { size: 63, availability: true, facade: ['Inner']  },
    'F4-19': { size: 133, availability: false, facade: ['Inner', 'Side', 'Front'] },
    'F4-20': { size: 86, availability: true, facade: ['Back', 'Side']  },
    'F4-21': { size: 43, availability: false, facade: ['Back'] },
    'F4-22': { size: 43, availability: true, facade: ['Back']  },
    'F4-23': { size: 43, availability: true, facade: ['Back']  },
    'F4-24': { size: 43, availability: true, facade: ['Back']  },
    'F4-25': { size: 43, availability: true, facade: ['Back']  },
    'F4-26': { size: 43, availability: true, facade: ['Back']  },
    'F4-27': { size: 43, availability: true, facade: ['Back']  },
    'F4-28': { size: 86, availability: true, facade: ['Back', 'Side']  },
};

const FifthFloorUnitCriteria: Record<string, UnitCriteria> = {
    'F5-01': { size: 67, availability: false, facade: ['Front', 'Side', 'Inner'] },
    'F5-02': { size: 63, availability: false, facade: ['Inner'] },
    'F5-03': { size: 41, availability: false, facade: ['Inner'] },
    'F5-04': { size: 41, availability: false, facade: ['Inner'] },
    'F5-05': { size: 41, availability: false, facade: ['Inner'] },
    'F5-06': { size: 52, availability: false, facade: ['Inner'] },
    'F5-07': { size: 54, availability: false, facade: ['Inner'] },
    'F5-08': { size: 38, availability: false, facade: ['Inner'] },
    'F5-09': { size: 38, availability: false, facade: ['Inner'] },
    'F5-10': { size: 38, availability: false, facade: ['Inner'] },
    'F5-11': { size: 54, availability: false, facade: ['Inner'] },
    'F5-12': { size: 52, availability: false, facade: ['Inner']  },
    'F5-13': { size: 41, availability: false, facade: ['Inner'] },
    'F5-14': { size: 41, availability: false, facade: ['Inner']  },
    'F5-15': { size: 41, availability: false, facade: ['Inner'] },
    'F5-16': { size: 41, availability: false, facade: ['Inner']  },
    'F5-17': { size: 41, availability: false, facade: ['Inner'] },
    'F5-18': { size: 63, availability: false, facade: ['Inner']  },
    'F5-19': { size: 133, availability: false, facade: ['Inner', 'Side', 'Front'] },
    'F5-20': { size: 86, availability: false, facade: ['Back', 'Side']  },
    'F5-21': { size: 43, availability: false, facade: ['Back'] },
    'F5-22': { size: 43, availability: false, facade: ['Back']  },
    'F5-23': { size: 43, availability: false, facade: ['Back']  },
    'F5-24': { size: 43, availability: false, facade: ['Back']  },
    'F5-25': { size: 43, availability: false, facade: ['Back']  },
    'F5-26': { size: 43, availability: false, facade: ['Back']  },
    'F5-27': { size: 43, availability: false, facade: ['Back']  },
    'F5-28': { size: 86, availability: false, facade: ['Back', 'Side']  },
};

const FourthFloorAreas = [
    { value: 38, label: { en: '38 m²', ar: '٣٨ م²' } },
    { value: 41, label: { en: '41 m²', ar: '٤١ م²' } },
    { value: 43, label: { en: '43 m²', ar: '٤٣ م²' } },
    { value: 54, label: { en: '54 m²', ar: '٥٤ م²' } },
    { value: 52, label: { en: '52 m²', ar: '٥٢ م²' } },
    { value: 63, label: { en: '63 m²', ar: '٦٣ م²' } },
    { value: 86, label: { en: '86 m²', ar: '٨٦ م²' } },
    { value: 108, label: { en: '108 m²', ar: '١٠٨ م²' } },
    { value: 133, label: { en: '133 m²', ar: '١٣٣ م²' } },
];

const FifthFloorAreas = [
    { value: 38, label: { en: '38 m²', ar: '٣٨ م²' } },
    { value: 41, label: { en: '41 m²', ar: '٤١ م²' } },
    { value: 43, label: { en: '43 m²', ar: '٤٣ م²' } },
    { value: 54, label: { en: '54 m²', ar: '٥٤ م²' } },
    { value: 52, label: { en: '52 m²', ar: '٥٢ م²' } },
    { value: 63, label: { en: '63 m²', ar: '٦٣ م²' } },
    { value: 67, label: { en: '67 m²', ar: '٦٧ م²' } },
    { value: 86, label: { en: '86 m²', ar: '٨٦ م²' } },
    { value: 133, label: { en: '133 m²', ar: '١٣٣ م²' } },
];

const Facades = [
    {value: 'Front', label: <FormattedMessage id="unit.frontFacade" />},
    {value: 'Back', label: <FormattedMessage id="unit.backFacade" />},
    {value: 'Side', label: <FormattedMessage id="unit.sideFacade" />},
    {value: 'Inner', label: <FormattedMessage id="unit.innerFacade" />},
]

const drawerWidth = 240;
  
const Adminstrative = (props: Props) => {
    const { isRTL } = useContext(LanguageDirectionContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState<Model>();
    const [cols, setCols] = useState(4);
    const [mobileOpen, setMobileOpen] = useState(false);

    const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
        size: null,
        availability: null,
        facade: null,
    });

    const apiEndpoint = `${process.env.BACKEND}background`;
    const [Data, setData] = useState<DataProps[]>()
    const [AboutObject, setAboutObject] = useState<DataProps>()
    const [type, setType] = useState<'image' | 'video' | null>()
    const {
      data,
      fetchData,
    } = CrudComponent({ apiEndpoint: `${process.env.BACKEND}` });
  
    useEffect(() => {
      fetchData(apiEndpoint, "Background Images")
    }, [apiEndpoint]);
  
    useEffect(() => {
      setData(data as any);
    }, [data]);
  
    useEffect(() => {
      // Filter the Data array to get the object where the page value is 'about'
      const aboutData = Data?.filter((item) => item.page === 'adminstrative') || [];
  
      // Check if there's any data after filtering
      if (aboutData.length > 0) {
        // Assuming you want to get the first object if there are multiple
        const firstAboutItem = aboutData[0];
        // Do something with the filtered data...
        setAboutObject(firstAboutItem)
      }
  
      
    }, [Data]);
  
    useEffect(() => {
      // Function to determine the type of URL (image or video)
      const determineType = (url: any) => {
        if (url?.endsWith('.mp4') || url?.endsWith('.wav')) {
          setType('video');
        } else if (url?.endsWith('.png') || url?.endsWith('.jpg') || url?.endsWith('.jpeg') || url?.endsWith('.gif') || url?.endsWith('.webp')) {
          setType('image');
        } else {
          // Default to null if the type cannot be determined
          setType(null);
        }
      };
  
      determineType(AboutObject?.image)
    }, [Data, AboutObject]);

    const handleDownloadBrochure = async () => {
        try {
            // Get the PDF URL from the API
            const response = await axios.get(`${process.env.BACKEND}portfolio/Administrative`);
            const pdfUrl = response.data?.portfolio[0]?.portfolio?.pdf;
    
            // Check if PDF URL exists
            if (pdfUrl) {
                // Fetch the PDF content as a Blob
                const pdfBlob = await axios.get(pdfUrl, { responseType: 'blob' });
                // Create a Blob URL for the PDF content
                const blobUrl = URL.createObjectURL(pdfBlob.data);
                // Create a temporary anchor element
                const link = document.createElement('a');
                link.href = blobUrl;
                // Set the download attribute to specify the filename
                link.setAttribute('download', 'Administrative Brouchure.pdf');
                // Simulate a click on the anchor element to trigger the download
                document.body.appendChild(link);
                link.click();
                // Cleanup: revoke the Blob URL
                URL.revokeObjectURL(blobUrl);
                // Cleanup: remove the anchor element
                document.body.removeChild(link);
            } else {
                console.error('PDF URL not found in the API response');
            }
        } catch (error) {
            console.error('Error downloading brochure:', error);
        }
    };

    useEffect (() => {
        const FetchData = async () => {
            try {
                await axios.post(`${process.env.BACKEND}mall/availability`, {mainType: 'Adminstrative'})
                .then((res) => {
                    res.data.units?.forEach((item: Model) => {
                        const unitIdentifier = item?.model?.details?.unitIdentifier[0];
                        const availability = item?.model?.details?.availability;
                    
                        // Check if the unit exists in unitCriteria
                        if (FouthFloorUnitCriteria.hasOwnProperty(unitIdentifier)) {
                            // Update the availability
                            FouthFloorUnitCriteria[unitIdentifier].availability = availability;
                        }

                        if (FifthFloorUnitCriteria.hasOwnProperty(unitIdentifier)) {
                            // Update the availability
                            FifthFloorUnitCriteria[unitIdentifier].availability = availability;
                        }
                    });
                })
            } catch (error) {
                
            }
        }
        FetchData()
    }, [])
    
    const { windows } = props;
    const container = windows !== undefined ? () => windows().document.body : undefined;

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const matchesCriteria = (unitId: string) => {
        const criteria = FouthFloorUnitCriteria[unitId] || FifthFloorUnitCriteria[unitId]
        if (filterCriteria.availability === null && filterCriteria.facade === null && filterCriteria.size === null){
            return null
        }
        return (
          (!filterCriteria?.size || criteria?.size === filterCriteria?.size) &&
          (filterCriteria?.availability === null || criteria?.availability === (filterCriteria?.availability === true)) &&
          (!filterCriteria?.facade || criteria?.facade[0] === filterCriteria?.facade || criteria?.facade[1] === filterCriteria?.facade || criteria?.facade[2] === filterCriteria?.facade)
        );
    };

    const { formatMessage } = useIntl();
    
    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    const setColumnsBasedOnScreenSize = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1280) {
            setCols(4);
        } else if (screenWidth >= 960) {
            setCols(3);
        } else {
            setCols(2);
        } 
    };

    useEffect(() => {
        setColumnsBasedOnScreenSize();
        window.addEventListener('resize', setColumnsBasedOnScreenSize);

        return () => {
            window.removeEventListener('resize', setColumnsBasedOnScreenSize);
        };
    }, []);
    
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

    const FourthFloor: FloorData = {
        name: formatMessage({id: 'floor.fourth'}),
        areas: FourthFloorAreas,
        unitCriteria: FouthFloorUnitCriteria,
        units: 56,
        models: 9,
        bathrooms: 2,
        floors: [4, 5],
        usage: formatMessage({id: 'floor.adminstrative'}),
        imageSrc: '/4TH-FLOOR.webp',
        svgImage:<svg version="1.0" 
        className='w-full  h-fit z-[4]' 
        xmlns="http://www.w3.org/2000/svg"
        width="7016.000000pt" 
        height="9922.000000pt" 
        viewBox="0 0 7016.000000 9922.000000"
        preserveAspectRatio="xMidYMid meet">
       
       <g transform="translate(0.000000,9922.000000) scale(0.100000,-0.100000)"
       fill="transparent" stroke="none">
       <path onClick={() => fetchModelData('F4-19')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-19') ? 'fill-primary opacity-50' : ''}`} d="M13516 78772 c-4 -3 -6 -1933 -6 -4289 l0 -4283 1640 0 1640 0 0
       -2365 0 -2365 895 0 895 0 0 2091 0 2090 248 -6 c136 -3 501 -10 812 -16 311
       -5 768 -14 1015 -18 257 -5 1260 -5 2335 -1 1037 5 2212 9 2613 10 l727 0 0
       4330 0 4330 -52 0 c-55 0 -12533 486 -12675 493 -45 3 -84 2 -87 -1z"/>
       <path onClick={() => fetchModelData('F4-18')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-18') ? 'fill-primary opacity-50' : ''}`} d="M18690 65755 l0 -3705 3805 0 3805 0 0 3705 0 3705 -3805 0 -3805 0
       0 -3705z"/>
       <path onClick={() => fetchModelData('F4-01')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-01') ? 'fill-primary opacity-50' : ''}`} d="M43577 69313 c-4 -3 -7 -1581 -7 -3505 l0 -3498 3840 0 3840 0 0
       -2045 0 -2045 875 0 875 0 0 2320 0 2320 1645 0 1645 0 -2 3228 -3 3227 -6351
       3 c-3493 1 -6354 -1 -6357 -5z"/>
       <path onClick={() => fetchModelData('F4-02')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-02') ? 'fill-primary opacity-50' : ''}`} d="M43600 58440 l0 -3720 3800 0 3800 0 0 3720 0 3720 -3800 0 -3800 0
       0 -3720z"/>
       <path onClick={() => fetchModelData('F4-17')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-17') ? 'fill-primary opacity-50' : ''}`} d="M16010 60125 l0 -1735 5160 0 5160 0 0 1735 0 1735 -5160 0 -5160 0
       0 -1735z"/>
       <path onClick={() => fetchModelData('F4-16')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-16') ? 'fill-primary opacity-50' : ''}`} d="M16010 56440 l0 -1740 5165 0 5165 0 0 1740 0 1740 -5165 0 -5165 0
       0 -1740z"/>
       <path onClick={() => fetchModelData('F4-15')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-15') ? 'fill-primary opacity-50' : ''}`} d="M16000 52765 l0 -1755 5160 0 5160 0 0 1755 0 1755 -5160 0 -5160 0
       0 -1755z"/>
       <path onClick={() => fetchModelData('F4-03')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-03') ? 'fill-primary opacity-50' : ''}`} d="M43600 52765 l0 -1745 5175 0 5175 0 0 1745 0 1745 -5175 0 -5175 0
       0 -1745z"/>
       <path onClick={() => fetchModelData('F4-04')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-04') ? 'fill-primary opacity-50' : ''}`} d="M43600 49090 l0 -1780 5178 2 5177 3 3 1778 2 1777 -5180 0 -5180 0
       0 -1780z"/>
       <path onClick={() => fetchModelData('F4-14')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-14') ? 'fill-primary opacity-50' : ''}`} d="M15992 49083 l3 -1768 5158 -3 5157 -2 0 1770 0 1770 -5160 0 -5160
       0 2 -1767z"/>
       <path onClick={() => fetchModelData('F4-13')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-13') ? 'fill-primary opacity-50' : ''}`} d="M16000 45390 l0 -1750 5160 0 5160 0 0 1750 0 1750 -5160 0 -5160 0
       0 -1750z"/>
       <path onClick={() => fetchModelData('F4-05')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-05') ? 'fill-primary opacity-50' : ''}`} d="M43600 45390 l0 -1750 5180 0 5180 0 0 1750 0 1750 -5180 0 -5180 0
       0 -1750z"/>
       <path onClick={() => fetchModelData('F4-06')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-06') ? 'fill-primary opacity-50' : ''}`} d="M43582 41233 l3 -2248 5183 -3 5182 -2 0 2250 0 2250 -5185 0 -5185
       0 2 -2247z"/>
       <path onClick={() => fetchModelData('F4-12')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-12') ? 'fill-primary opacity-50' : ''}`} d="M16000 41151 c0 -1516 3 -2292 10 -2296 6 -4 10 23 10 74 l0 81 5155
       0 5155 0 0 2215 0 2215 -5165 0 -5165 0 0 -2289z"/>
       <path onClick={() => fetchModelData('F4-11')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-11') ? 'fill-primary opacity-50' : ''}`} d="M22510 34730 l0 -4100 2950 0 2950 0 0 4100 0 4100 -2950 0 -2950 0
       0 -4100z"/>
       <path onClick={() => fetchModelData('F4-10')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-10') ? 'fill-primary opacity-50' : ''}`} d="M28550 34730 l0 -4100 2045 0 2045 0 0 4100 0 4100 -2045 0 -2045 0
       0 -4100z"/>
       <path onClick={() => fetchModelData('F4-09')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-09') ? 'fill-primary opacity-50' : ''}`} d="M32820 34730 l0 -4100 2055 0 2055 0 0 4100 0 4100 -2055 0 -2055 0
       0 -4100z"/>
       <path onClick={() => fetchModelData('F4-08')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-08') ? 'fill-primary opacity-50' : ''}`} d="M37110 34730 l0 -4100 2050 0 2050 0 0 4100 0 4100 -2050 0 -2050 0
       0 -4100z"/>
       <path onClick={() => fetchModelData('F4-07')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-07') ? 'fill-primary opacity-50' : ''}`} d="M41360 34730 l0 -4100 2960 0 2960 0 0 4100 0 4100 -2960 0 -2960 0
       0 -4100z"/>
       <path onClick={() => fetchModelData('F4-21')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-21') ? 'fill-primary opacity-50' : ''}`} d="M21050 22970 l0 -5230 1788 2 1787 3 0 5225 0 5225 -1787 3 -1788 2
       0 -5230z"/>
       <path onClick={() => fetchModelData('F4-22')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-22') ? 'fill-primary opacity-50' : ''}`} d="M24820 22965 l0 -5235 1785 0 1785 0 -2 5233 -3 5232 -1782 3 -1783
       2 0 -5235z"/>
       <path onClick={() => fetchModelData('F4-24')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-24') ? 'fill-primary opacity-50' : ''}`} d="M32830 23595 l0 -4605 2085 0 2085 0 -2 4603 -3 4602 -2082 3 -2083
       2 0 -4605z"/>
       <path onClick={() => fetchModelData('F4-25')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-25') ? 'fill-primary opacity-50' : ''}`} d="M37137 28193 c-4 -3 -7 -2076 -7 -4605 l0 -4598 2045 0 2045 0 0
       4605 0 4605 -2038 0 c-1121 0 -2042 -3 -2045 -7z"/>
       <path onClick={() => fetchModelData('F4-26')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-26') ? 'fill-primary opacity-50' : ''}`} d="M41420 22970 l0 -5230 1780 0 1780 0 -2 5228 -3 5227 -1777 3 -1778
       2 0 -5230z"/>
       <path onClick={() => fetchModelData('F4-27')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-27') ? 'fill-primary opacity-50' : ''}`} d="M45175 28188 c-3 -7 -4 -2362 -3 -5233 l3 -5220 1788 -3 1787 -2 -2
       5232 -3 5233 -1783 3 c-1421 2 -1784 0 -1787 -10z"/>
       <path onClick={() => fetchModelData('F4-23')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-23') ? 'fill-primary opacity-50' : ''}`} d="M28590 23590 l0 -4600 2040 0 2040 0 0 4600 0 4600 -2040 0 -2040 0
       0 -4600z"/>
       <path onClick={() => fetchModelData('F4-28')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-28') ? 'fill-primary opacity-50' : ''}`} d="M48932 22963 l3 -5218 3705 0 3705 0 3 5218 2 5217 -3710 0 -3710 0
       2 -5217z"/>
       <path onClick={() => fetchModelData('F4-20')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F4-20') ? 'fill-primary opacity-50' : ''}`} d="M13340 22955 l0 -5215 3770 0 3770 0 0 5215 0 5215 -3770 0 -3770 0
       0 -5215z"/>
       </g>
       </svg>
       
    };

    const FifthFloor: FloorData = {
        name: formatMessage({id: 'floor.fifth'}),
        areas: FifthFloorAreas,
        unitCriteria: FifthFloorUnitCriteria,
        units: 28,
        models: 9,
        bathrooms: 2,
        floors: [4, 5],
        usage: formatMessage({id: 'floor.adminstrative'}),
        imageSrc: '/5TH-FLOOR.webp',
        svgImage:<svg version="1.0" 
        className='w-full  h-fit z-[4]' 
        xmlns="http://www.w3.org/2000/svg"
        width="7016.000000pt" 
        height="9922.000000pt" 
        viewBox="0 0 7016.000000 9922.000000"
        preserveAspectRatio="xMidYMid meet">
       
       <g transform="translate(0.000000,9922.000000) scale(0.100000,-0.100000)"
       fill="transparent" stroke="none">
       <path onClick={() => fetchModelData('F5-19')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-19') ? 'fill-primary opacity-50' : ''}`} d="M13516 78772 c-4 -3 -6 -1933 -6 -4289 l0 -4283 1640 0 1640 0 0
       -2365 0 -2365 895 0 895 0 0 2091 0 2090 248 -6 c136 -3 501 -10 812 -16 311
       -5 768 -14 1015 -18 257 -5 1260 -5 2335 -1 1037 5 2212 9 2613 10 l727 0 0
       4330 0 4330 -52 0 c-55 0 -12533 486 -12675 493 -45 3 -84 2 -87 -1z"/>
       <path onClick={() => fetchModelData('F5-18')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-18') ? 'fill-primary opacity-50' : ''}`} d="M18690 65755 l0 -3705 3805 0 3805 0 0 3705 0 3705 -3805 0 -3805 0
       0 -3705z"/>
       <path onClick={() => fetchModelData('F5-01')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-01') ? 'fill-primary opacity-50' : ''}`} d="M43577 69313 c-4 -3 -7 -1581 -7 -3505 l0 -3498 3840 0 3840 0 0
       -2045 0 -2045 875 0 875 0 0 2320 0 2320 1645 0 1645 0 -2 3228 -3 3227 -6351
       3 c-3493 1 -6354 -1 -6357 -5z"/>
       <path onClick={() => fetchModelData('F5-02')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-02') ? 'fill-primary opacity-50' : ''}`} d="M43600 58440 l0 -3720 3800 0 3800 0 0 3720 0 3720 -3800 0 -3800 0
       0 -3720z"/>
       <path onClick={() => fetchModelData('F5-17')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-17') ? 'fill-primary opacity-50' : ''}`} d="M16010 60125 l0 -1735 5160 0 5160 0 0 1735 0 1735 -5160 0 -5160 0
       0 -1735z"/>
       <path onClick={() => fetchModelData('F5-16')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-16') ? 'fill-primary opacity-50' : ''}`} d="M16010 56440 l0 -1740 5165 0 5165 0 0 1740 0 1740 -5165 0 -5165 0
       0 -1740z"/>
       <path onClick={() => fetchModelData('F5-15')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-15') ? 'fill-primary opacity-50' : ''}`} d="M16000 52765 l0 -1755 5160 0 5160 0 0 1755 0 1755 -5160 0 -5160 0
       0 -1755z"/>
       <path onClick={() => fetchModelData('F5-03')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-03') ? 'fill-primary opacity-50' : ''}`} d="M43600 52765 l0 -1745 5175 0 5175 0 0 1745 0 1745 -5175 0 -5175 0
       0 -1745z"/>
       <path onClick={() => fetchModelData('F5-04')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-04') ? 'fill-primary opacity-50' : ''}`} d="M43600 49090 l0 -1780 5178 2 5177 3 3 1778 2 1777 -5180 0 -5180 0
       0 -1780z"/>
       <path onClick={() => fetchModelData('F5-14')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-14') ? 'fill-primary opacity-50' : ''}`} d="M15992 49083 l3 -1768 5158 -3 5157 -2 0 1770 0 1770 -5160 0 -5160
       0 2 -1767z"/>
       <path onClick={() => fetchModelData('F5-13')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-13') ? 'fill-primary opacity-50' : ''}`} d="M16000 45390 l0 -1750 5160 0 5160 0 0 1750 0 1750 -5160 0 -5160 0
       0 -1750z"/>
       <path onClick={() => fetchModelData('F5-05')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-05') ? 'fill-primary opacity-50' : ''}`} d="M43600 45390 l0 -1750 5180 0 5180 0 0 1750 0 1750 -5180 0 -5180 0
       0 -1750z"/>
       <path onClick={() => fetchModelData('F5-06')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-06') ? 'fill-primary opacity-50' : ''}`} d="M43582 41233 l3 -2248 5183 -3 5182 -2 0 2250 0 2250 -5185 0 -5185
       0 2 -2247z"/>
       <path onClick={() => fetchModelData('F5-12')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-12') ? 'fill-primary opacity-50' : ''}`} d="M16000 41151 c0 -1516 3 -2292 10 -2296 6 -4 10 23 10 74 l0 81 5155
       0 5155 0 0 2215 0 2215 -5165 0 -5165 0 0 -2289z"/>
       <path onClick={() => fetchModelData('F5-11')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-11') ? 'fill-primary opacity-50' : ''}`} d="M22510 34730 l0 -4100 2950 0 2950 0 0 4100 0 4100 -2950 0 -2950 0
       0 -4100z"/>
       <path onClick={() => fetchModelData('F5-10')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-10') ? 'fill-primary opacity-50' : ''}`} d="M28550 34730 l0 -4100 2045 0 2045 0 0 4100 0 4100 -2045 0 -2045 0
       0 -4100z"/>
       <path onClick={() => fetchModelData('F5-09')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-09') ? 'fill-primary opacity-50' : ''}`} d="M32820 34730 l0 -4100 2055 0 2055 0 0 4100 0 4100 -2055 0 -2055 0
       0 -4100z"/>
       <path onClick={() => fetchModelData('F5-08')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-08') ? 'fill-primary opacity-50' : ''}`} d="M37110 34730 l0 -4100 2050 0 2050 0 0 4100 0 4100 -2050 0 -2050 0
       0 -4100z"/>
       <path onClick={() => fetchModelData('F5-07')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-07') ? 'fill-primary opacity-50' : ''}`} d="M41360 34730 l0 -4100 2960 0 2960 0 0 4100 0 4100 -2960 0 -2960 0
       0 -4100z"/>
       <path onClick={() => fetchModelData('F5-21')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-21') ? 'fill-primary opacity-50' : ''}`} d="M21050 22970 l0 -5230 1788 2 1787 3 0 5225 0 5225 -1787 3 -1788 2
       0 -5230z"/>
       <path onClick={() => fetchModelData('F5-22')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-22') ? 'fill-primary opacity-50' : ''}`} d="M24820 22965 l0 -5235 1785 0 1785 0 -2 5233 -3 5232 -1782 3 -1783
       2 0 -5235z"/>
       <path onClick={() => fetchModelData('F5-24')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-24') ? 'fill-primary opacity-50' : ''}`} d="M32830 23595 l0 -4605 2085 0 2085 0 -2 4603 -3 4602 -2082 3 -2083
       2 0 -4605z"/>
       <path onClick={() => fetchModelData('F5-25')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-25') ? 'fill-primary opacity-50' : ''}`} d="M37137 28193 c-4 -3 -7 -2076 -7 -4605 l0 -4598 2045 0 2045 0 0
       4605 0 4605 -2038 0 c-1121 0 -2042 -3 -2045 -7z"/>
       <path onClick={() => fetchModelData('F5-26')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-26') ? 'fill-primary opacity-50' : ''}`} d="M41420 22970 l0 -5230 1780 0 1780 0 -2 5228 -3 5227 -1777 3 -1778
       2 0 -5230z"/>
       <path onClick={() => fetchModelData('F5-27')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-27') ? 'fill-primary opacity-50' : ''}`} d="M45175 28188 c-3 -7 -4 -2362 -3 -5233 l3 -5220 1788 -3 1787 -2 -2
       5232 -3 5233 -1783 3 c-1421 2 -1784 0 -1787 -10z"/>
       <path onClick={() => fetchModelData('F5-23')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-23') ? 'fill-primary opacity-50' : ''}`} d="M28590 23590 l0 -4600 2040 0 2040 0 0 4600 0 4600 -2040 0 -2040 0
       0 -4600z"/>
       <path onClick={() => fetchModelData('F5-28')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-28') ? 'fill-primary opacity-50' : ''}`} d="M48932 22963 l3 -5218 3705 0 3705 0 3 5218 2 5217 -3710 0 -3710 0
       2 -5217z"/>
       <path onClick={() => fetchModelData('F5-20')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F5-20') ? 'fill-primary opacity-50' : ''}`} d="M13340 22955 l0 -5215 3770 0 3770 0 0 5215 0 5215 -3770 0 -3770 0
       0 -5215z"/>
       </g>
       </svg>
       
    };

    const [selectedFloor, setSelectedFloor] = useState<FloorData>(FourthFloor)

    const [FloorActiveStep, setFloorActiveStep] = useState(0);

    const handleNext = () => {
      setFloorActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSelectedFloor(FifthFloor)
    };
  
    const handleBack = () => {
      setFloorActiveStep((prevActiveStep) => prevActiveStep - 1);
      setSelectedFloor(FourthFloor)
    };

    const drawer = (
        <Card dir={isRTL? 'rtl' : 'ltr'} className="w-full h-full px-4 space-y-4 py-2">
            <div className="space-y-4">
                <Typography variant="h4">
                    <FormattedMessage id="unit.area" />
                </Typography>
                <div className="flex flex-wrap gap-4">
                    {selectedFloor.areas.map((item) =>(
                        <Chip key={item.value} className={filterCriteria.size === item.value? 'bg-primary text-white' : ''} label={isRTL? item.label.ar : item.label.en} onClick={() => filterCriteria.size === item.value? setFilterCriteria({ ...filterCriteria, size: null}) : setFilterCriteria({ ...filterCriteria, size: item.value}) }/>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <Typography variant="h4">
                    <FormattedMessage id="unit.availability" />
                </Typography>
                <div className="flex flex-wrap gap-4">
                    <Chip className={filterCriteria.availability === true? 'bg-primary text-white' : ''} label={<FormattedMessage id="unit.available" />} onClick={() => filterCriteria.availability === true? setFilterCriteria({ ...filterCriteria, availability: null}) : setFilterCriteria({ ...filterCriteria, availability: true}) }/>
                    <Chip className={filterCriteria.availability === false? 'bg-primary text-white' : ''} label={<FormattedMessage id="unit.notAvailable"/>} onClick={() =>  filterCriteria.availability === false? setFilterCriteria({ ...filterCriteria, availability: null}) : setFilterCriteria({ ...filterCriteria, availability: false}) }/>
                </div>
            </div>

            <div className="space-y-4">
                <Typography variant="h4">
                    <FormattedMessage id="unit.facade" />
                </Typography>
                <div className="flex flex-wrap gap-4">
                    {Facades.map((facade) => (
                        <Chip key={facade.value} className={filterCriteria.facade === facade.value? 'bg-primary text-white' : ''} label={facade.label} onClick={() => filterCriteria.facade === facade.value? setFilterCriteria({ ...filterCriteria, facade: null}) : setFilterCriteria({ ...filterCriteria, facade: facade.value})}/>
                    ))}
                </div>
            </div>
        
            <div className="flex justify-center">
                <Button variant="contained" className="bg-primary" onClick={() => setFilterCriteria({availability: null, facade: null, size: null})}>
                    <FormattedMessage id="unit.clear" />
                </Button>
            </div>
        </Card>
    );

    return (  
        <main dir={isRTL? 'rtl' : 'ltr'} className={"min-h-screen bg-secondary flex flex-col items-center text-white overflow-hidden"}>
            <div className="min-h-[80vh] border-b-4 border-white w-screen relative bg-cover bg-center flex items-center justify-center"
        style={{backgroundImage: type === 'image'? `url("${AboutObject?.image}")`: 'transparent'}}
        >
                      {type === 'video' && AboutObject?.image && (
    <video autoPlay muted loop className="min-h-[78vh] max-h-[78vh] w-screen absolute inset-0 object-cover">
      <source src={AboutObject?.image} type="video/mp4" />
    </video>)}
                <div className={`absolute inset-0 bg-secondary opacity-50`}></div>

                <div className={`flex flex-col items-center ${isRTL? 'space-y-4' : ''} justify-center z-[3]`}>
                    <Typography textAlign={'center'} variant="h1" className="text-white text-5xl md:text-7xl">
                        <FormattedMessage id="floor.adminstrative"/>
                    </Typography>

                    <Breadcrumbs className="text-gray-300" aria-label="breadcrumb">
                        <Link href="/" className="hover:text-white">
                            <FormattedMessage id="navbar.home"/>
                        </Link>
                        <Typography color=""><FormattedMessage id="floor.adminstrative"/></Typography>
                    </Breadcrumbs>
                </div>
            </div>

            <div className="bg-secondary w-full px-2 md:px-20 space-y-8 py-20 grid place-items-center lg:py-32">
                <div id="info" className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4 flex flex-col justify-center">
                        <Typography fontSize={40} variant="h2">
                            <FormattedMessage id="floor.adminstrative" />
                        </Typography>
                        <Typography>
                            {isRTL? Description.ar : Description.en}
                        </Typography>

                        <div className="grid md:grid-cols-4 place-items-center gap-max">

                            <div>
                                <Typography textAlign={'center'} variant="h3" className="[text-shadow:_0px_5px_0px_rgb(0_0_0_/_40%)]">
                                    {FourthFloor.units.toLocaleString(isRTL? 'ar-EG' : 'en-GB')}&nbsp;
                                </Typography>
                                <Typography textAlign={'center'} variant="h6">
                                    <FormattedMessage id="floor.units" />
                                </Typography>
                            </div>

                            <div>
                                <Typography textAlign={'center'} variant="h3" className="[text-shadow:_0px_5px_0px_rgb(0_0_0_/_40%)]">
                                    {FourthFloor.models.toLocaleString(isRTL? 'ar-EG' : 'en-GB')}&nbsp;
                                </Typography>
                                <Typography variant="h6">
                                    <FormattedMessage id="floor.models" /> / <FormattedMessage id="floor.floor"/>
                                </Typography>
                            </div>

                            <div>
                                <Typography textAlign={'center'} variant="h3" className="[text-shadow:_0px_5px_0px_rgb(0_0_0_/_40%)]">
                                    {FourthFloor.bathrooms.toLocaleString(isRTL? 'ar-EG' : 'en-GB')}&nbsp;
                                </Typography>
                                <Typography textAlign={'center'} variant="h6">
                                    <FormattedMessage id="floor.bathrooms" /> / <FormattedMessage id="floor.floor"/>
                                </Typography>
                            </div>

                            <div>
                                <Typography textAlign={'center'} variant="h3" className="[text-shadow:_0px_5px_0px_rgb(0_0_0_/_40%)]">
                                    {FourthFloor.floors[0].toLocaleString(isRTL? 'ar-EG' : 'en-GB')} {' , '} {FourthFloor.floors[1].toLocaleString(isRTL? 'ar-EG' : 'en-GB')}&nbsp;
                                </Typography>
                                <Typography textAlign={'center'} variant="h6">
                                    <FormattedMessage id="floor.floors" />
                                </Typography>
                            </div>

                        </div>
  
                        <div className="flex justify-center pt-8">
                            <Button variant="contained" onClick={handleDownloadBrochure} size="large" className="bg-white scale-[1.1] hover:scale-[1.2] text-secondary hover:bg-white transition duration-300 ease" sx={{"&.MuiButton-outlined" : {color: '#fff', borderColor: '#fff'}}}>
                                <FormattedMessage id="brochure.download" />
                            </Button>
                        </div>

                    </div>
                    <div className="order-first md:order-last">
                        <Image src={'/Admin Cover.jpg'} alt="Adminstrative" width={600} height={600} className="w-full rounded-xl"/>
                    </div>
                </div>

                <Shots />
                
                <div id="plan" className="flex flex-col items-center justify-center space-y-4 py-8 ">
                    <Typography textAlign={'center'} variant="h2" className="relative md:top-16 lg:top-0  min-[1770px]:top-[8rem] mb-4">
                        <FormattedMessage id="project.plan" />
                    </Typography>

                    <MobileStepper
                        variant="text"
                        steps={2}
                        position="static"
                        activeStep={FloorActiveStep}
                        className="lg:hidden w-full bg-secondary text-white relative md:top-20"
                        nextButton={
                            <Button
                                size="small"
                                onClick={handleNext}
                                disabled={FloorActiveStep === 1}
                            >
                                {isRTL ? (<KeyboardArrowLeft />) : (<KeyboardArrowRight />)}
                            </Button>
                        }
                        backButton={
                            <Button size="small" onClick={handleBack} disabled={FloorActiveStep === 0}>
                                {isRTL ? (<KeyboardArrowRight />) : (<KeyboardArrowLeft />)}
                            </Button>
                        }

                        sx={
                            {"&.MuiMobileStepper-root:before" :{
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            content: `"${selectedFloor.name}"`,
                            color: 'white'
                        }, 
                        "&.MuiMobileStepper-root" :{
                            color: 'transparent'
                        }}}
                    />
                    <div className="grid lg:grid-cols-4 place-items-center lg:px-4 lg:px-0 lg:space-y-0  min-[1770px]:py-60">
                        <Button variant="contained" onClick={handleDrawerToggle} className="lg:hidden col-span-4 bg-primary relative md:top-20" endIcon={<FilterAlt />}>
                            <FormattedMessage id="unit.filter" />
                        </Button>
                        <Card className="w-full px-4 space-y-8 py-8 hidden lg:grid z-[2]">

                            <div className="w-full">
                                <MobileStepper
                                    variant="text"
                                    steps={2}
                                    position="static"
                                    activeStep={FloorActiveStep}
        
                                    nextButton={
                                        <Button
                                            size="small"
                                            onClick={handleNext}
                                            disabled={FloorActiveStep === 1}
                                        >
                                            {isRTL ? (<KeyboardArrowLeft />) : (<KeyboardArrowRight />)}
                                        </Button>
                                    }
                                    backButton={
                                        <Button size="small" onClick={handleBack} disabled={FloorActiveStep === 0}>
                                            {isRTL ? (<KeyboardArrowRight />) : (<KeyboardArrowLeft />)}
                                        </Button>
                                    }

                                    sx={
                                        {"&.MuiMobileStepper-root:before" :{
                                        position: 'absolute',
                                        left: '16.5%',
                                        transform: 'translateX(-50%)',
                                        content: `"${selectedFloor.name}"`,
                                        color: 'black'
                                    }, 
                                    "&.MuiMobileStepper-root" :{
                                        color: 'transparent'
                                    }}}
                                    
                                />
                            </div>

                            <div className="space-y-4">
                                <Typography variant="h4">
                                    <FormattedMessage id="unit.area" />
                                </Typography>
                                <div className="flex flex-wrap gap-4">
                                    {selectedFloor.areas.map((item) =>(
                                        <Chip key={item.value} className={filterCriteria.size === item.value? 'bg-primary text-white' : ''} label={isRTL? item.label.ar : item.label.en} onClick={() => filterCriteria.size === item.value? setFilterCriteria({ ...filterCriteria, size: null}) : setFilterCriteria({ ...filterCriteria, size: item.value}) }/>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Typography variant="h4">
                                    <FormattedMessage id="unit.availability" />
                                </Typography>
                                <div className="flex flex-wrap gap-4">
                                    <Chip className={filterCriteria.availability === true? 'bg-primary text-white' : ''} label={<FormattedMessage id="unit.available" />} onClick={() => filterCriteria.availability === true? setFilterCriteria({ ...filterCriteria, availability: null}) : setFilterCriteria({ ...filterCriteria, availability: true}) }/>
                                    <Chip className={filterCriteria.availability === false? 'bg-primary text-white' : ''} label={<FormattedMessage id="unit.notAvailable"/>} onClick={() =>  filterCriteria.availability === false? setFilterCriteria({ ...filterCriteria, availability: null}) : setFilterCriteria({ ...filterCriteria, availability: false}) }/>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Typography variant="h4">
                                    <FormattedMessage id="unit.facade" />
                                </Typography>
                                <div className="flex flex-wrap gap-4">
                                    {Facades.map((facade) => (
                                        <Chip key={facade.value} className={filterCriteria.facade === facade.value? 'bg-primary text-white' : ''} label={facade.label} onClick={() => filterCriteria.facade === facade.value? setFilterCriteria({ ...filterCriteria, facade: null}) : setFilterCriteria({ ...filterCriteria, facade: facade.value})}/>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex justify-center">
                                <Button variant="contained" className="bg-primary" onClick={() => setFilterCriteria({availability: null, facade: null, size: null})}>
                                    <FormattedMessage id="unit.clear" />
                                </Button>
                            </div>

                        </Card>
                        

                        <div className="lg:relative col-span-4 lg:col-span-3 flex justify-center items-center lg:w-full">
                            <div className="lg:absolute md:rotate-90 rounded-xl  max-w-[1200px] min-[1550px]:w-10/12 min-[2000px]:w-8/12"                            
                                style={{ backgroundImage: `url('${selectedFloor.imageSrc}')`, backgroundSize: 'cover', transition: 'background-image 1s ease',}}
                            >
                                {FloorActiveStep === 0? FourthFloor.svgImage : FifthFloor.svgImage}
                            </div>
                        </div>

                        <div className="col-span-4 relative w-full md:-top-32 lg:top-0 xl:top-10 min-[1550px]:top-[2rem] min-[1800px]:top-[4rem] min-[1900px]:top-[6rem] min-[1950px]:top-[8rem] min-[2050px]:top-[10rem]" >
                            <Typography className=" lg:px-8 flex justify-center w-full absolute text-white">
                                <Info />
                                <FormattedMessage id="unit.click" />
                            </Typography>
                        </div>
                    </div>
                </div>

                <div id="location" className="w-full space-y-4 lg:pt-8">
                    <Typography textAlign={'center'} variant="h2">
                        <FormattedMessage id="project.location" />
                    </Typography>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3454.362090524099!2d31.4655146!3d30.0264682!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145823dfcc15ea0d%3A0xeebd01f17acd6fff!2sNexus%20Business%20HUB!5e0!3m2!1sar!2seg!4v1710871154912!5m2!1sar!2seg"                        
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="eager"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-96 rounded-xl"
                    />
                </div>
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

                        <ModelManager ModelData={selectedModel}/>
                    </Box>
                </Fade>
            </Modal>

            <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: "flex", lg: "none" },
                    "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>

            <ProjectNavigation />
        </main>
    );
}
 
export default Adminstrative;

const Description = {
    ar: "تقع المكاتب الإدارية للمشروع في الدور الرابع بمساحات مختلفة لتناسب كافة الأنشطة، مع توفير مساحات خارجية لتوفير المزيد من الراحة.",
    en: "The project's administrative offices are located on the fourth floor with different spaces to suit all activities, while providing outdoor spaces to provide more comfort.",
}

const Images = [
    '/3d/1.webp',
    '/3d/2.webp',
    '/3d/10.webp',
    '/3d/15.webp',
    '/3d/1.webp',
    '/3d/2.webp',
    '/3d/10.webp',
    '/3d/15.webp',
    '/3d/1.webp',
]

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