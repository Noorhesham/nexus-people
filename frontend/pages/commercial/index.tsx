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
  
interface UnitCriteria {
    size: number;
    availability: boolean;
    facade: string[];
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


interface FilterCriteria {
    size: number | null;
    availability: boolean | null;
    facade: string | null;
}

const UpperGroundUnitCriteria: Record<string, UnitCriteria> = {
    'G1-01': { size: 55, availability: true, facade: ['Front', 'Side'] },
    'G1-02': { size: 52, availability: false, facade: ['Front', 'Inner'] },
    'G1-03': { size: 41, availability: true, facade: ['Inner', 'Side'] },
    'G1-04': { size: 34, availability: false, facade: ['Inner'] },
    'G1-05': { size: 35, availability: true, facade: ['Inner', 'Side'] },
    'G1-06': { size: 41, availability: true, facade: ['Inner', 'Side'] },
    'G1-07': { size: 41, availability: false, facade: ['Inner', 'Side'] },
    'G1-08': { size: 45, availability: true, facade: ['Inner', 'Side'] },
    'G1-09': { size: 45, availability: false, facade: ['Inner', 'Side'] },
    'G1-10': { size: 42, availability: true, facade: ['Inner', 'Side'] },
    'G1-11': { size: 84, availability: false, facade: ['Back', 'Side'] },
    'G1-12': { size: 100, availability: true, facade: ['Inner', 'Back']  },
    'G1-13': { size: 100, availability: false, facade: ['Inner', 'Back'] },
    'G1-14': { size: 84, availability: true, facade: ['Back', 'Side']  },
    'G1-15': { size: 42, availability: false, facade: ['Inner', 'Side'] },
    'G1-16': { size: 45, availability: true, facade: ['Inner', 'Side']  },
    'G1-17': { size: 45, availability: false, facade: ['Inner', 'Side'] },
    'G1-18': { size: 41, availability: true, facade: ['Inner', 'Side']  },
    'G1-19': { size: 41, availability: false, facade: ['Inner', 'Side'] },
    'G1-20': { size: 41, availability: true, facade: ['Inner', 'Side']  },
    'G1-21': { size: 41, availability: false, facade: ['Inner', 'Side'] },
    'G1-22': { size: 35, availability: true, facade: ['Inner', 'Side']  },
    'G1-23': { size: 74, availability: true, facade: ['Inner', 'Front']  },
    'G1-24': { size: 42, availability: true, facade: ['Front', 'Side']  },
};

const LowerGroundUnitCriteria: Record<string, UnitCriteria> = {
    'G0-01': { size: 119, availability: false, facade: ['Front', 'Side'] },
    'G0-02': { size: 90, availability: false, facade: ['Front', 'Inner'] },
    'G0-03': { size: 100, availability: false, facade: ['Inner'] },
    'G0-04': { size: 127, availability: false, facade: ['Inner', 'Side'] },
    'G0-05': { size: 88, availability: false, facade: ['Inner', 'Side'] },
    'G0-06': { size: 63, availability: false, facade: ['Inner', 'Side'] },
    'G0-07': { size: 407, availability: false, facade: ['Inner', 'Side', 'Back'] },
    'G0-08': { size: 89, availability: false, facade: ['Inner', ] },
    'G0-09': { size: 89, availability: false, facade: ['Inner'] },
    'G0-10': { size: 407, availability: false, facade: ['Inner', 'Side', 'Back'] },
    'G0-11': { size: 63, availability: false, facade: ['Side', 'Inner'] },
    'G0-12': { size: 100, availability: false, facade: ['Inner', 'Side']  },
    'G0-13': { size: 97, availability: false, facade: ['Inner', 'Side'] },
    'G0-14': { size: 129, availability: false, facade: ['Back', 'Side', 'Inner']  },
    'G0-15': { size: 136, availability: false, facade: ['Inner', 'Front'] },
    'G0-16': { size: 78, availability: false, facade: ['Side', 'Front']  },
};

const FirstFloorUnitCriteria: Record<string, UnitCriteria> = {
    'F1-01': { size: 157, availability: false, facade: ['Front', 'Side', 'Inner'] },
    'F1-02': { size: 63, availability: false, facade: [ 'Inner'] },
    'F1-03': { size: 41, availability: false, facade: ['Inner'] },
    'F1-04': { size: 41, availability: false, facade: ['Inner'] },
    'F1-05': { size: 41, availability: false, facade: ['Inner'] },
    'F1-06': { size: 52, availability: false, facade: ['Inner'] },
    'F1-07': { size: 27, availability: false, facade: ['Inner'] },
    'F1-08': { size: 83, availability: false, facade: ['Back', 'Side'] },
    'F1-09': { size: 86, availability: false, facade: ['Back'] },
    'F1-10': { size: 86, availability: false, facade: ['Back'] },
    'F1-11': { size: 83, availability: false, facade: ['Side', 'Back'] },
    'F1-12': { size: 27, availability: false, facade: ['Inner']  },
    'F1-13': { size: 52, availability: false, facade: ['Inner'] },
    'F1-14': { size: 41, availability: false, facade: ['Inner']  },
    'F1-15': { size: 41, availability: false, facade: ['Inner',] },
    'F1-16': { size: 41, availability: false, facade: ['Inner',]  },
    'F1-17': { size: 41, availability: false, facade: ['Inner'] },
    'F1-18': { size: 41, availability: false, facade: ['Inner']  },
    'F1-19': { size: 63, availability: false, facade: ['Inner'] },
    'F1-20': { size: 146, availability: false, facade: ['Side', 'Front', 'Inner']  },
};

const UpperGroundAreas = [
    { value: 34, label: { en: '34 m²', ar: '٣٤ م²' } },
    { value: 35, label: { en: '35 m²', ar: '٣٥ م²' } },
    { value: 41, label: { en: '41 m²', ar: '٤١ م²' } },
    { value: 42, label: { en: '42 m²', ar: '٤٢ م²' } },
    { value: 45, label: { en: '45 m²', ar: '٤٥ م²' } },
    { value: 52, label: { en: '52 m²', ar: '٥٢ م²' } },
    { value: 55, label: { en: '55 m²', ar: '٥٥ م²' } },
    { value: 74, label: { en: '74 m²', ar: '۷٤ م²' } },
    { value: 81, label: { en: '81 m²', ar: '٨١ م²' } },
    { value: 84, label: { en: '84 m²', ar: '٨٤ م²' } },
    { value: 100, label: { en: '100 m²', ar: '١٠٠ م²' } },
];

const LowerGroundAreas = [
    { value: 63, label: { en: "63 m²", ar: "٦٣ م²" } },
    { value: 78, label: { en: "78 m²", ar: "٧٨ م²" } },
    { value: 88, label: { en: "88 m²", ar: "٨٨ م²" } },
    { value: 89, label: { en: "89 m²", ar: "٨٩ م²" } },
    { value: 90, label: { en: "90 m²", ar: "٩٠ م²" } },
    { value: 100, label: { en: "100 m²", ar: "١٠٠ م²" } },
    { value: 119, label: { en: "119 m²", ar: "١١٩ م²" } },
    { value: 127, label: { en: "127 m²", ar: "١٢٧ م²" } },
    { value: 129, label: { en: "129 m²", ar: "١٢٩ م²" } },
    { value: 136, label: { en: "136 m²", ar: "١٣٦ م²" } },
    { value: 407, label: { en: "407 m²", ar: "٤٠٧ م²" } }
];

const FirstFloorAreas = [
    { value: 27, label: { en: "27 m²", ar: "٦٣ م²" } },
    { value: 41, label: { en: "41 m²", ar: "٧٨ م²" } },
    { value: 52, label: { en: "52 m²", ar: "٨٨ م²" } },
    { value: 63, label: { en: "63 m²", ar: "٨٩ م²" } },
    { value: 83, label: { en: "83 m²", ar: "٩٠ م²" } },
    { value: 86, label: { en: "86 m²", ar: "١٠٠ م²" } },
    { value: 146, label: { en: "146 m²", ar: "١١٩ م²" } },
    { value: 157, label: { en: "157 m²", ar: "١٢٧ م²" } },
];

const Facades = [
    {value: 'Front', label: <FormattedMessage id="unit.frontFacade" />},
    {value: 'Back', label: <FormattedMessage id="unit.backFacade" />},
    {value: 'Side', label: <FormattedMessage id="unit.sideFacade" />},
    {value: 'Inner', label: <FormattedMessage id="unit.innerFacade" />},
]

const drawerWidth = 240;

const Commercial = (props: Props) => {
    const { isRTL } = useContext(LanguageDirectionContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState<Model>();
    const [cols, setCols] = useState(4);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [Brouchure, setBrouchure] = useState<File | null>(null)

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
      const aboutData = Data?.filter((item) => item.page === 'commercial') || [];
  
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
            const response = await axios.get(`${process.env.BACKEND}portfolio/Commercial`);
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
                link.setAttribute('download', 'Commercial Brouchure.pdf');
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
                await axios.post(`${process.env.BACKEND}mall/availability`, {mainType: 'Commercial'})
                .then((res) => {
                    res.data.units?.forEach((item: Model) => {
                        const unitIdentifier = item?.model?.details?.unitIdentifier[0];
                        const availability = item?.model?.details?.availability;
                    
                        // Check if the unit exists in unitCriteria
                        if (UpperGroundUnitCriteria.hasOwnProperty(unitIdentifier)) {
                            // Update the availability
                            UpperGroundUnitCriteria[unitIdentifier].availability = availability;
                        }

                        if (LowerGroundUnitCriteria.hasOwnProperty(unitIdentifier)) {
                            // Update the availability
                            LowerGroundUnitCriteria[unitIdentifier].availability = availability;
                        }

                        if (FirstFloorUnitCriteria.hasOwnProperty(unitIdentifier)) {
                            // Update the availability
                            FirstFloorUnitCriteria[unitIdentifier].availability = availability;
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

    useEffect(() => {
        const fetchBrouchure = async () => {
            await axios.get(`${process.env.BACKEND}portfolio/Commercial`)
            .then((res: any) => {
                setBrouchure(res?.data?.portfolio[0]?.portfolio.pdf)
            })
        }

        fetchBrouchure()
    }, [])

    const matchesCriteria = (unitId: string) => {
        const criteria = LowerGroundUnitCriteria[unitId] || UpperGroundUnitCriteria[unitId] || FirstFloorUnitCriteria[unitId]
        if (filterCriteria.availability === null && filterCriteria.facade === null && filterCriteria.size === null){
            return null
        }
        return (
          (!filterCriteria?.size || criteria?.size === filterCriteria?.size) &&
          (filterCriteria?.availability === null || criteria?.availability === (filterCriteria?.availability === true)) &&
          (!filterCriteria?.facade || criteria?.facade[0] === filterCriteria?.facade || criteria?.facade[1] === filterCriteria?.facade || criteria?.facade[2] === filterCriteria?.facade)
        );
    };

    const CommercialDetails= {
        units: 57,
        superMarkets: 2,
        pharmacy: 1,
        storages: 8,
        outdoor: 28,
        floors: ["G0", "G1", 1]
    }

    const UpperGround: FloorData = {
        name: formatMessage({id: 'floor.upperGround'}),
        units: 40,
        models: 23,
        bathrooms: 0,
        floors: [0, 1],
        usage: formatMessage({id: 'floor.commercial'}),
        imageSrc: '/UPPER-FLOOR.webp',
        areas: UpperGroundAreas,
        unitCriteria: UpperGroundUnitCriteria,
        svgImage:

        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="7016.000000pt" height="9922.000000pt" viewBox="0 0 7016.000000 9922.000000"
 preserveAspectRatio="xMidYMid meet" className='w-full  h-fit z-[4]' >

<g transform="translate(0.000000,9922.000000) scale(0.100000,-0.100000)"
fill="transparent" stroke="none">
<path onClick={() => fetchModelData('G1-24')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-24') ? 'fill-primary opacity-50' : ''}`} d="M13400 73891 l0 -3599 2043 -6 c1123 -4 2321 -6 2662 -4 l620 3 3
3512 2 3511 -112 6 c-62 4 -1220 42 -2573 86 -1353 43 -2502 82 -2552 84 l-93
5 0 -3598z"/>
<path onClick={() => fetchModelData('G1-23')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-23') ? 'fill-primary opacity-50' : ''}`} d="M18874 73740 l7 -3550 -1091 0 -1090 0 2 -2162 3 -2163 3675 0 3675
0 3 5607 2 5606 -62 6 c-59 5 -5039 207 -5102 206 l-29 0 7 -3550z"/>
<path onClick={() => fetchModelData('G1-02')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-02') ? 'fill-primary opacity-50' : ''}`} d="M45535 76222 c-3 -3 -5 -2169 -5 -4814 l0 -4808 2520 0 2520 0 0
4710 0 4710 -32 0 c-38 0 -4816 197 -4925 203 -40 2 -75 2 -78 -1z"/>
<path onClick={() => fetchModelData('G1-01')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-01') ? 'fill-primary opacity-50' : ''}`} d="M50742 71299 l3 -4704 2725 0 2725 0 3 4588 c2 3665 0 4588 -10 4591
-7 2 -1190 52 -2628 110 -1438 59 -2661 110 -2718 113 l-102 6 2 -4704z"/>
<path onClick={() => fetchModelData('G1-03')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-03') ? 'fill-primary opacity-50' : ''}`} d="M45520 64665 l0 -1745 5323 2 5322 3 3 1743 2 1742 -5325 0 -5325 0
0 -1745z"/>
<path onClick={() => fetchModelData('G1-22')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-22') ? 'fill-primary opacity-50' : ''}`} d="M16707 65683 c-4 -3 -7 -408 -7 -900 l0 -893 -1635 0 -1635 0 0 -860
0 -860 5325 0 5325 0 -2 1758 -3 1757 -3681 3 c-2024 1 -3684 -1 -3687 -5z"/>
<path onClick={() => fetchModelData('G1-04')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-04') ? 'fill-primary opacity-50' : ''}`} d="M45520 60630 l0 -2130 3708 2 3707 3 3 2128 2 2127 -3710 0 -3710 0
0 -2130z"/>
<path onClick={() => fetchModelData('G1-21')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-21') ? 'fill-primary opacity-50' : ''}`} d="M13430 60230 l0 -1760 5325 0 5325 0 -2 1758 -3 1757 -5322 3 -5323
2 0 -1760z"/>
<path onClick={() => fetchModelData('G1-05')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-05') ? 'fill-primary opacity-50' : ''}`} d="M45520 56560 l0 -1750 5285 0 5285 0 0 845 0 845 -1585 0 -1585 0 -2
903 -3 902 -3697 3 -3698 2 0 -1750z"/>
<path onClick={() => fetchModelData('G1-20')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-20') ? 'fill-primary opacity-50' : ''}`} d="M13435 58278 c-3 -7 -4 -800 -3 -1763 l3 -1750 5320 0 5320 0 0 1760
0 1760 -5318 3 c-4249 2 -5319 0 -5322 -10z"/>
<path onClick={() => fetchModelData('G1-19')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-19') ? 'fill-primary opacity-50' : ''}`} d="M13435 54618 c-3 -7 -4 -800 -3 -1763 l3 -1750 5320 0 5320 0 0 1760
0 1760 -5318 3 c-4249 2 -5319 0 -5322 -10z"/>
<path onClick={() => fetchModelData('G1-06')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-06') ? 'fill-primary opacity-50' : ''}`} d="M45520 52865 l0 -1765 5320 0 5320 0 0 1765 0 1765 -5320 0 -5320 0
0 -1765z"/>
<path onClick={() => fetchModelData('G1-18')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-18') ? 'fill-primary opacity-50' : ''}`} d="M13435 50908 c-3 -7 -4 -789 -3 -1738 l3 -1725 5320 0 5320 0 0 1735
0 1735 -5318 3 c-4249 2 -5319 0 -5322 -10z"/>
<path onClick={() => fetchModelData('G1-07')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-07') ? 'fill-primary opacity-50' : ''}`} d="M45520 49180 l0 -1740 5320 0 5320 0 0 1740 0 1740 -5320 0 -5320 0
0 -1740z"/>
<path onClick={() => fetchModelData('G1-17')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-17') ? 'fill-primary opacity-50' : ''}`} d="M13437 47233 c-4 -3 -7 -865 -7 -1915 l0 -1908 5325 0 5325 0 -2
1913 -3 1912 -5316 3 c-2924 1 -5319 -1 -5322 -5z"/>
<path onClick={() => fetchModelData('G1-08')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-08') ? 'fill-primary opacity-50' : ''}`} d="M45520 45325 l0 -1915 5320 0 5320 0 0 1915 0 1915 -5320 0 -5320 0
0 -1915z"/>
<path onClick={() => fetchModelData('G1-16')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-16') ? 'fill-primary opacity-50' : ''}`} d="M13430 41275 l0 -1935 5325 0 5325 0 0 1935 0 1935 -5325 0 -5325 0
0 -1935z"/>
<path onClick={() => fetchModelData('G1-09')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-09') ? 'fill-primary opacity-50' : ''}`} d="M45520 41275 l0 -1935 5320 0 5320 0 0 1935 0 1935 -5320 0 -5320 0
0 -1935z"/>
<path onClick={() => fetchModelData('G1-15')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-15') ? 'fill-primary opacity-50' : ''}`} d="M13432 37393 l3 -1778 5320 0 5320 0 0 1775 0 1775 -5323 3 -5322 2
2 -1777z"/>
<path onClick={() => fetchModelData('G1-10')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-10') ? 'fill-primary opacity-50' : ''}`} d="M45520 37390 l0 -1780 5320 0 5320 0 0 1780 0 1780 -5320 0 -5320 0
0 -1780z"/>
<path onClick={() => fetchModelData('G1-13')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-13') ? 'fill-primary opacity-50' : ''}`} d="M22450 27780 l0 -7640 3008 2 3007 3 0 7635 0 7635 -3007 3 -3008 2
0 -7640z"/>
<path onClick={() => fetchModelData('G1-12')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-12') ? 'fill-primary opacity-50' : ''}`} d="M41130 27780 l0 -7640 3008 2 3007 3 3 7638 2 7637 -3010 0 -3010 0
0 -7640z"/>
<path onClick={() => fetchModelData('G1-14')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-14') ? 'fill-primary opacity-50' : ''}`} d="M13422 24553 l3 -4408 4395 0 4395 0 3 4408 2 4407 -4400 0 -4400 0
2 -4407z"/>
<path onClick={() => fetchModelData('G1-11')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-11') ? 'fill-primary opacity-50' : ''}`} d="M47380 24550 l0 -4410 4395 0 4395 0 0 4410 0 4410 -4395 0 -4395 0
0 -4410z"/>
</g>
</svg>

    //      <svg version="1.0" 
    //     className='w-full  h-fit z-[4]'
    //     xmlns="http://www.w3.org/2000/svg"
    //     width="7016.000000pt" height="9922.000000pt"
    //     viewBox="0 0 7016.000000 9922.000000"
    //     preserveAspectRatio="xMidYMid meet">
       
    //    <g transform="translate(0.000000,9922.000000) scale(0.100000,-0.100000)"
    //    fill="transparent" stroke="none">
    //    <path onClick={() => fetchModelData('G1-24')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-24') ? 'fill-primary opacity-50' : ''}`} d="M13460 73865 l0 -3475 5275 0 5275 0 0 3314 c0 1925 -4 3317 -9 3320
    //    -5 3 -2317 73 -5137 155 -2821 82 -5191 152 -5266 156 l-138 6 0 -3476z"/>
    //    <path onClick={() => fetchModelData('G1-02')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-02') ? 'fill-primary opacity-50' : ''}`} d="M45536 76102 c-3 -3 -6 -2142 -6 -4754 l0 -4748 2495 0 2495 0 0
    //    4649 0 4649 -112 6 c-62 4 -1148 49 -2413 101 -1265 52 -2335 96 -2377 98 -42
    //    3 -79 2 -82 -1z"/>
    //    <path onClick={() => fetchModelData('G1-01')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-01') ? 'fill-primary opacity-50' : ''}`} d="M50730 71245 l0 -4645 2685 0 2685 0 0 4535 c0 2494 -4 4535 -8 4535
    //    -5 0 -1203 49 -2663 110 -1460 60 -2664 110 -2676 110 l-23 0 0 -4645z"/>
    //    <path onClick={() => fetchModelData('G1-23')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-23') ? 'fill-primary opacity-50' : ''}`} d="M16402 67943 l3 -2038 3800 0 3800 0 3 2038 2 2037 -3805 0 -3805 0
    //    2 -2037z"/>
    //    <path onClick={() => fetchModelData('G1-03')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-03') ? 'fill-primary opacity-50' : ''}`} d="M45520 64645 l0 -1685 5295 0 5295 0 0 1685 0 1685 -5295 0 -5295 0
    //    0 -1685z"/>
    //    <path onClick={() => fetchModelData('G1-22')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-22') ? 'fill-primary opacity-50' : ''}`} d="M16850 64770 l0 -900 -1705 0 -1705 0 0 -820 0 -820 5305 0 5305 0 0
    //    1720 0 1720 -3600 0 -3600 0 0 -900z"/>
    //    <path onClick={() => fetchModelData('G1-04')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-04') ? 'fill-primary opacity-50' : ''}`} d="M45520 60590 l0 -2090 3795 0 3795 0 0 2090 0 2090 -3795 0 -3795 0
    //    0 -2090z"/>
    //    <path onClick={() => fetchModelData('G1-21')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-21') ? 'fill-primary opacity-50' : ''}`} d="M13440 60240 l0 -1680 5285 0 5285 0 0 1680 0 1680 -5285 0 -5285 0
    //    0 -1680z"/>
    //    <path onClick={() => fetchModelData('G1-20')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-20') ? 'fill-primary opacity-50' : ''}`} d="M13440 56570 l0 -1780 5285 0 5285 0 -2 1778 -3 1777 -5282 3 -5283
    //    2 0 -1780z"/>
    //    <path onClick={() => fetchModelData('G1-05')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-05') ? 'fill-primary opacity-50' : ''}`} d="M45520 56530 l0 -1710 5283 2 5282 3 3 828 2 827 -1490 0 -1490 0 0
    //    880 0 880 -3795 0 -3795 0 0 -1710z"/>
    //    <path onClick={() => fetchModelData('G1-19')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-19') ? 'fill-primary opacity-50' : ''}`} d="M13440 52815 l0 -1715 5283 2 5282 3 0 1710 0 1710 -5282 3 -5283 2
    //    0 -1715z"/>
    //    <path onClick={() => fetchModelData('G1-06')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-06') ? 'fill-primary opacity-50' : ''}`} d="M45520 52815 l0 -1715 5283 2 5282 3 3 1713 2 1712 -5285 0 -5285 0
    //    0 -1715z"/>
    //    <path onClick={() => fetchModelData('G1-18')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-18') ? 'fill-primary opacity-50' : ''}`} d="M13440 49135 l0 -1655 5283 2 5282 3 0 1650 0 1650 -5282 3 -5283 2
    //    0 -1655z"/>
    //    <path onClick={() => fetchModelData('G1-07')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-07') ? 'fill-primary opacity-50' : ''}`} d="M45520 49135 l0 -1655 5285 0 5285 0 0 1655 0 1655 -5285 0 -5285 0
    //    0 -1655z"/>
    //    <path onClick={() => fetchModelData('G1-17')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-17') ? 'fill-primary opacity-50' : ''}`} d="M13440 45325 l0 -1845 5283 2 5282 3 3 1843 2 1842 -5285 0 -5285 0
    //    0 -1845z"/>
    //    <path onClick={() => fetchModelData('G1-08')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-08') ? 'fill-primary opacity-50' : ''}`} d="M45520 45325 l0 -1845 5283 2 5282 3 3 1843 2 1842 -5285 0 -5285 0
    //    0 -1845z"/>
    //    <path onClick={() => fetchModelData('G1-16')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-16') ? 'fill-primary opacity-50' : ''}`} d="M13440 41295 l0 -1875 5285 0 5285 0 -2 1873 -3 1872 -5282 3 -5283
    //    2 0 -1875z"/>
    //    <path onClick={() => fetchModelData('G1-09')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-09') ? 'fill-primary opacity-50' : ''}`} d="M45520 41295 l0 -1875 5285 0 5285 0 0 1875 0 1875 -5285 0 -5285 0
    //    0 -1875z"/>
    //    <path onClick={() => fetchModelData('G1-15')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-15') ? 'fill-primary opacity-50' : ''}`} d="M13440 37380 l0 -1770 5283 2 5282 3 0 1765 0 1765 -5282 3 -5283 2
    //    0 -1770z"/>
    //    <path onClick={() => fetchModelData('G1-10')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-10') ? 'fill-primary opacity-50' : ''}`} d="M45520 37380 l0 -1770 5283 2 5282 3 0 1765 0 1765 -5282 3 -5283 2
    //    0 -1770z"/>
    //    <path onClick={() => fetchModelData('G1-13')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-13') ? 'fill-primary opacity-50' : ''}`} d="M22502 27808 l3 -7613 2953 -3 2952 -2 0 7615 0 7615 -2955 0 -2955
    //    0 2 -7612z"/>
    //    <path onClick={() => fetchModelData('G1-12')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-12') ? 'fill-primary opacity-50' : ''}`} d="M41200 27805 l0 -7615 2953 2 2952 3 3 7613 2 7612 -2955 0 -2955 0
    //    0 -7615z"/>
    //    <path onClick={() => fetchModelData('G1-14')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-14') ? 'fill-primary opacity-50' : ''}`} d="M13532 24568 l3 -4373 4345 0 4345 0 3 4373 2 4372 -4350 0 -4350 0
    //    2 -4372z"/>
    //    <path onClick={() => fetchModelData('G1-11')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G1-11') ? 'fill-primary opacity-50' : ''}`} d="M47382 24568 l3 -4373 4345 0 4345 0 3 4373 2 4372 -4350 0 -4350 0
    //    2 -4372z"/>
    //    </g>
    //    </svg>  
    };

    const LowerGround: FloorData = {
        name: formatMessage({id: 'floor.lowerGround'}),
        units: 24,
        models: 10,
        bathrooms: 0,
        floors: [0, 1],
        usage: formatMessage({id: 'floor.commercial'}),
        imageSrc: '/LOWER-FLOOR.webp',
        areas: LowerGroundAreas,
        unitCriteria: LowerGroundUnitCriteria,
        svgImage: <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="7016.000000pt" className="w-full h-fit z-[4]" height="9935.000000pt" viewBox="0 0 7016.000000 9935.000000"
        preserveAspectRatio="xMidYMid meet">
       
       <g transform="translate(0.000000,9935.000000) scale(0.100000,-0.100000)"
       fill="transparent" stroke="none">
       <path onClick={() => fetchModelData('G0-16')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G0-16') ? 'fill-primary opacity-50' : ''}`} d="M11990 73980 l0 -7080 565 0 565 0 0 1690 0 1690 2820 0 2820 0 0
       5264 0 5264 -112 6 c-163 9 -6510 246 -6590 246 l-68 0 0 -7080z"/>
       <path onClick={() => fetchModelData('G0-15')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G0-15') ? 'fill-primary opacity-50' : ''}`} d="M18957 75446 l6 -5326 -1186 0 -1187 0 0 -2045 0 -2045 5170 0 5170
       0 0 7230 c0 3977 -1 7230 -3 7230 -35 0 -7752 271 -7844 275 l-133 7 7 -5326z"/>
       <path onClick={() => fetchModelData('G0-02')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G0-02') ? 'fill-primary opacity-50' : ''}`} d="M42320 74490 l0 -5250 4040 0 4040 0 0 5080 0 5080 -22 0 c-13 0
       -1808 77 -3990 170 -2182 94 -3990 170 -4018 170 l-50 0 0 -5250z"/>
       <path onClick={() => fetchModelData('G0-01')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G0-01') ? 'fill-primary opacity-50' : ''}`} d="M50600 71181 l0 -8221 3353 2 3352 3 3 8092 2 8091 -82 6 c-46 3
       -1512 58 -3258 121 -1746 63 -3219 117 -3272 121 l-98 6 0 -8221z"/>
       <path onClick={() => fetchModelData('G0-03')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G0-03') ? 'fill-primary opacity-50' : ''}`} d="M42330 63842 l0 -5197 4543 2 c2498 2 4863 6 5255 9 l712 6 -2 2032
       -3 2031 -1217 3 -1218 2 0 3155 0 3155 -4035 0 -4035 0 0 -5198z"/>
       <path onClick={() => fetchModelData('G0-14')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G0-14') ? 'fill-primary opacity-50' : ''}`} d="M11990 65305 l0 -1465 -2235 0 -2235 0 2 -4522 3 -4523 9788 -3 9787
       -2 0 4530 0 4531 -6990 -3 -6990 -3 0 1463 0 1462 -565 0 -565 0 0 -1465z"/>
       <path onClick={() => fetchModelData('G0-04')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G0-04') ? 'fill-primary opacity-50' : ''}`} d="M42240 52085 l0 -4475 6739 0 c4483 0 6742 3 6746 10 8 13 195 13
       195 0 0 -7 984 -9 2948 -8 l2947 3 0 4470 0 4470 -9787 3 -9788 2 0 -4475z"/>
       <path onClick={() => fetchModelData('G0-13')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G0-13') ? 'fill-primary opacity-50' : ''}`} d="M7525 54598 c-3 -7 -4 -1581 -3 -3498 l3 -3485 9788 -3 9787 -2 0
       3500 0 3500 -9785 0 c-7819 0 -9787 -3 -9790 -12z"/>
       <path onClick={() => fetchModelData('G0-12')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G0-12') ? 'fill-primary opacity-50' : ''}`} d="M7525 47417 c-3 -6 -4 -1396 -3 -3087 l3 -3075 9060 -3 9060 -2 702
       702 703 703 0 2387 0 2388 -9760 0 c-7753 0 -9762 -3 -9765 -13z"/>
       <path onClick={() => fetchModelData('G0-05')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G0-05') ? 'fill-primary opacity-50' : ''}`} d="M42290 45042 l0 -2387 703 -703 702 -702 9060 2 9060 3 0 3085 0
       3085 -9762 3 -9763 2 0 -2388z"/>
       <path onClick={() => fetchModelData('G0-11')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G0-11') ? 'fill-primary opacity-50' : ''}`} d="M7525 41097 c-3 -6 -4 -1272 -3 -2812 l3 -2800 8278 -2 8277 -3 0
       2815 0 2815 -8275 0 c-6570 0 -8277 -3 -8280 -13z"/>
       <path onClick={() => fetchModelData('G0-06')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G0-06') ? 'fill-primary opacity-50' : ''}`} d="M45260 38295 l0 -2815 8278 3 8277 2 3 2813 2 2812 -8280 0 -8280 0
       0 -2815z"/>
       <path onClick={() => fetchModelData('G0-09')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G0-09') ? 'fill-primary opacity-50' : ''}`} d="M29537 39592 l-1367 -1367 0 -5328 0 -5327 3203 2 3202 3 3 6693 2
       6692 -1838 0 -1837 0 -1368 -1368z"/>
       <path onClick={() => fetchModelData('G0-08')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G0-08') ? 'fill-primary opacity-50' : ''}`} d="M34730 34265 l0 -6695 3203 2 3202 3 3 5320 2 5320 -1372 1372 -1373
       1373 -1832 0 -1833 0 0 -6695z"/>
       <path onClick={() => fetchModelData('G0-10')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G0-10') ? 'fill-primary opacity-50' : ''}`} d="M7527 35323 c-4 -3 -7 -4958 -7 -11010 l0 -11003 2940 0 c2737 0
       2940 -1 2940 -17 0 -9 3 -14 6 -11 3 3 5 181 4 395 0 213 2 929 6 1589 l7
       1201 6251 7 c3438 3 6801 9 7474 12 l1222 7 0 1838 0 1839 3095 0 3095 0 0
       3590 0 3590 -3285 0 -3285 0 0 1150 0 1150 -6190 0 -6190 0 0 2840 0 2840
       -4038 0 c-2221 0 -4042 -3 -4045 -7z"/>
       <path onClick={() => fetchModelData('G0-07')} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('G0-07') ? 'fill-primary opacity-50' : ''}`} d="M53780 32410 l0 -2760 -6215 0 -6215 0 0 -1150 0 -1150 -3310 0
       -3310 0 0 -3590 0 -3590 3120 0 3120 0 0 -1839 0 -1838 1223 -7 c672 -3 4036
       -9 7475 -12 l6252 -7 0 -456 c0 -741 12 -2726 16 -2730 2 -2 4 3 4 12 0 16
       203 17 2940 17 l2940 0 0 10930 0 10930 -4020 0 -4020 0 0 -2760z"/>
       </g>
       </svg>       
    };

    const FirstFloor: FloorData = {
        name: formatMessage({id: 'floor.first'}),
        units: 24,
        models: 10,
        bathrooms: 0,
        floors: [0, 1],
        usage: formatMessage({id: 'floor.commercial'}),
        imageSrc: '/1ST-FLOOR.webp',
        areas: FirstFloorAreas,
        unitCriteria: FirstFloorUnitCriteria,
        svgImage: <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="7016.000000pt" height="9934.000000pt" className="w-full h-fit z-[4]" viewBox="0 0 7016.000000 9934.000000"
        preserveAspectRatio="xMidYMid meet">
       
       <g transform="translate(0.000000,9934.000000) scale(0.100000,-0.100000)"
       fill="transparent" stroke="none">
       <path onClick={() => {fetchModelData('F1-20')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-20') ? 'fill-primary opacity-50' : ''}`} d="M13420 74625 l0 -4285 1604 0 1603 0 7 -612 c3 -337 8 -1153 11
       -1813 3 -660 8 -1440 11 -1732 l6 -533 879 0 879 0 0 2044 0 2043 3233 7
       c1777 3 3838 9 4580 12 l1347 7 0 4268 0 4269 -22 4 c-23 4 -14043 607 -14105
       606 l-33 0 0 -4285z"/>
       <path onClick={() => {fetchModelData('F1-01')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-01') ? 'fill-primary opacity-50' : ''}`} d="M45135 76512 c-3 -3 -5 -1037 -5 -2299 l0 -2293 -1575 0 -1575 0 2
-4752 3 -4753 3175 -7 c1746 -4 3806 -11 4578 -14 l1402 -6 0 -2044 0 -2044
879 0 878 0 7 613 c3 336 8 1150 11 1807 3 657 8 1435 11 1728 l6 532 1604 0
1604 0 3 3733 c2 3911 -3 9389 -9 9396 -2 2 -2426 93 -5387 202 -2960 108
-5432 199 -5494 202 -62 2 -115 2 -118 -1z"/>

       <path onClick={() => {fetchModelData('F1-19')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-19') ? 'fill-primary opacity-50' : ''}`} d="M18540 65905 l0 -3675 3805 0 3805 0 0 3675 0 3675 -3805 0 -3805 0
       0 -3675z"/>
       <path onClick={() => {fetchModelData('F1-02')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-02') ? 'fill-primary opacity-50' : ''}`} d="M43367 62223 c-4 -3 -7 -1664 -7 -3690 l0 -3683 3785 0 3785 0 0
       3690 0 3690 -3778 0 c-2078 0 -3782 -3 -3785 -7z"/>
       <path onClick={() => {fetchModelData('F1-18')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-18') ? 'fill-primary opacity-50' : ''}`} d="M15847 62013 c-4 -3 -7 -784 -7 -1735 l0 -1728 5160 0 5160 0 0 1735
       0 1735 -5153 0 c-2835 0 -5157 -3 -5160 -7z"/>
       <path onClick={() => {fetchModelData('F1-17')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-17') ? 'fill-primary opacity-50' : ''}`} d="M15842 56608 l3 -1753 5163 -3 5162 -2 0 1755 0 1755 -5165 0 -5165
       0 2 -1752z"/>
       <path onClick={() => {fetchModelData('F1-16')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-16') ? 'fill-primary opacity-50' : ''}`} d="M15847 54663 c-4 -3 -7 -793 -7 -1755 l0 -1748 5165 0 5165 0 -2
       1753 -3 1752 -5156 3 c-2836 1 -5159 -1 -5162 -5z"/>
       <path onClick={() => {fetchModelData('F1-03')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-03') ? 'fill-primary opacity-50' : ''}`} d="M43365 54658 c-3 -7 -4 -796 -3 -1753 l3 -1740 5175 0 5175 0 0 1750
       0 1750 -5173 3 c-4133 2 -5174 0 -5177 -10z"/>
       <path onClick={() => {fetchModelData('F1-15')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-15') ? 'fill-primary opacity-50' : ''}`} d="M15840 49260 l0 -1770 5160 0 5160 0 0 1770 0 1770 -5160 0 -5160 0
       0 -1770z"/>
       <path onClick={() => {fetchModelData('F1-04')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-04') ? 'fill-primary opacity-50' : ''}`} d="M43367 51013 c-4 -3 -7 -798 -7 -1765 l0 -1758 5185 0 5185 0 -2
       1763 -3 1762 -5176 3 c-2847 1 -5179 -1 -5182 -5z"/>
       <path onClick={() => {fetchModelData('F1-14')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-14') ? 'fill-primary opacity-50' : ''}`} d="M15845 47298 c-3 -7 -4 -794 -3 -1748 l3 -1735 5163 -3 5162 -2 0
       1750 0 1750 -5160 0 c-4119 0 -5162 -3 -5165 -12z"/>
       <path onClick={() => {fetchModelData('F1-05')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-05') ? 'fill-primary opacity-50' : ''}`} d="M43367 47293 c-4 -3 -7 -791 -7 -1750 l0 -1743 5180 0 5180 0 0 1750
       0 1750 -5173 0 c-2846 0 -5177 -3 -5180 -7z"/>
       <path onClick={() => {fetchModelData('F1-06')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-06') ? 'fill-primary opacity-50' : ''}`} d="M43362 41393 l3 -2248 5185 0 5185 0 3 2248 2 2247 -5190 0 -5190 0
       2 -2247z"/>
       <path onClick={() => {fetchModelData('F1-13')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-13') ? 'fill-primary opacity-50' : ''}`} d="M15840 41331 c0 -1516 3 -2292 10 -2296 6 -4 10 22 10 69 l0 76 5155
       0 5155 0 0 2220 0 2220 -5165 0 -5165 0 0 -2289z"/>
       <path onClick={() => {fetchModelData('F1-12')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-12') ? 'fill-primary opacity-50' : ''}`} d="M22400 35920 l0 -3050 1885 0 1885 0 0 3050 0 3050 -1885 0 -1885 0
       0 -3050z"/>
       <path onClick={() => {fetchModelData('F1-07')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-07') ? 'fill-primary opacity-50' : ''}`} d="M43367 38963 c-4 -3 -7 -1376 -7 -3050 l0 -3043 1885 0 1885 0 0
       3050 0 3050 -1878 0 c-1033 0 -1882 -3 -1885 -7z"/>
       <path onClick={() => {fetchModelData('F1-11')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-11') ? 'fill-primary opacity-50' : ''}`} d="M13380 23995 l0 -5005 3680 0 3680 0 0 5005 0 5005 -3680 0 -3680 0
       0 -5005z"/>
       <path onClick={() => {fetchModelData('F1-10')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-10') ? 'fill-primary opacity-50' : ''}`} d="M20927 28993 c-4 -3 -7 -2256 -7 -5005 l0 -4998 3770 0 3770 0 0
       5005 0 5005 -3763 0 c-2070 0 -3767 -3 -3770 -7z"/>
       <path onClick={() => {fetchModelData('F1-09')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-09') ? 'fill-primary opacity-50' : ''}`} d="M41060 23995 l0 -5005 3775 0 3775 0 0 5005 0 5005 -3775 0 -3775 0
       0 -5005z"/>
       <path onClick={() => {fetchModelData('F1-08')}} className={`hover:fill-primary hover:opacity-50 cursor-pointer ${matchesCriteria('F1-08') ? 'fill-primary opacity-50' : ''}`} d="M48790 23995 l0 -5005 3670 0 3670 0 0 5005 0 5005 -3670 0 -3670 0
       0 -5005z"/>
       </g>
       </svg>
         
    };

    const [selectedFloor, setSelectedFloor] = useState<FloorData>(LowerGround)

    const [FloorActiveStep, setFloorActiveStep] = useState(0);

    const handleNext = () => {
      setFloorActiveStep((prevActiveStep) => prevActiveStep + 1);
      FloorActiveStep === 1? setSelectedFloor(FirstFloor) : setSelectedFloor(UpperGround)

    };
  
    const handleBack = () => {
      setFloorActiveStep((prevActiveStep) => prevActiveStep - 1);
      FloorActiveStep === 1? setSelectedFloor(LowerGround) : setSelectedFloor(UpperGround)
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
        <main dir={isRTL? 'rtl' : 'ltr'} className={"min-h-screen bg-secondary flex flex-col items-center text-white  overflow-hidden"}>
            <div className="min-h-[80vh] border-b-4 border-white w-screen relative bg-cover bg-center flex items-center justify-center"
                style={{backgroundImage: type === 'image'? `url("${AboutObject?.image}")`: 'transparent'}}
            >
                {type === 'video' && AboutObject?.image && (
                    <video autoPlay muted loop className="min-h-[78vh] max-h-[78vh] w-screen absolute inset-0 object-cover">
                        <source src={AboutObject?.image} type="video/mp4" />
                    </video>
                )}
                <div className={`absolute inset-0 bg-secondary opacity-50`}></div>

                <div className={`flex flex-col items-center ${isRTL? 'space-y-4' : ''} justify-center z-[3]`}>
                    <Typography textAlign={'center'} variant="h1" className="text-white text-5xl md:text-7xl">
                        <FormattedMessage id="floor.commercial"/>
                    </Typography>

                    <Breadcrumbs className="text-gray-300" aria-label="breadcrumb">
                        <Link href="/" className="hover:text-white">
                            <FormattedMessage id="navbar.home"/>
                        </Link>
                        <Typography color=""><FormattedMessage id="floor.commercial"/></Typography>
                    </Breadcrumbs>
                </div>
            </div>

            
 

            <div className="bg-secondary w-full px-2 md:px-20 space-y-8 py-20 grid place-items-center lg:py-32">
                <div id="info" className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-8 flex flex-col justify-center">
                        <Typography fontSize={40} variant="h2">
                            <FormattedMessage id="floor.commercial" />
                        </Typography>
                        <Typography>
                            {isRTL? Description.ar : Description.en}
                        </Typography>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-8">

                            <div>
                                <Typography textAlign={'center'} variant="h3" className="[text-shadow:_0px_5px_0px_rgb(0_0_0_/_40%)]">
                                    {CommercialDetails.units.toLocaleString(isRTL? 'ar-EG' : 'en-GB')}&nbsp;
                                </Typography>
                                <Typography textAlign={'center'} variant="h6" >
                                    <FormattedMessage id="floor.units" />
                                </Typography>
                            </div>

                            
                            <div>
                                <Typography textAlign={'center'} variant="h3" className="[text-shadow:_0px_5px_0px_rgb(0_0_0_/_40%)]">
                                    {CommercialDetails.outdoor.toLocaleString(isRTL? 'ar-EG' : 'en-GB')}&nbsp;
                                </Typography>
                                <Typography textAlign={'center'} variant="h6" >
                                    <FormattedMessage id="floor.outdoor" />
                                </Typography>
                            </div>

                            
                            <div>
                                <Typography textAlign={'center'} variant="h3" className="[text-shadow:_0px_5px_0px_rgb(0_0_0_/_40%)]">
                                    {CommercialDetails.storages.toLocaleString(isRTL? 'ar-EG' : 'en-GB')}&nbsp;
                                </Typography>
                                <Typography textAlign={'center'} variant="h6" >
                                    <FormattedMessage id="floor.storage" />
                                </Typography>
                            </div>


                            <div>
                                <Typography textAlign={'center'} variant="h3" className="[text-shadow:_0px_5px_0px_rgb(0_0_0_/_40%)]">
                                    {CommercialDetails.superMarkets.toLocaleString(isRTL? 'ar-EG' : 'en-GB')}&nbsp;
                                </Typography>
                                <Typography textAlign={'center'} variant="h6" >
                                    <FormattedMessage id="floor.superMarket" />
                                </Typography>
                            </div>

                            
                            <div>
                                <Typography textAlign={'center'} variant="h3" className="[text-shadow:_0px_5px_0px_rgb(0_0_0_/_40%)]">
                                    {CommercialDetails.pharmacy.toLocaleString(isRTL? 'ar-EG' : 'en-GB')}&nbsp;
                                </Typography>
                                <Typography textAlign={'center'} variant="h6" >
                                    <FormattedMessage id="floor.pharmacy" />
                                </Typography>
                            </div>

                            <div>
                                <Typography textAlign={'center'} variant="h3" className="[text-shadow:_0px_5px_0px_rgb(0_0_0_/_40%)]">
                                {CommercialDetails.floors[0].toLocaleString(isRTL? 'ar-EG': 'en-GB')} {' , '} {CommercialDetails.floors[1].toLocaleString(isRTL? 'ar-EG': 'en-GB')} {' , '} {CommercialDetails.floors[2].toLocaleString(isRTL? 'ar-EG' : 'en-GB')}&nbsp;
                                </Typography>
                                <Typography textAlign={'center'} variant="h6" >
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
                    <div className="order-first md:order-last h-full">
                        <Image src={'/Comm Cover.jpg'} alt="Commercial" width={600} height={600} className="w-full h-full rounded-xl"/>
                    </div>
                </div>

                <Shots />

                <div id="plan" className="flex flex-col items-center justify-center space-y-4 py-8 ">
                    <Typography textAlign={'center'} variant="h2" className="relative md:top-16 lg:top-0  min-[1770px]:top-[8rem] mb-4">
                        <FormattedMessage id="project.plan" />
                    </Typography>
                    <MobileStepper
                        variant="text"
                        steps={3}
                        position="static"
                        activeStep={FloorActiveStep}
                        className="lg:hidden w-full bg-secondary text-white relative md:top-20"
                        nextButton={
                            <Button
                                size="small"
                                onClick={handleNext}
                                disabled={FloorActiveStep === 2}
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
                                    steps={3}
                                    position="static"
                                    activeStep={FloorActiveStep}
        
                                    nextButton={
                                        <Button
                                            size="small"
                                            onClick={handleNext}
                                            disabled={FloorActiveStep === 2}
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
                                    {selectedFloor?.areas?.map((item) =>(
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

                        <div className="lg:relative col-span-4 lg:col-span-3 flex justify-center items-center lg:w-10/12">
                            <div className="lg:absolute md:rotate-90 rounded-xl  max-w-[1200px] min-[1550px]:w-10/12 min-[2000px]:w-8/12"
                                style={{ backgroundImage: `url('${selectedFloor.imageSrc}')`, backgroundSize: 'cover', transition: 'background-image 1s ease',}}
                            >   
                                {FloorActiveStep === 0? LowerGround.svgImage : FloorActiveStep === 1? UpperGround.svgImage : FirstFloor.svgImage}
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
                        className="w-full h-96 rounded-xl"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="eager"
                        referrerPolicy="no-referrer-when-downgrade"
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
 
export default Commercial;

const Description = {
    ar: "تقع المنطقة التجارية في الطابقين الأرضي والأول وتضم مجموعة واسعة من المطاعم ومساحات البيع بالتجزئة بما في ذلك هايبر ماركت ومجهزة ببوابات دخول ومصاعد متعددة.",
    en: "The commercial area is located on the ground and first floors and includes a wide range of restaurants and retail spaces including a hypermarket and equipped with multiple entry gates and elevators.",
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