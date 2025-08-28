'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronsUpDown, LogOut, Moon, Settings, Sun } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/common/avatar';
import { Button } from '@/components/ui/common/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/common/dropdown-menu';
import { Form, FormField } from '@/components/ui/common/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/common/select';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/common/sidebar';
import { Skeleton } from '@/components/ui/common/skeleton';
import { logoutMutationFn } from '@/libs/api/auth/auth-api';
import { APP_ROUTES } from '@/libs/constants/routes';
import { setLanguage } from '@/libs/i18n/language';
import { getFallbackAvatarInitials } from '@/libs/utils/getFallbackAvatarInitials';
import {
    TypeChangeLanguageSchema,
    changeLanguageSchema,
} from '@/schemas/user/change-language.schema';

const languages = {
    ru: 'Русский',
    en: 'English',
};

export function NavUser({
    name,
    email,
    avatar,
    isLoading,
}: {
    name: string;
    email: string;
    avatar: string;
    isLoading: boolean;
}) {
    const locale = useLocale();
    const router = useRouter();
    const { setTheme } = useTheme();
    const { isMobile } = useSidebar();
    const t = useTranslations('layouts.sidebar.navUser');
    const queryClient = useQueryClient();

    const form = useForm({
        resolver: zodResolver(changeLanguageSchema),
        values: {
            language: locale as TypeChangeLanguageSchema['language'],
        },
    });

    const [isPending, startTransition] = useTransition();

    function onSubmit(data: TypeChangeLanguageSchema) {
        startTransition(async () => {
            try {
                await setLanguage(data.language);
            } catch {
                return;
            }
        });
    }

    const logoutMutation = useMutation({
        mutationFn: logoutMutationFn,
        onSuccess: () => {
            queryClient.removeQueries();
            router.push(APP_ROUTES.LOGIN);
        },
        onError: () => {
            toast.error(t('logoutError'));
        },
    });

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="bg-sidebar-accent h-8 w-8">
                                <AvatarImage
                                    src={avatar || '/'}
                                    alt={name || '/'}
                                />
                                <AvatarFallback>
                                    {getFallbackAvatarInitials(name)}
                                </AvatarFallback>
                            </Avatar>

                            {isLoading ? (
                                <div className="flex h-full w-full flex-col justify-between">
                                    <Skeleton className="h-[14px] w-[60%] rounded-lg" />
                                    <Skeleton className="h-[12px] w-full rounded-lg" />
                                </div>
                            ) : (
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {email}
                                    </span>
                                </div>
                            )}

                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'top'}
                        align="start"
                        sideOffset={8}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Form {...form}>
                                    <FormField
                                        control={form.control}
                                        name="language"
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={value => {
                                                    field.onChange(value);
                                                    form.handleSubmit(
                                                        onSubmit,
                                                    )();
                                                }}
                                                value={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(
                                                        languages,
                                                    ).map(([code, name]) => (
                                                        <SelectItem
                                                            key={code}
                                                            value={code}
                                                            disabled={isPending}
                                                        >
                                                            {name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </Form>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="shrink-0 grow"
                                        >
                                            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                            <span className="sr-only">
                                                Toggle theme
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => setTheme('light')}
                                        >
                                            {t('themeSwitcher.light')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setTheme('dark')}
                                        >
                                            {t('themeSwitcher.dark')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setTheme('system')}
                                        >
                                            {t('themeSwitcher.system')}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={() =>
                                    router.push(
                                        APP_ROUTES.DASHBOARD.SETTINGS.path,
                                    )
                                }
                            >
                                <Settings />
                                {t('settings')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => logoutMutation.mutate()}
                            >
                                <LogOut />
                                {t('logout')}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
