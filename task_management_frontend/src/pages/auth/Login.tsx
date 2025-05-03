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
import {House, UserCheck, UserPlus} from "lucide-react";
import {useState} from "react";
import {Link} from "react-router";
import {useNavigate} from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Adjust the import path as needed

const schema = z.object({
    userName: z.string().min(3, {
        message: "Username must be at least 3 characters long",
    }),
    userPassword: z.string().min(8, {
        message: "Password must be at least 8 characters long",
    }),
    organisationName: z.string().min(1, {
        message: "Name of Organisation must be at least 3 characters long",
    }),
})

type FormFields = z.infer<typeof schema>;

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<string | null>(null);
    const { login } = useAuth(); // Get the login function from AuthContext

    const form = useForm<FormFields>({
        resolver: zodResolver(schema),
        defaultValues: {
            userName: "",
            userPassword: "",
            organisationName: "",
        },
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            setIsLoading(true);
            setIsError(null);
            setIsSuccess(null);


            const apiUrl = "http://localhost:8080/api/v1/auth/login";

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include",
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || `Error ${response.status}: Login failed`);
            }

            // Use the login function from AuthContext instead of directly setting localStorage
            login({
                jwt: responseData.jwtToken || null,
                userName: responseData.userName || null,
                name: responseData.name || "Guest",
                role: responseData.role || null,
                userId: responseData.userId || null,
                organisationId: responseData.organisationId || null,
                organisationName: responseData.organisationName || null,
            });

            setIsSuccess("Logged in successfully!");
            navigate("/home");
        } catch (error) {
            console.error("Login error:", error);
            if (error instanceof TypeError && error.message.includes("fetch")) {
                setIsError("Network error: Please check your server or CORS configuration.");
            } else {
                setIsError(error instanceof Error ? error.message : "An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={'flex flex-col justify-end h-screen'}>
            <div className={'nav'}>LOGIN</div>
            <div className={'flex gap-4 mb-5 justify-center items-center xl:hidden'}>
                <Link to={'/'}><Button className={'button'}><House />Go Home</Button></Link>
                <Link to={'/register'}><Button className={'button'}><UserPlus />Register</Button></Link>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 lg:flex lg:justify-center lg:items-center lg:flex-col px-4 py-4">
                    <div className={'pb-10 text-2xl text-white text-center mb-4 xl:w-[50vw] xl:flex xl:flex-col xl:justify-center xl:items-center xl:gap-4 boxes'}>
                        <div className={'w-full xl:border-b-3 p-5 mb-5'}>
                            LOGIN USER
                        </div>
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
                                <FormItem className="relative group/desc my-4 xl:m-0">
                                    <FormLabel className="label">Username:</FormLabel>
                                    <div className="flex items-center relative">
                                        <FormDescription
                                            className="
                                                    hidden
                                                    lg:absolute
                                                    lg:left-190
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
                            name="organisationName"
                            render={({ field }) => (
                                <FormItem className="relative group/desc my-4 xl:m-0">
                                    <FormLabel className="label">Organisation:</FormLabel>
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
                            name="userPassword"
                            render={({ field }) => (
                                <FormItem className="relative group/desc my-4 xl:m-0">
                                    <FormLabel className="label">Password:</FormLabel>
                                    <div className="flex items-center relative">
                                        <FormDescription
                                            className="
                                                    hidden
                                                    lg:absolute
                                                    lg:left-195
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
                        <Button disabled={isLoading} className={'button mt-4'} type="submit">
                            <UserCheck />
                            {isLoading ? "Logging In..." : "Login"}
                        </Button>
                    </div>
                    <div className={'xl:flex xl:gap-4 xl:justify-center xl:items-center hidden'}>
                        <Link to={'/'}><Button className={'button'}><House />Go Home</Button></Link>
                        <Link to={'/register'}><Button className={'button'}><UserPlus />Register</Button></Link>
                    </div>
                </form>
            </Form>
        </div>
    )
}