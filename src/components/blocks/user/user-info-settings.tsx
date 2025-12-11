import { GlobalContext, useUser } from "@/components/providers/contexts/global-context";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ObjectState, useObjectState } from "@/hooks/use-object-state";
import { User } from "@/models/user";
import { FormEvent, useContext, useEffect, useState } from "react";
import RecipientService from "@/lib/api/RecipientService";
import { Recipient } from "@/models/recipient";
import { toast } from "sonner";
import UserService from "@/lib/api/UserService";
import AuthService from "@/lib/api/AuthService";
import { AxiosError } from "axios";

export function UserInfoSettings() {
    const { user } = useUser();
    const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);
    const [isDeleteAccountOpen, setDeleteAccountOpen] = useState(false);

    return (
        <div className="text-sm *:mb-12 *:*:mb-6 *:*:*:mb-3">
            <section>
                <h3 className="text-3xl font-heading leading-none">Account information</h3>
                <UserInfoForm user={user} />
            </section>
            <section>
                <h3 className="text-3xl font-heading leading-none">Delivery details</h3>
                <p className="-my-4">We&apos;ll use this info for future orders.</p>
                <UserRecipientForm user={user} />
            </section>
            <section>
                <h3 className="text-3xl font-heading leading-none">Danger zone</h3>
                <section>
                    <h4 className="text-2xl font-heading leading-none">Change login information</h4>
                    <p className="flex flex-wrap gap-1">
                        <Button variant="secondary" onClick={() => setChangePasswordOpen(true)}>
                            Change password
                        </Button>
                    </p>
                </section>
                <section>
                    <h4 className="text-2xl font-heading leading-none">Delete account</h4>
                    <p>We&apos;ll miss you.</p>
                    <p>
                        <Button variant="destructive" onClick={() => setDeleteAccountOpen(true)}>
                            Delete account
                        </Button>
                    </p>
                </section>
            </section>

            <ChangePasswordDialog isOpen={isChangePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
            <DeleteAccountDialog isOpen={isDeleteAccountOpen} onClose={() => setDeleteAccountOpen(false)} />
        </div>
    );
}

export function UserInfoForm(
    { user } : {
        user: User | undefined | null
    }
) {
    const globals = useContext(GlobalContext);

    const formState = useObjectState({
        fullName: "",
        email: ""
    });
    const [isInit, setIsInit] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    const isDisabled = isBusy || !user;

    useEffect(() => {
        if (user && !isInit) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsInit(true);
            formState.set.fullName(user.fullName);
            formState.set.email(user.email);
        }
    }, [user, isInit])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        formState.set[name as keyof typeof formState.set](value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsBusy(true);
        UserService.update(user!.userId, formState.fullName, formState.email).then(() => {
            toast.success("Account info updated successfully");
            globals.set.user({
                ...globals.user!,
                fullName: formState.fullName,
                email: formState.email,
            })
        }).catch((e) => {
            toast.error(e.response?.data?.message ?? "Something went wrong")
        }).finally(() => {
            setIsBusy(false);
        })
        console.log("Form submitted:", formState);
    };

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <FieldSet>
                    <Field>
                        <FieldLabel className="m-0">Display name</FieldLabel>
                        <Input
                            name="fullName"
                            value={formState.fullName}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>
                </FieldSet>
                <FieldSet>
                    <Field>
                        <FieldLabel className="m-0">Email address</FieldLabel>
                        <Input
                            name="email"
                            value={formState.email}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>
                </FieldSet>
                <FieldSet>
                    <div>
                        <Button type="submit" disabled={isDisabled}>Save changes</Button>
                    </div>
                </FieldSet>
            </FieldGroup>
        </form>
    );
}

export function UserRecipientForm(
    { user } : {
        user: User | undefined | null
    }
) {

    const formState = useObjectState({
        recipientId: 0,
        userId: user?.userId,
        fullName: "",
        addressLine: "",
        province: "",
        ward: "",
        city: "",
        phoneNumber: "",
        isDefault: true
    }) as ObjectState<Recipient>;
    const [isInit, setIsInit] = useState(false);
    const [isBusy, setIsBusy] = useState(!user);
    const [isNew, setIsNew] = useState(false);
    const isDisabled = isBusy || !user;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        formState.set[name as keyof typeof formState.set](value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsBusy(true);
        RecipientService[isNew ? "post" : "put"](formState).then(() => {
            toast.success("Delivery info updated successfully")
        }).catch((e) => {
            toast.error(e.response?.data?.message ?? "Something went wrong")
        }).finally(() => {
            setIsBusy(false);
        })
    };
    
    useEffect(() => {
        if (user && !isInit) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsInit(true);
            setIsBusy(true);
            RecipientService.fromSelf().then(({data}) => {
                let defaultRecipient: Recipient | null = null;
                for (const recipient of data) if (recipient.isDefault) {
                    defaultRecipient = recipient;
                    for (const prop in recipient) {
                        // @ts-expect-error this should be the same type
                        formState.set[prop as keyof Recipient]?.(recipient[prop]);
                    }
                    break;
                }
                console.log(defaultRecipient?.recipientId);
                formState.set.isDefault(true);
                setIsNew(!defaultRecipient?.recipientId);
                setIsBusy(false);
            })
        }
    }, [user, isInit])

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <div className="grid md:grid-cols-2 gap-5">
                    <FieldSet>
                        <Field>
                            <FieldLabel className="m-0">Recipient&apos;s full name</FieldLabel>
                            <Input
                                name="fullName"
                                required
                                value={formState.fullName}
                                onChange={handleInputChange}
                                disabled={isDisabled}
                            />
                        </Field>
                    </FieldSet>
                    <FieldSet>
                        <Field>
                            <FieldLabel className="m-0">Phone number</FieldLabel>
                            <Input
                                name="phoneNumber"
                                required
                                value={formState.phoneNumber}
                                onChange={handleInputChange}
                                disabled={isDisabled}
                            />
                        </Field>
                    </FieldSet>
                </div>
                <FieldSet>
                    <Field>
                        <FieldLabel className="m-0">Address line</FieldLabel>
                        <Input
                            name="addressLine"
                            required
                            value={formState.addressLine}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                        />
                    </Field>
                </FieldSet>
                <div className="grid md:grid-cols-2 gap-5">
                    <FieldSet>
                        <Field>
                            <FieldLabel className="m-0">Province</FieldLabel>
                            <Input
                                name="province"
                                required
                                value={formState.province}
                                onChange={handleInputChange}
                                disabled={isDisabled}
                            />
                        </Field>
                    </FieldSet>
                    <FieldSet>
                        <Field>
                            <FieldLabel className="m-0">Ward</FieldLabel>
                            <Input
                                name="ward"
                                required
                                value={formState.ward}
                                onChange={handleInputChange}
                                disabled={isDisabled}
                            />
                        </Field>
                    </FieldSet>
                </div>
                <FieldSet>
                    <div>
                        <Button type="submit" disabled={isDisabled}>Save changes</Button>
                    </div>
                </FieldSet>
            </FieldGroup>
        </form>
    );
}

function ChangePasswordDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");

    const [isBusy, setIsBusy] = useState(false);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        AuthService.changePassword(currentPassword, newPassword, newPassword2).then(() => {
            toast.success("Changed password successfully");
            onClose();
        }).catch((e) => {
            toast.error(e.response?.data?.message ?? "Something went wrong")
        }).finally(() => {
            setIsBusy(false);
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Change password</DialogTitle>
                    </DialogHeader>
                    <FieldSet className="my-6">
                        <Field>
                            <FieldLabel>Current password</FieldLabel>
                            <Input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                disabled={isBusy}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel>New password</FieldLabel>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={isBusy}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Retype new password</FieldLabel>
                            <Input
                                type="password"
                                value={newPassword2}
                                onChange={(e) => setNewPassword2(e.target.value)}
                                disabled={isBusy}                                
                                required
                            />
                        </Field>
                    </FieldSet>
                    <DialogFooter>
                        <Button variant="secondary" type="button" disabled={isBusy} onClick={onClose}>Cancel</Button>
                        <Button className="ml-auto" type="submit" disabled={isBusy}>Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteAccountDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete account</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <DialogFooter>
                    <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                    <Button className="ml-auto" variant="destructive">Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
