import { LanguageDirectionContext } from "@/helpers/langDirection";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import CrudComponent from "@/helpers/CRUD";

interface Brand {
    _id: string
    images: [{
        _id: string,
        image: string;
        alt: {
            ar: string;
            en: string;
        };
    }]
}

const Partners = () => {
    const { isRTL } = useContext(LanguageDirectionContext);
    const [AllBrands, setAllBrands] = useState<Brand[]>([{
        _id: '',
        images: [{
            _id: '',
            image: '',
            alt: {ar: '', en: ''}
        }]
    }]);
    const apiEndpoint = `${process.env.BACKEND}brands`;

    const {
        data,
        fetchData,
    } = CrudComponent({});
  
    useEffect(() => {
        fetchData(apiEndpoint, "Brands")
    }, [apiEndpoint]);

    useEffect(() => {
        setAllBrands(data as Brand[]);
    },  [data])

    
    return (  
        <main id="brands" className="bg-secondary">
            <div className="w-full bg-secondary inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
                <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">      
                    {AllBrands[0]?.images?.map((brand) => (
                        <li key={brand._id} className="flex-none">
                            <Image src={brand.image} alt={isRTL? brand.alt.ar : brand.alt.en} width={300} height={300} />
                        </li>
                    ))}
                </ul>
                <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
                    {AllBrands[0]?.images?.map((brand) => (
                        <li key={brand._id} className="flex-none">
                            <Image src={brand.image} alt={isRTL? brand.alt.ar : brand.alt.en} width={300} height={300} />
                        </li>
                    ))}
                </ul>
                <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
                    {AllBrands[0]?.images?.map((brand) => (
                        <li key={brand._id} className="flex-none">
                            <Image src={brand.image} alt={isRTL? brand.alt.ar : brand.alt.en} width={300} height={300} />
                        </li>
                    ))}
                </ul>
            </div>
        </main>

    );
}
 
export default Partners;