import { useAuth } from "@/context/AuthContext";

import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

import axios from 'axios';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

type User = {
    userId: string;
    userName: string;
    name: string;
    role: string;
    organisationId: string;
};

export default function OrganisationProfile() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isError, setError] = useState(null);
    const { user } = useAuth();

    const handleRoleClick = async (gotUser: User) => {
        // Check if user is already an admin
        if (gotUser.role === "ADMIN") {
            alert("This user is already an admin.");
            return;
        }

        try {
            // Send the request to make the user an admin
            const response = await axios.put(
                "http://localhost:8080/api/v1/organisation/make-admin",
                {
                    userName: gotUser.userName,
                    role: "ADMIN",
                    organisationId: user.organisationId,
                    organisationName: user.organisationName,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.jwt}`,
                    },
                }
            );

            console.log("Admin updated successfully:", response.data);

            // Update the users list by modifying the user role to ADMIN
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.userId === gotUser.userId
                        ? { ...user, role: "ADMIN" }
                        : user
                )
            );
        } catch (error) {
            console.error("Error updating admin:", error);
            setError("Failed to make user an admin.");
        }
    };


    useEffect(() => {
        // First check if user is logged in
        if (!user?.jwt) {
            navigate("/login");
            return; // Exit early if not logged in
        }

        const fetchUsers = async () => {
            try {
                setLoading(true);

                // Using path variable instead of request body
                const response = await axios.get<User[]>(`http://localhost:8080/api/v1/organisation/${user.organisationId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.jwt}`
                    }
                });

                console.log("Response from backend:", response.data);

                setUsers(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError(err.response?.data?.message || 'Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        // Call the fetch function
        fetchUsers();
    }, [user, navigate]);

    return (
        <div className={'mt-4'}>
            {isError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{isError}</span>
                </div>
            )}
            <Tabs defaultValue="account" className={''}>
                <TabsList className={`grid w-full ${user.role === 'ROLE_ADMIN' ? 'grid-cols-2' : 'grid-cols-1'} bg-black`}>
                    <TabsTrigger value="account" className={'profile-tab'}>Account</TabsTrigger>
                    {user.role === 'ROLE_ADMIN' && (
                        <TabsTrigger value="users" className={'profile-tab'}>Users</TabsTrigger>
                    )}
                </TabsList>
                <TabsContent value="account">
                    <Card className={'profile-card'}>
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                            <CardDescription>
                                Make changes to your account here. Click save when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="role">Organisation</Label>
                                <Input id="userName" value={user.organisationName} disabled className="border-0" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="role">Role</Label>
                                <Input id="role" value={user.role} disabled className="border-0" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="organisation">Organisation</Label>
                                <Input id="organisation" value={user.organisationName} disabled className="border-0" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="users">
                    <Card className={'profile-card'}>
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                            <CardDescription>
                                List of All users here. Can change their role as well.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Table>
                                <TableCaption>User List ends here.</TableCaption>
                                <TableHeader className={'hover:pointer-events-none'}>
                                    <TableRow className={'hover:pointer-events-none'}>
                                        <TableHead className="text-white hover:pointer-events-none pointer-events-none">User Id</TableHead>
                                        <TableHead className="text-white hover:pointer-events-none pointer-events-none">User Name</TableHead>
                                        <TableHead className="text-white hover:pointer-events-none pointer-events-none">Full Name</TableHead>
                                        <TableHead className="text-white hover:pointer-events-none pointer-events-none">Organisation</TableHead>
                                        <TableHead className="text-right text-white hover:pointer-events-none pointer-events-none">Role</TableHead>
                                    </TableRow>
                                </TableHeader>
                                {loading ? (
                                    <div className="text-center py-4 text-gray-600">Loading users...</div>
                                ) : users.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500">No users found.</div>
                                ) : (
                                    <TableBody>
                                        {users.map((gotUser) => (
                                            <TableRow key={gotUser.userId} className={'hover:bg-white hover:text-black'}>
                                                <TableCell className={'font-medium'}>{gotUser.userId}</TableCell>
                                                <TableCell className={'font-medium'}>{gotUser.userName}</TableCell>
                                                <TableCell className={'font-medium'}>{gotUser.name}</TableCell>
                                                <TableCell className={'font-medium'}>{gotUser.organisationId}</TableCell>
                                                <TableCell className="text-right font-medium">
                                                    <Button className={'button'} onClick={() => handleRoleClick(gotUser)}>
                                                        {gotUser.role}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                )}

                                <TableFooter>
                                    <TableRow className={'bg-black hover:bg-white hover:text-black'}>
                                        <TableCell colSpan={4}>Total Users</TableCell>
                                        <TableCell className="text-right">{users.length}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}