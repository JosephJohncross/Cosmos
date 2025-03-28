import LocationIcon from "../icons/freelance/location-icon"

export type PostJobCardComponentProps = {
    data: {
        timePosted: string,
        role: string,
        hourlyPay: string,
        duration: string,
        detail: string,
        skills: string[]
        verified: boolean,
        funding: string,
        applicants: string,
        location: string,
    }
    editJob: React.MutableRefObject<HTMLDivElement>
}

export type PostJobCardComponentType = {
        timePosted: string,
        role: string,
        hourlyPay: string,
        duration: string,
        detail: string,
        skills: string[]
        verified: boolean,
        funding: string,
        applicants: string,
        location: string,
}

const PostJobCardComponent = ({
   data: { applicants,
    detail,
    duration,
    funding,
    hourlyPay,
    location,
    role,
    skills,
    timePosted,
    verified},
    editJob
}: PostJobCardComponentProps) => {
    return (
        <>
            <div onClick={() => {editJob.current.click()}} className="pt-5 font-circular first:pt-0">
                <div className="flex justify-between">
                    <div className="">
                        <p className="text-[#7E8082]  text-sm">Posted {timePosted}</p>
                        <p className="mt-2 font-medium text-lg text-[#18181B]">{role}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <svg className="cursor-pointer" width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="43" height="43" rx="6.5" fill="#FFF1F4"/>
                            <rect x="0.5" y="0.5" width="43" height="43" rx="6.5" stroke="#FFD6DD"/>
                            <path d="M29.5 15.5L28.8803 25.5251C28.7219 28.0864 28.6428 29.3671 28.0008 30.2879C27.6833 30.7431 27.2747 31.1273 26.8007 31.416C25.8421 32 24.559 32 21.9927 32C19.4231 32 18.1383 32 17.179 31.4149C16.7048 31.1257 16.296 30.7408 15.9787 30.2848C15.3369 29.3626 15.2594 28.0801 15.1046 25.5152L14.5 15.5" stroke="#EA3A5A" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M19 21.7349H25" stroke="#EA3A5A" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M20.5 25.6543H23.5" stroke="#EA3A5A" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M13 15.5H31M26.0555 15.5L25.3729 14.0917C24.9194 13.1563 24.6926 12.6885 24.3015 12.3968C24.2148 12.3321 24.1229 12.2745 24.0268 12.2247C23.5937 12 23.0739 12 22.0343 12C20.9686 12 20.4358 12 19.9955 12.2341C19.8979 12.286 19.8048 12.3459 19.7171 12.4132C19.3215 12.7167 19.1004 13.2015 18.6584 14.1713L18.0527 15.5" stroke="#EA3A5A" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>

                        <svg className="cursor-pointer" width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="43" height="43" rx="6.5" fill="#F4F4F5"/>
                            <rect x="0.5" y="0.5" width="43" height="43" rx="6.5" stroke="#E4E4E7"/>
                            <path d="M26.4249 14.6051L27.4149 13.6151C28.2351 12.795 29.5648 12.795 30.3849 13.6151C31.205 14.4352 31.205 15.7649 30.3849 16.5851L29.3949 17.5751M26.4249 14.6051L19.7656 21.2644C19.2581 21.772 18.898 22.4078 18.724 23.1041L18 26L20.8959 25.276C21.5922 25.102 22.228 24.7419 22.7356 24.2344L29.3949 17.5751M26.4249 14.6051L29.3949 17.5751" stroke="#545756" stroke-width="1.5625" stroke-linejoin="round"/>
                            <path d="M28.9999 23.5C28.9999 26.7875 28.9999 28.4312 28.092 29.5376C27.9258 29.7401 27.7401 29.9258 27.5375 30.092C26.4312 31 24.7874 31 21.4999 31H21C17.2288 31 15.3432 31 14.1716 29.8284C13 28.6569 13 26.7712 13 23V22.5C13 19.2125 13 17.5688 13.9079 16.4624C14.0742 16.2599 14.2599 16.0742 14.4624 15.9079C15.5688 15 17.2125 15 20.5 15" stroke="#545756" stroke-width="1.5625" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>

                <div className="py-4 flex items-center text-[#7E8082] text-sm space-x-2">
                    <p className="">Hourly {hourlyPay}</p>
                    <p className="">-</p>
                    <p className="">Est. Time: 1 to 3 weeks</p>
                </div>

                <p className="text-base font-normal text-[#545756]">{detail}</p>

                <div className="mt-5 flex items-center space-x-3">
                    {skills.map((skill, index) => {
                        return (
                            <div key={index} className="border-[#E4E4E7] bg-[#F4F4F5] text-[#545756] rounded-full text-sm py-1 px-3">{skill}</div>
                        )
                    })}
                </div>

                <div className="flex items-center space-x-6 mt-5">
                    <div className="flex items-center space-x-1">
                        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9 1.4375C8.5791 1.4375 8.2362 1.61458 7.9242 1.85269C7.63193 2.07567 7.30955 2.39806 6.93239 2.77525L6.90586 2.80178C6.51987 3.18778 6.18337 3.33969 5.66406 3.33969C5.59898 3.33969 5.51684 3.33739 5.42409 3.33477C5.18632 3.32809 4.87873 3.31943 4.60961 3.3427C4.21596 3.37675 3.72399 3.48447 3.35059 3.861C2.98005 4.23466 2.87495 4.72461 2.84192 5.11579C2.81942 5.38246 2.82806 5.68776 2.83474 5.92383C2.83738 6.01684 2.83971 6.09912 2.83971 6.16405C2.83971 6.68336 2.68778 7.01986 2.30176 7.40588L2.27525 7.43239C1.89806 7.80955 1.57567 8.13193 1.35269 8.42413C1.11459 8.7362 0.937507 9.0791 0.9375 9.5C0.937507 9.92083 1.1146 10.2637 1.35269 10.5758C1.57571 10.8681 1.89818 11.1906 2.27546 11.5678L2.3018 11.5942C2.55204 11.8443 2.67008 12.0066 2.73699 12.1598C2.80214 12.309 2.83971 12.4978 2.83971 12.8359C2.83971 12.901 2.8374 12.9832 2.83479 13.0759C2.8281 13.3137 2.81945 13.6213 2.84272 13.8904C2.87677 14.284 2.9845 14.776 3.36104 15.1495C3.73471 15.5199 4.22465 15.625 4.61582 15.658C4.88248 15.6806 5.18777 15.6719 5.42384 15.6652C5.51686 15.6626 5.59912 15.6603 5.66405 15.6603C5.99496 15.6603 6.18094 15.6936 6.32734 15.754C6.4736 15.8143 6.63004 15.9224 6.86568 16.158C6.91597 16.2083 6.98222 16.2793 7.05865 16.3612C7.23112 16.5461 7.45553 16.7866 7.665 16.9697C7.98278 17.2475 8.4387 17.5625 9 17.5625C9.56137 17.5625 10.0172 17.2475 10.3351 16.9697C10.5445 16.7866 10.7687 16.5463 10.9411 16.3615C11.0176 16.2794 11.084 16.2084 11.1343 16.158C11.3699 15.9224 11.5264 15.8143 11.6726 15.754C11.819 15.6936 12.005 15.6603 12.3359 15.6603C12.4009 15.6603 12.4831 15.6626 12.5761 15.6652C12.8123 15.6719 13.1175 15.6806 13.3842 15.658C13.7753 15.625 14.2653 15.5199 14.639 15.1495C15.0155 14.776 15.1232 14.284 15.1573 13.8904C15.1805 13.6213 15.1719 13.3137 15.1652 13.0759C15.1626 12.9832 15.1603 12.901 15.1603 12.8359C15.1603 12.4978 15.1979 12.309 15.263 12.1598C15.3299 12.0066 15.448 11.8443 15.6982 11.5942L15.7246 11.5678C16.1018 11.1906 16.4243 10.8681 16.6473 10.5758C16.8854 10.2637 17.0625 9.92083 17.0625 9.5C17.0625 9.0791 16.8854 8.7362 16.6473 8.42413C16.4243 8.13193 16.102 7.80955 15.7248 7.43242L15.6982 7.40588C15.448 7.15562 15.3299 6.99334 15.263 6.84015C15.1979 6.69101 15.1603 6.50216 15.1603 6.16405C15.1603 6.09901 15.1626 6.01695 15.1652 5.92427C15.1719 5.6865 15.1805 5.37872 15.1573 5.10961C15.1232 4.71597 15.0155 4.224 14.639 3.8506C14.2654 3.48004 13.7754 3.37494 13.3842 3.34191C13.1175 3.31939 12.8123 3.32804 12.5761 3.33473C12.4831 3.33736 12.4009 3.33969 12.3359 3.33969C11.8165 3.33969 11.48 3.18771 11.0942 2.80178L11.0676 2.77526C10.6904 2.39806 10.3681 2.07567 10.0758 1.85269C9.7638 1.61458 9.4209 1.4375 9 1.4375ZM11.5965 8.29033C11.9639 8.099 12.1066 7.64607 11.9152 7.2787C11.7239 6.91133 11.271 6.76863 10.9037 6.95997C9.83265 7.51777 8.9589 8.5856 8.38155 9.42755C8.21887 9.66485 8.0742 9.8924 7.94985 10.098C7.86495 10.0261 7.78305 9.96155 7.70745 9.90462C7.54597 9.78305 7.40077 9.6872 7.29473 9.62105L7.10927 9.5114L7.10806 9.51073C6.74407 9.31303 6.28873 9.4478 6.09103 9.81185C5.89337 10.1757 6.02831 10.6311 6.39211 10.8288C6.49992 10.897 6.73347 11.0473 6.80519 11.1029C7.05538 11.2913 7.31031 11.5278 7.46496 11.7741C7.61025 12.0054 7.86982 12.1394 8.14252 12.124C8.41515 12.1085 8.658 11.9458 8.7762 11.6997C8.8146 11.6224 8.91195 11.4314 8.99467 11.2854C9.141 11.0222 9.3537 10.6622 9.6186 10.2759C10.1662 9.4772 10.8675 8.67005 11.5965 8.29033Z" fill={verified ? "#1A73E8" : "#FF5733"}/>
                        </svg>
                        <p className="text-sm font-normal text-[#7E8082]">Funds {verified ? "verified" : "not verified"}</p>
                    </div>

                    <div className="flex items-center space-x-1">
                        <p className="text-sm font-normal text-[#7E8082]">Funding:</p>
                        <p className="text-[#545756]">{funding}</p>
                    </div>

                    <div className="flex items-center space-x-1">
                        <p className="text-sm font-normal text-[#7E8082]">Applicants:</p>
                        <p className="text-[#545756]">{applicants}</p>
                    </div>

                    <div className="flex items-center space-x-1">
                        <LocationIcon/>

                        <p className="text-sm font-normal text-[#7E8082]">{location}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PostJobCardComponent