import NavBar from "@/pages/home/NavBar.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import CommandBox from "@/pages/home/CommandBox.tsx";
import {useEffect} from "react";

export default function Home() {

    return (
        <div className="flex flex-col">
            <NavBar />
            <div className="m-2 xl:hidden">
                <CommandBox />
            </div>
            <div className="xl:flex xl:flex-1 xl:flex-row">
                <div className="xl:flex-1 xl:overflow-auto">
                    <Outlet />
                </div>
                <div className="xl:p-2 xl:sticky hidden xl:block">
                    <CommandBox />
                </div>
            </div>
        </div>
    );
}
