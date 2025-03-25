import HeaderCenter from "./header-center"
import HeaderEnd from "./header-end"
import HeaderStart from "./header-start"

const HeaderMain = () => {
    return (
        <>
            <div className="fixed w-full top-0 bg-[#F4F4F5] z-[1]  py-8">
                <div className="flex items-center justify-between app-container">
                    <HeaderStart/>

                    <HeaderCenter/>

                    <HeaderEnd/>
                </div>
            </div>
        </>
    )
}

export default HeaderMain