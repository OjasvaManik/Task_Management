import { useAuth } from "@/context/AuthContext";

import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

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

export default function OrganisationProfile() {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();

    useEffect(() => {
        if (!user?.jwt) {
            navigate("/login");
        }
    }, [user, navigate]);



    return (
        <div>
            {isError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{isError}</span>
                </div>
            )}

            {isSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{isSuccess}</span>
                </div>
            )}
            <Tabs defaultValue="account" className={''}>
                <TabsList className="grid w-full grid-cols-2 bg-black">
                    <TabsTrigger value="account" className={'profile-tab'}>Account</TabsTrigger>
                    <TabsTrigger value="users" className={'profile-tab'}>Users</TabsTrigger>
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
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                                Change your password here. After saving, you'll be logged out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">

                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}