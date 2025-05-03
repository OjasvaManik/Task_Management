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
import { useState } from "react";

const schema = z.object({
	organisationName: z.string().min(1, {
		message: "Organisation Name must be at least 3 characters long",
	}),
	organisationEmail: z.string().email(),
	organisationSecretCode: z.string().min(3, {
		message: "Secret Code must be at least 3 characters long",
	}),
	userName: z.string().min(3, {
		message: "Username must be at least 3 characters long",
	}),
	userPassword: z.string().min(8, {
		message: "Password must be at least 8 characters long",
	}),
})

type FormFields = z.infer<typeof schema>;

export default function RegisterOrganisation() {
	const [isLoading, setIsLoading] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);
	const [apiSuccess, setApiSuccess] = useState<string | null>(null);

	const form = useForm<FormFields>({
		resolver: zodResolver(schema),
		defaultValues: {
			userName: "",
			userPassword: "",
			organisationEmail: "",
			organisationName: "",
			organisationSecretCode: "",
		},
	});

	const onSubmit: SubmitHandler<FormFields> = async (data) => {
		try {
			setIsLoading(true);
			setApiError(null);
			setApiSuccess(null);

			console.log("Submitting form data:", data);

			// Using full URL since React (5173) and Spring Boot (8080) are on different ports
			const apiUrl = "http://localhost:8080/api/v1/auth/register-organisation";

			console.log("Sending request to:", apiUrl);

			const response = await fetch(apiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
				// Important for CORS when credentials (cookies) need to be sent
				credentials: "include",
			});

			console.log("Response status:", response.status);

			const responseText = await response.text();
			console.log("Response text:", responseText);

			if (!response.ok) {
				throw new Error(responseText || `Error ${response.status}: Failed to register organisation`);
			}

			setApiSuccess(responseText || "Organisation registered successfully!");
			console.log("Registration successful");

			// Reset the form after successful submission
			form.reset();
		} catch (error) {
			console.error("Registration error:", error);
			if (error instanceof TypeError && error.message.includes('fetch')) {
				// Network error - likely CORS issue
				setApiError("Network error: CORS issue detected. Please check server configuration.");
			} else {
				setApiError(error instanceof Error ? error.message : "An unknown error occurred");
			}
		} finally {
			setIsLoading(false);
		}
	}

	return(
		<div className="p-10 flex flex-col items-center">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 lg:flex lg:justify-center lg:items-center lg:flex-col">
					{apiError && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
							<span className="block sm:inline">{apiError}</span>
						</div>
					)}

					{apiSuccess && (
						<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
							<span className="block sm:inline">{apiSuccess}</span>
						</div>
					)}

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
													  lg:left-[-240px]
													  lg:mr-2
													  px-2
													  py-1
													  rounded
													  shadow
													  description
													  lg:group-hover/desc:block
													  lg:w-[200px]
													  lg:text-wrap
                                                  "
									>
										This is the user name of your organisation.
									</FormDescription>
									<div className="flex flex-col w-full group/mob-desc">
										<FormControl>
											<Input
												autoComplete="off"
												disabled={isLoading}
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
						name="organisationEmail"
						render={({ field }) => (
							<FormItem className="relative group/desc">
								<FormLabel className="label">Organisation Email:</FormLabel>
								<div className="flex items-center relative">
									<FormDescription
										className="
                                                    hidden
													  lg:absolute
													  lg:left-[-240px]
													  lg:mr-2
													  px-2
													  py-1
													  rounded
													  shadow
													  description
													  lg:group-hover/desc:block
													  lg:w-[200px]
													  lg:text-wrap
                                                  "
									>
										This will be your unique email ID.
									</FormDescription>
									<div className="flex flex-col w-full group/mob-desc">
										<FormControl>
											<Input
												autoComplete="off"
												disabled={isLoading}
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
						name="organisationSecretCode"
						render={({ field }) => (
							<FormItem className="relative group/desc">
								<FormLabel className="label">Organisation Code:</FormLabel>
								<div className="flex items-center relative">
									<FormDescription
										className="
                                                    hidden
													  lg:absolute
													  lg:left-[-240px]
													  lg:mr-2
													  px-2
													  py-1
													  rounded
													  shadow
													  description
													  lg:group-hover/desc:block
													  lg:w-[200px]
													  lg:text-wrap
                                                  "
									>
										Organisation Code must be of 8 characters or more.
									</FormDescription>
									<div className="flex flex-col w-full group/mob-desc">
										<FormControl>
											<Input
												autoComplete="off"
												type="password"
												disabled={isLoading}
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
						name="userName"
						render={({ field }) => (
							<FormItem className="relative group/desc">
								<FormLabel className="label">Username:</FormLabel>
								<div className="flex items-center relative">
									<FormDescription
										className="
                                                    hidden
													  lg:absolute
													  lg:left-[-240px]
													  lg:mr-2
													  px-2
													  py-1
													  rounded
													  shadow
													  description
													  lg:group-hover/desc:block
													  lg:w-[200px]
													  lg:text-wrap
                                                  "
									>
										This is your unique user name.
									</FormDescription>
									<div className="flex flex-col w-full group/mob-desc">
										<FormControl>
											<Input
												autoComplete="off"
												disabled={isLoading}
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
						name="userPassword"
						render={({ field }) => (
							<FormItem className="relative group/desc">
								<FormLabel className="label">Password:</FormLabel>
								<div className="flex items-center relative">
									<FormDescription
										className="
                                                    hidden
													  lg:absolute
													  lg:left-[-240px]
													  lg:mr-2
													  px-2
													  py-1
													  rounded
													  shadow
													  description
													  lg:group-hover/desc:block
													  lg:w-[200px]
													  lg:text-wrap
                                                  "
									>
										Password must be of 8 characters or more.
									</FormDescription>
									<div className="flex flex-col w-full group/mob-desc">
										<FormControl>
											<Input
												autoComplete="off"
												type="password"
												disabled={isLoading}
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
					<Button disabled={isLoading} className="button" type="submit">
						<UserPlus className="mr-2" />
						{isLoading ? "Registering..." : "Register"}
					</Button>
				</form>
			</Form>
		</div>
	)
}