import CanvasAnimation from "../components/home/canva-animation"
import MouseAnimation from "../components/home/mouse"
import RayAnimation from "../components/home/ray"
import SpiralAnimation from "../components/home/spiral"
import { Button } from "../components/ui/button"

const Home = () => {

    return (
        <>
            <main className="">
                <div className="app-container w-full mt-56 mb-40">
                    <div className="flex justify-end ">
                        <div className="w-3/5">
                            <div className="font-poppins font-bold relative md:text-[46px] mini:text-[56px]">
                                <p className="text-[#7E8082]">Where Talent</p>
                                <p className="">Meet Opportunity</p>
                                <img className="absolute right-0 top-1/2 -translate-y-1/2" src="/images/home/UX.svg"/>
                            </div>

                            <div className="max-w-lg mt-12 relative ">
                                <span className="text-[#545756] font-circular font-medium">Connecting top talent with groundbreaking projects across Web2 and Web3. <span className="text-[#18181B]">Hire smarter. Work better. Stay in control.</span></span>
                                <img className="absolute right-0" src="/images/home/dev.svg"/>
                            </div>

                            <div className="mt-8 ">
                                <img className="max-w-xs" src="/images/home/hero-users.svg"/>
                            </div>
                        </div>

                        <div className="w-2/5 flex justify-end relative">
                            <img className="absolute left-1/4 -top-14" src="/images/home/BS.svg"/>
                            <div className="relative">
                                <img className="absolute top-1/2 -left-20" src="/images/home/ui.svg"/>
                                <img src="/images/home/hero.svg"/>
                            </div>
                        </div>
                    </div>

                    {/* About */}
                    <div className="mt-44">
                        <div className="bg-white flex rounded-2xl inset-1 border border-[#E4E4E7] p-8">
                            <div className="w-1/2 font-circular max-w-xl text-[18px] font-normal">
                                <h1 className="text-[#7E8082] font-poppins font-semibold text-[32px] mt-2">About <span className="text-[#18181B]">Work</span></h1>

                                <p className="text-[#545756] my-5">Work streamlines the freelance hiring process, providing businesses with instant access to a network of skilled professionals. Our platform enables seamless collaborations, efficient project management, and exceptional results</p>

                                <span className="text-[#545756]"><span className="text-[#18181B]">Our Mission</span> is to empower businesses to achieve their goals by providing a seamless and efficient platform for connecting with top freelance talent.</span>
                                <div className="mt-1"/>
                                <span className="text-[#545756]"><span className="text-[#18181B]">Our Vision</span> To revolutionize the way businesses work with freelancers, making it easier, faster and more effective</span>
                            </div>

                            <div className="w-1/2 flex justify-end">
                                <img className="" src="/images/home/about-work.png"/>
                            </div>
                        </div>
                    </div>

                    {/* Popular services */}
                    <div className="mt-44">
                        <h1 className="font-poppins font-semibold text-[40px]">Popular Service</h1>

                        <p className="mt-2 text-[#7E8082] text-[18px] font-circular mini:max-w-4xl">Freelancing offers a wide range of in-demand services from web development and design 
                        to content creation, marketing, and beyond. Whatever your project needs, we’ve got the talent to make it happen.</p>
                        
                        <div className="flex gap-x-14 service-gradient rounded-3xl overflow-hidden mt-16">
                            <img className="w-2/5" src="/images/home/p-service1.png"/>
                            <img className="w-3/5 rounded-tr-2xl" src="/images/home/p-service2.svg"/>
                        </div>
                    </div>

                    {/* How it works */}
                    <div className="">
                        <div className="flex items-center flex-col mt-44">
                            <h1 className="font-poppins font-bold text-[48px]">How it Works</h1>
                            <p className="text-[#7E8082] text-[20px] font-medium font-circular">Easy to use. Easy to apply</p>
                        </div>

                        <div className="grid grid-cols-3 gap-x-8 mt-16">
                            <img className="" src="/images/home/work1.svg"/>
                            <img className="" src="/images/home/work2.svg"/>
                            <img className="" src="/images/home/work3.svg"/>
                        </div>
                    </div>

                    {/* Ready to get started */}
                    <div className="mt-44">
                        <div className="bg-primary p-10 rounded-2xl relative ">
                            <CanvasAnimation className=""/>
                            <SpiralAnimation className="absolute right-[18%] bottom-[15%]"/>
                            <MouseAnimation className="absolute left-[12%] -bottom-[5%]"/>
                            <RayAnimation className="absolute left-[17%] top-[20%]"/>

                            <div className="absolute left-1/2  -translate-x-1/2 top-1/2 -translate-y-1/2">
                                <div className="relative flex flex-col items-center">
                                    <p className="font-poppins text-white font-semibold text-[40px]">Ready to Get started?</p>
                                    <p className="font-circular text-[18px] text-white font-normal mt-2">Join our community of top freelancers and clients today</p>

                                    <div className="font-medium font-circular mt-8 flex  gap-x-7">
                                        <Button className="bg-transparent border border-white rounded-md text-white px-8">Post a Project</Button>
                                        <Button className="bg-transparent bg-white hover:bg-white/80 rounded-md text-primary">Become a Freelancer</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Home