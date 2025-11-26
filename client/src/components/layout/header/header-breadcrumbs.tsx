import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Fragment } from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/common/breadcrumb';
import { Separator } from '@/components/ui/common/separator';
import { SidebarTrigger } from '@/components/ui/common/sidebar';
import { generateBreadcrumbs } from '@/libs/utils/generate-breadcrumbs';

interface HeaderBreadcrumbsProps {
    pathname: string;
}

const HeaderBreadcrumbs = ({ pathname }: HeaderBreadcrumbsProps) => {
    const t = useTranslations();
    const breadcrumbs = generateBreadcrumbs(pathname, t);

    return (
        <div className="flex grow items-center gap-2 overflow-hidden px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
                <BreadcrumbList>
                    {breadcrumbs.map((breadcrumb, index) => (
                        <Fragment key={breadcrumb.path}>
                            <BreadcrumbItem>
                                {breadcrumb.path === pathname ? (
                                    <BreadcrumbPage>
                                        {breadcrumb.title}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link
                                            href={breadcrumb.path}
                                            scroll={false}
                                        >
                                            {breadcrumb.title}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {index < breadcrumbs.length - 1 && (
                                <BreadcrumbSeparator />
                            )}
                        </Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};

export default HeaderBreadcrumbs;
