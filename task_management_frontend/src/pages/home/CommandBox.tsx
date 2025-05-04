import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"

import { useAuth } from "@/context/AuthContext";

import {
    BookCheck, BookMinus, BookOpenCheck, Check, CheckCheck, StickyNote,
    User, UserCheck, UserMinus, UserPlus, Users,
} from "lucide-react"
import {Link} from "react-router";
import CreateGroup from "@/pages/Group/CreateGroup.tsx";
import CreateTask from "@/pages/Group/CreateTask.tsx";

export default function CommandBox() {
    const { user, logout } = useAuth();

    return (
        <div >
            <Command className="command-box">
                <CommandInput placeholder="Type a command or search..."  className={'text-white'} />
                <CommandList className={'max-h-auto'}>
                    <CommandEmpty>No results found.</CommandEmpty>

                    {!user?.jwt ? (
                        <CommandGroup heading="Authentication">
                            <Link to={'/register'}>
                                <CommandItem className={'command-item'}>
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
                    ) : (
                        <>
                            <CommandSeparator />
                            <CommandGroup heading="Tasks">
                                <CommandItem value={'group'} className={'command-item'}>
                                    <BookCheck />
                                    <CreateGroup />
                                </CommandItem>
                                <CommandItem value={'task'} className={'command-item'}>
                                    <BookCheck />
                                    <CreateTask />
                                </CommandItem>
                                    <Link to={"/home"}>
                                        <CommandItem  className={'command-item'}>
                                            <BookOpenCheck />
                                            <span>All</span>
                                        </CommandItem>
                                    </Link>
                                {/*<CommandItem  className={'command-item'}>*/}
                                {/*    <StickyNote />*/}
                                {/*    <span>*/}
                                {/*        Todo*/}
                                {/*    </span>*/}
                                {/*</CommandItem>*/}
                                {/*<CommandItem  className={'command-item'}>*/}
                                {/*    <Check />*/}
                                {/*    <span>*/}
                                {/*        In Progress*/}
                                {/*    </span>*/}
                                {/*</CommandItem>*/}
                                {/*<CommandItem  className={'command-item'}>*/}
                                {/*    <CheckCheck />*/}
                                {/*    <span>*/}
                                {/*        Done*/}
                                {/*    </span>*/}
                                {/*</CommandItem>*/}
                                {/*<CommandItem  className={'command-item'}>*/}
                                {/*    <BookMinus />*/}
                                {/*    <span>*/}
                                {/*        Cancelled*/}
                                {/*    </span>*/}
                                {/*</CommandItem>*/}
                            </CommandGroup>

                            <CommandSeparator />
                            <CommandGroup heading="Profile">
                                <Link to={'/home/user'}>
                                    <CommandItem value={'user'} className={'command-item'}>
                                        <User />
                                        <span>{user?.name}</span>
                                    </CommandItem>
                                </Link>
                                <Link to={'/home/organisation'}>
                                    <CommandItem value={'organisation'} className={'command-item'}>
                                        <Users />
                                        <span>{user?.organisationName}</span>
                                    </CommandItem>
                                </Link>
                                <CommandItem className={'command-item'}>
                                    <span>Settings</span>
                                </CommandItem>
                            </CommandGroup>

                            <CommandSeparator />
                            <CommandGroup heading="Authentication">
                                <div onClick={logout}>
                                    <CommandItem className={'command-item'}>
                                        <UserMinus />
                                        <span>Logout</span>
                                    </CommandItem>
                                </div>
                            </CommandGroup>
                        </>
                    )}
                </CommandList>
            </Command>
        </div>
    )
}