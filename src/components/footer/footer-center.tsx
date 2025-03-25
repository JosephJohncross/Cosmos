import { Link } from "react-router-dom"

const quickLinks = [
    {
        label: "About",
        link: ""
    },
    {
        label: "Privacy Policy",
        link: ""
    },
    {
        label: "Terms of Use",
        link: ""
    },
    {
        label: "Customer Support",
        link: ""
    },
]

const FooterCenter = () => {
    return (
        <div className="flex  justify-center">
            <div className="flex flex-col gap-y-5 text-[#545756] text-[15px] font-normal font-circular">
                {quickLinks.map(link => {
                    return (
                        <Link className="font-normal" key={link.label} to={link.link}>{link.label}</Link>
                    )
                })}
            </div>
        </div>
    )
}

export default FooterCenter