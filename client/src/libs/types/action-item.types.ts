import { LucideIcon } from 'lucide-react';

export type ActionItem = {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    show: boolean;
};
