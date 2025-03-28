import Logo from "../icons/main-logo"

const FooterStart = () => {
    return (
        <>
            <div className="flex flex-col gap-y-7">
                <Logo className=""/>

                <div className="font-circular font-normal text-[14px] text-[#545756]">
                    <p className="">Connect with high-paying clients and discover top-tier talent all in one place, with just a single profile.</p>
                    <p className="mt-6">Note: Work operates independently of state-sponsored fiat currencies. All payments are transacted in Atoms, our secure and efficient digital currency, ensuring seamless, borderless transactions.</p>
                </div>
            </div>
        </>
    )
}

export default FooterStart