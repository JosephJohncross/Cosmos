import { Link } from "react-router-dom"

const centerRoutes = [
    {
        label: "About",
        link: ""
    },
    {
        label: "Services",
        link: ""
    },
    {
        label: "How it works",
        link: ""
    },
]

const HeaderCenter = () => {
    return (
        <div className="flex items-center space-x-8 font-circular text-base text-[#545756]">
            {centerRoutes.map(routes => {
                return (
                    <Link key={routes.label} to={routes.link}>{routes.label}</Link>
                )
            })}
        </div>
    )
}

export default HeaderCenter