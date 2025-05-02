import RegisterUser from "@/pages/auth/RegisterUser.tsx";
import RegisterOrganisation from "@/pages/auth/RegisterOrganisation.tsx";

export default function Register() {
    return(
        <div className={''}>
            <div className={'px-10 pt-10 text-5xl text-amber-700 transform capitalize mb-8 font-bold border-b-4 border-amber-700 w-full'}>REGISTER</div>
            <div className={'xl:flex xl:justify-between p-10'}>
                <div className={'xl:border-r-3 xl:border-amber-700 relative xl:border-t-3'}>
                    <div className={'text-2xl text-amber-600 xl:border-b-3 xl:border-amber-700 text-center xl:text-start'}>REGISTER USER</div>
                    <RegisterUser />
                </div>
                <div className={'xl:border-l-3 xl:border-amber-700 relative xl:border-t-3'}>
                    <div className={'text-2xl text-amber-600 xl:text-end xl:border-b-3 xl:border-amber-700 text-center'}>REGISTER ORGANISATION</div>
                    <RegisterOrganisation />
                </div>
            </div>
        </div>
    )
}