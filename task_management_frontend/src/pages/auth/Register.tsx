import RegisterUser from "@/pages/auth/RegisterUser.tsx";
import RegisterOrganisation from "@/pages/auth/RegisterOrganisation.tsx";
import {Button} from "@/components/ui/button.tsx";
import {House, UserCheck} from "lucide-react";
import {Link} from "react-router";

export default function Register() {
    return(
        <div className={''}>
            <div className={'reg-nav'}>REGISTER</div>
            <div className={'xl:hidden flex justify-center gap-4'}>
                <Link to={'/'}><Button className={'button'}><House />Go Home</Button></Link>
                <Link to={'/login'}><Button className={'button'}><UserCheck />Login</Button></Link>
            </div>
            <div className={'xl:flex xl:justify-between p-10'}>
                <div className={'boxes relative mb-10 xl:mb-0'}>
                    <div className={'text-2xl xl:border-b-3 text-white text-center'}>REGISTER USER</div>
                    <RegisterUser />
                </div>
                <div className={'hidden xl:flex xl:items-baseline xl:gap-4 xl:mx-2'}>
                    <Link to={'/'}><Button className={'button'}><House />Go Home</Button></Link>
                    <Link to={'/login'}><Button className={'button'}><UserCheck />Login</Button></Link>
                </div>
                <div className={'boxes relative'}>
                    <div className={'text-2xl xl:border-b-3 text-white text-center'}>REGISTER ORGANISATION</div>
                    <RegisterOrganisation />
                </div>
            </div>
        </div>
    )
}