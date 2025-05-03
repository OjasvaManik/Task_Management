import NavBar from "@/pages/home/NavBar.tsx";
import {Outlet} from "react-router-dom";
import CommandBox from "@/pages/home/CommandBox.tsx";

export default function Home() {

    return (
        <div className="flex flex-col">
            <NavBar />
            <div className="m-2 xl:hidden">
                <CommandBox />
            </div>
            <div className="xl:flex xl:flex-row">
                <div className="xl:flex-1 mx-4 boxes">
                    <Outlet />
                </div>
                <div className="xl:p-5 xl:sticky xl:top-0 hidden xl:block h-fit">
                    <CommandBox />
                </div>
            </div>
        </div>
    );
}
