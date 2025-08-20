import { LucideIcon } from 'lucide-react';
import { PropsWithChildren } from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/common/card';

interface SettingsCardProps extends PropsWithChildren {
    icon: LucideIcon;
    title: string;
    description: string;
}

const SettingsCard = ({
    icon,
    title,
    description,
    children,
}: SettingsCardProps) => {
    const Icon = icon;

    return (
        <Card className="border-0">
            <CardHeader>
                <CardTitle className="inline-flex items-center gap-1 text-xl">
                    <Icon className="text-muted-foreground" />
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="border-t py-6">
                <div className="min-h-[25vh]">{children}</div>
            </CardContent>
        </Card>
    );
};

export default SettingsCard;
