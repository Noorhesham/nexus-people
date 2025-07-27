import Partners from '@/components/home/Partners';
import Header from '@/components/home/Header';
import SideNavigation from '@/components/sideNavigation';
import Services from '@/components/home/Services';
import SmartSystem from '@/components/home/SmartSystem';
import ProjectInfo from '@/components/home/projectInfo';
import ProjectFacilities from '@/components/home/projectFacilities';

export default function Home() {
  
  return (
    <main className={`min-h-screen w-screen bg-white relative items-center justify-center bg-fixed bg-center bg-cover`}>

        <div>
          <SideNavigation />
          <Header />
          <ProjectInfo />
          <ProjectFacilities />
          {/* <Project /> */}
          <SmartSystem />
          <Services />
          <Partners />
        </div>

    </main>
  )
}
