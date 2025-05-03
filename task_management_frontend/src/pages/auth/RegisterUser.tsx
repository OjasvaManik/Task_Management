import {
    SubmitHandler,
    useForm,
} from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {UserPlus} from "lucide-react";
import {useState} from "react";

const schema = z.object({
    userName: z.string().min(3, {
        message: "Username must be at least 3 characters long",
    }),
    userPassword: z.string().min(8, {
        message: "Password must be at least 8 characters long",
    }),
    email: z.string().email(),
    name: z.string().min(1, {
        message: "Name must be at least 3 characters long",
    }),
    organisationName: z.string().min(1, {
        message: "Organisation Name must be at least 3 characters long",
    }),
    organisationSecretCode: z.string().min(3, {
        message: "Secret Code must be at least 3 characters long",
    }),
})

type FormFields = z.infer<typeof schema>;

export default function RegisterUser() {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<string | null>(null);

    const form = useForm<FormFields>({
        resolver: zodResolver(schema),
        defaultValues: {
            userName: "",
            userPassword: "",
            email: "",
            name: "",
            organisationName: "",
            organisationSecretCode: "",
        },
    });
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try{
            setIsLoading(true);
            setIsError(null);
            setIsSuccess(null);

            console.log("Submitting form data:", data);

            const apiUrl = "http://localhost:8080/api/v1/auth/register";

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include",
            })

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(responseText || `Error ${response.status}: Failed to register organisation`);
            }

            setIsSuccess(responseText || "Organisation registered successfully!");
            form.reset();
        }
        catch (error) {
            console.error("Registration error:", error);
            if (error instanceof TypeError && error.message.includes('fetch')) {
                // Network error - likely CORS issue
                setIsError("Network error: CORS issue detected. Please check server configuration.");
            } else {
                setIsError(error instanceof Error ? error.message : "An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <div className={'p-10 flex flex-col items-center'}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 lg:flex lg:justify-center lg:items-center lg:flex-col ">
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
                    <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                            <FormItem className="relative group/desc">
                                <FormLabel className="label">Username:</FormLabel>
                                <div className="flex items-center relative">
                                    <FormDescription
                                        className="
                                                    hidden
                                                    lg:absolute
                                                    lg:left-200
                                                    lg:-translate-x-full
                                                    lg:mr-2
                                                    px-2
                                                    py-1
                                                    rounded
                                                    shadow
                                                    description
                                                    lg:group-hover/desc:block
                                                  "
                                    >
                                        This is your unique user name.
                                    </FormDescription>
                                    <div className="flex flex-col w-full group/mob-desc">
                                        <FormControl>
                                            <Input
                                                autoComplete={"off"}
                                                disabled={form.formState.isSubmitting}
                                                placeholder="Username"
                                                className="input"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="my-2 hidden description group-focus-within/mob-desc:block lg:group-focus-within/mob-desc:hidden">
                                            This is your unique user name.
                                        </FormDescription>
                                    </div>
                                </div>

                                <FormMessage className="message" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="relative group/desc">
                                <FormLabel className="label">Full Name:</FormLabel>
                                <div className="flex items-center relative">
                                    <FormDescription
                                        className="
                                                    hidden
                                                    lg:absolute
                                                    lg:left-202
                                                    lg:-translate-x-full
                                                    lg:mr-2
                                                    px-2
                                                    py-1
                                                    rounded
                                                    shadow
                                                    description
                                                    lg:group-hover/desc:block
                                                  "
                                    >
                                        This is your display name.
                                    </FormDescription>
                                    <div className="flex flex-col w-full group/mob-desc">
                                        <FormControl>
                                            <Input
                                                autoComplete={"off"}
                                                disabled={form.formState.isSubmitting}
                                                placeholder="Full Name"
                                                className="input"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="my-2 hidden description group-focus-within/mob-desc:block lg:group-focus-within/mob-desc:hidden">
                                            This is your display name.
                                        </FormDescription>
                                    </div>
                                </div>

                                <FormMessage className="message" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="relative group/desc">
                                <FormLabel className="label">Email:</FormLabel>
                                <div className="flex items-center relative">
                                    <FormDescription
                                        className="
                                                    hidden
                                                    lg:absolute
                                                    lg:left-200
                                                    lg:-translate-x-full
                                                    lg:mr-2
                                                    px-2
                                                    py-1
                                                    rounded
                                                    shadow
                                                    description
                                                    lg:group-hover/desc:block
                                                  "
                                    >
                                        This will be your unique email ID.
                                    </FormDescription>
                                    <div className="flex flex-col w-full group/mob-desc">
                                        <FormControl>
                                            <Input
                                                autoComplete={"off"}
                                                disabled={form.formState.isSubmitting}
                                                placeholder="Email"
                                                className="input"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="my-2 hidden description group-focus-within/mob-desc:block lg:group-focus-within/mob-desc:hidden">
                                            This will be your unique email ID.
                                        </FormDescription>
                                    </div>
                                </div>

                                <FormMessage className="message" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="organisationName"
                        render={({ field }) => (
                            <FormItem className="relative group/desc">
                                <FormLabel className="label">Organisation:</FormLabel>
                                <div className="flex items-center relative">
                                    <FormDescription
                                        className="
                                                    hidden
                                                    lg:absolute
                                                    lg:left-215
                                                    lg:-translate-x-full
                                                    lg:mr-2
                                                    px-2
                                                    py-1
                                                    rounded
                                                    shadow
                                                    description
                                                    lg:group-hover/desc:block
                                                  "
                                    >
                                        This is the user name of your organisation.
                                    </FormDescription>
                                    <div className="flex flex-col w-full group/mob-desc">
                                        <FormControl>
                                            <Input
                                                autoComplete={"off"}
                                                disabled={form.formState.isSubmitting}
                                                placeholder="Organisation"
                                                className="input"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="my-2 hidden description group-focus-within/mob-desc:block lg:group-focus-within/mob-desc:hidden">
                                            This is the user name of your organisation.
                                        </FormDescription>
                                    </div>
                                </div>

                                <FormMessage className="message" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="organisationSecretCode"
                        render={({ field }) => (
                            <FormItem className="relative group/desc">
                                <FormLabel className="label">Organisation Code:</FormLabel>
                                <div className="flex items-center relative">
                                    <FormDescription
                                        className="
                                                    hidden
                                                    lg:absolute
                                                    lg:left-210
                                                    lg:-translate-x-full
                                                    lg:mr-2
                                                    px-2
                                                    py-1
                                                    rounded
                                                    shadow
                                                    description
                                                    lg:group-hover/desc:block
                                                  "
                                    >
                                        Organisation Code must be of 8 characters or more.
                                    </FormDescription>
                                    <div className="flex flex-col w-full group/mob-desc">
                                        <FormControl>
                                            <Input
                                                autoComplete={"off"}
                                                type="password"
                                                disabled={form.formState.isSubmitting}
                                                placeholder="Organisation Code"
                                                className="input"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="my-2 hidden description group-focus-within/mob-desc:block lg:group-focus-within/mob-desc:hidden text-wrap">
                                            Organisation Code must be of 8 characters or more.
                                        </FormDescription>
                                    </div>
                                </div>

                                <FormMessage className="message" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="userPassword"
                        render={({ field }) => (
                            <FormItem className="relative group/desc">
                                <FormLabel className="label">Password:</FormLabel>
                                <div className="flex items-center relative">
                                    <FormDescription
                                        className="
                                                    hidden
                                                    lg:absolute
                                                    lg:left-210
                                                    lg:-translate-x-full
                                                    lg:mr-2
                                                    px-2
                                                    py-1
                                                    rounded
                                                    shadow
                                                    description
                                                    lg:group-hover/desc:block
                                                  "
                                    >
                                        Password must be of 8 characters or more.
                                    </FormDescription>
                                    <div className="flex flex-col w-full group/mob-desc">
                                        <FormControl>
                                            <Input
                                                autoComplete={"off"}
                                                type="password"
                                                disabled={form.formState.isSubmitting}
                                                placeholder="Password"
                                                className="input"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="my-2 hidden description group-focus-within/mob-desc:block lg:group-focus-within/mob-desc:hidden text-wrap">
                                            Password must be of 8 characters or more.
                                        </FormDescription>
                                    </div>
                                </div>

                                <FormMessage className="message" />
                            </FormItem>
                        )}
                    />
                    <Button disabled={isLoading} className={'button'} type="submit">
                        <UserPlus />
                        {isLoading ? "Registering..." : "Register"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}