import {useAuth} from "@/context/AuthContext.tsx";

export default function OrganisationProfile() {
    const { user, logout } = useAuth();

    return (
        <div>
            <div className={'text-white'}>Hello</div>
        </div>
    )
}