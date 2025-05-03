import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"

import { useAuth } from "@/context/AuthContext";


import {
    User, UserCheck, UserMinus, UserPlus,
} from "lucide-react"
import {Link} from "react-router";

export default function CommandBox() {
    const { user, logout } = useAuth();

    return (
        <div >
            <Command className="command-box">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {user.jwt === null && (
                        <CommandGroup heading="Authentication">
                            <Link to={'/register'}>
                                <CommandItem  className={'command-item'}>
                                    <UserPlus />
                                    <span>Register</span>
                                </CommandItem>
                            </Link>
                            <Link to={'/login'}>
                                <CommandItem className={'command-item'}>
                                    <UserCheck />
                                    <span>Login</span>
                                </CommandItem>
                            </Link>
                        </CommandGroup>
                    )}


                    {user?.jwt && (
                        <div>
                            <CommandSeparator />
                            <CommandGroup heading="Profile">
                                <CommandItem  className={'command-item'}>
                                    <User />
                                    <span>
                                {user?.name}
                            </span>
                                    <CommandShortcut>⌘P</CommandShortcut>
                                </CommandItem>
                                <CommandItem  className={'command-item'}>
                                    <span>Billing</span>
                                    <CommandShortcut>⌘B</CommandShortcut>
                                </CommandItem>
                                <CommandItem  className={'command-item'}>
                                    <span>Settings</span>
                                    <CommandShortcut>⌘S</CommandShortcut>
                                </CommandItem>
                            </CommandGroup>
                        </div>
                    )}
                    {user?.jwt && (
                        <div>
                            <CommandSeparator />
                            <CommandGroup heading={"Authentication"}>
                                <div onClick={logout}>
                                    <CommandItem className={'command-item'}>
                                        <UserMinus />
                                        <span>Logout</span>
                                    </CommandItem>
                                </div>
                            </CommandGroup>
                        </div>
                    )}
                </CommandList>
            </Command>
        </div>
    )
}