import { HardDrive } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/common/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/common/dropdown-menu';
import { Progress } from '@/components/ui/common/progress';
import {
    SidebarGroup,
    SidebarMenuButton,
} from '@/components/ui/common/sidebar';
import { Skeleton } from '@/components/ui/common/skeleton';
import { convertBytes } from '@/libs/utils/convert-bytes';

interface DiskUsageProps {
    usedQuota: number;
    storageQuota: number;
    isLoading?: boolean;
}

const DiskUsageProgress = ({
    usedQuota,
    storageQuota,
    isLoading,
}: DiskUsageProps) => {
    return (
        <>
            {isLoading ? (
                <>
                    <Skeleton className="mt-1 mb-1 h-4 w-full" />
                    <div className="flex h-4 justify-between transition duration-1000">
                        <Skeleton className="h-3 w-[30px]" />
                        <Skeleton className="h-3 w-[30px]" />
                    </div>
                </>
            ) : (
                <>
                    <Progress
                        value={(usedQuota * 100) / storageQuota}
                        className="mt-1 mb-1 h-4"
                    />
                    <div className="flex justify-between text-xs transition duration-1000">
                        <span>{convertBytes(usedQuota)}</span>
                        <span className="text-sidebar-foreground/70">
                            {convertBytes(storageQuota)}
                        </span>
                    </div>
                </>
            )}
        </>
    );
};

const DiskUsageSidebar = ({
    usedQuota,
    storageQuota,
    isLoading,
}: DiskUsageProps) => {
    return (
        <SidebarGroup className="">
            <Card className="min-w-[220px] bg-transparent opacity-100 transition-opacity delay-200 duration-500 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:delay-0 group-data-[collapsible=icon]:duration-0">
                <CardContent className="overflow-hidden pt-6">
                    <DiskUsageProgress
                        isLoading={isLoading}
                        usedQuota={usedQuota}
                        storageQuota={storageQuota}
                    />
                </CardContent>
            </Card>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="size-0 overflow-hidden p-0 opacity-0 transition-opacity delay-0 duration-500 group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:delay-200">
                        <HardDrive />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side="top"
                    align="start"
                    sideOffset={4}
                    className="p-2"
                >
                    <DiskUsageProgress
                        usedQuota={usedQuota}
                        storageQuota={storageQuota}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarGroup>
    );
};

export default DiskUsageSidebar;
