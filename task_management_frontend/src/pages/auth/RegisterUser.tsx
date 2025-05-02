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
        message: "Name of Organisation must be at least 3 characters long",
    }),
    organisationSecretCode: z.string().min(3, {
        message: "Organisation Secret Code must be at least 3 characters long",
    }),
})

type FormFields = z.infer<typeof schema>;

export default function RegisterUser() {
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
    const onSubmit: SubmitHandler<FormFields> = (data) => {
        console.log(data);
    }

    return(
        <div className={'p-10 flex flex-col items-center'}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 lg:flex lg:justify-center lg:items-center lg:flex-col ">
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
                    <Button disabled={form.formState.isSubmitting} className={'button'} type="submit">
                        <UserPlus />
                        {form.formState.isSubmitting ? "Loading..." : "Register"}
                    </Button>

                    {/*<FormField*/}
                    {/*    control={form.control}*/}
                    {/*    name="name"*/}
                    {/*    render={({ field }) => (*/}
                    {/*        <FormItem>*/}
                    {/*            <FormLabel className={'label'}>Name:</FormLabel>*/}
                    {/*            <FormControl>*/}
                    {/*                <Input disabled={form.formState.isSubmitting} placeholder="Name" className={'input'} {...field} />*/}
                    {/*            </FormControl>*/}
                    {/*            <FormDescription className={'description'}>*/}
                    {/*                This is your public display name.*/}
                    {/*            </FormDescription>*/}
                    {/*            <FormMessage className={'message'}  />*/}
                    {/*        </FormItem>*/}
                    {/*    )}*/}
                    {/*/>*/}
                    {/*<FormField*/}
                    {/*    control={form.control}*/}
                    {/*    name="email"*/}
                    {/*    render={({ field }) => (*/}
                    {/*        <FormItem>*/}
                    {/*            <FormLabel className={'label'}>Email:</FormLabel>*/}
                    {/*            <FormControl>*/}
                    {/*                <Input disabled={form.formState.isSubmitting} placeholder="Email" className={'input'} {...field} />*/}
                    {/*            </FormControl>*/}
                    {/*            <FormMessage className={'message'}  />*/}
                    {/*        </FormItem>*/}
                    {/*    )}*/}
                    {/*/>*/}
                    {/*<FormField*/}
                    {/*    control={form.control}*/}
                    {/*    name="organisationName"*/}
                    {/*    render={({ field }) => (*/}
                    {/*        <FormItem>*/}
                    {/*            <FormLabel className={'label'}>Organisation Name:</FormLabel>*/}
                    {/*            <FormControl>*/}
                    {/*                <Input disabled={form.formState.isSubmitting} placeholder="Organsiation Name" className={'input'} {...field} />*/}
                    {/*            </FormControl>*/}
                    {/*            <FormDescription className={'description'}>*/}
                    {/*                Enter the Correct name of your Organisation.*/}
                    {/*            </FormDescription>*/}
                    {/*            <FormMessage className={'message'}  />*/}
                    {/*        </FormItem>*/}
                    {/*    )}*/}
                    {/*/>*/}
                    {/*<FormField*/}
                    {/*    control={form.control}*/}
                    {/*    name="userPassword"*/}
                    {/*    render={({ field }) => (*/}
                    {/*        <FormItem>*/}
                    {/*            <FormLabel className={'label'}>Password:</FormLabel>*/}
                    {/*            <FormControl>*/}
                    {/*                <Input disabled={form.formState.isSubmitting} type="password" placeholder="Password" className={'input'} {...field} />*/}
                    {/*            </FormControl>*/}
                    {/*            <FormMessage className={'message'}  />*/}
                    {/*        </FormItem>*/}
                    {/*    )}*/}
                    {/*/>*/}
                </form>
            </Form>
        </div>
    )
}