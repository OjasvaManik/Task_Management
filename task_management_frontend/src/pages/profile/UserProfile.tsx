import { useAuth } from "@/context/AuthContext";

import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

import {
    SubmitHandler,
    useForm,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

type UpdateForm = z.infer<typeof schemaUpdate>;
type PasswordForm = z.infer<typeof schemaPassword>;

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

const schemaUpdate = z.object({
    name: z.string(),
    userName: z.string(),
})

const schemaPassword = z.object({
    current: z.string(),
    new: z.string(),
})

export default function UserProfile() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<string | null>(null);
    const { user, updateUser } = useAuth();

    useEffect(() => {
        if (!user?.jwt) {
            navigate("/login");
        }
    }, [user, navigate]);

    const updateForm = useForm<UpdateForm>({
        resolver: zodResolver(schemaUpdate),
        defaultValues: {
            name: user.name,
            userName: user.userName,
        },
    })

    const passwordForm = useForm<PasswordForm>({
        resolver: zodResolver(schemaPassword),
        defaultValues: {
            current: "",
            new: "",
        },
    })

    const onSubmitUpdate: SubmitHandler<UpdateForm> = async (data) => {
        console.log("Account Update Form Submitted:", data);
        try {
            setIsLoading(true);
            setIsError(null);
            setIsSuccess(null);

            const apiUrl = "http://localhost:8080/api/v1/user/update";

            const payLoad = {
                userId: user.userId,
                ...data
            }

            const response = await fetch(apiUrl, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user.jwt}`
                },
                body: JSON.stringify(payLoad),
                credentials: "include",
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || `Error ${response.status}: Update failed`);
            }

            updateUser({
                name: responseData.name,
                userName: responseData.userName,
                role: user.role,
                organisationName: user.organisationName,
                organisationId: user.organisationId,
                userId: responseData.userId,
                jwt: user.jwt,
            })

        } catch (error) {
            console.error("Update error:", error);
            if (error instanceof TypeError && error.message.includes("fetch")) {
                setIsError("Network error: Please check your server or CORS configuration.");
            } else {
                setIsError(error instanceof Error ? error.message : "An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitPassword: SubmitHandler<PasswordForm> = (data) => {
        console.log("Password Form Submitted:", data);

    };

    return (
        <div className={'mt-4'}>
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
                    <TabsTrigger value="password" className={'profile-tab'}>Password</TabsTrigger>
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
                            <Form {...updateForm}>
                                <form onSubmit={updateForm.handleSubmit(onSubmitUpdate)} className="space-y-4">
                                    <FormField
                                        control={updateForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="border-0" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="space-y-1">
                                        <Label htmlFor="role">Username</Label>
                                        <Input id="userName" value={user.userName} disabled className="border-0" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="role">Role</Label>
                                        <Input id="role" value={user.role} disabled className="border-0" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="organisation">Organisation</Label>
                                        <Input id="organisation" value={user.organisationName} disabled className="border-0" />
                                    </div>

                                    <CardFooter className="px-0">
                                        <Button type="submit" disabled={updateForm.formState.isSubmitting}>
                                            Save changes
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Form>

                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="password">
                    <Card className={'profile-card'}>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                                Change your password here. After saving, you'll be logged out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                                    <FormField
                                        control={passwordForm.control}
                                        name="current"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Current password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} className="border-0" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={passwordForm.control}
                                        name="new"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} className="border-0" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <CardFooter className="px-0">
                                        <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                                            Save password
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}