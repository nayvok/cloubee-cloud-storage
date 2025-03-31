import { zodResolver } from '@hookform/resolvers/zod';
import { ListFilter } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/common/button';
import { Form, FormField } from '@/components/ui/common/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/common/select';
import { filesPersistStore } from '@/libs/store/files/files.persist-store';
import { cn } from '@/libs/utils/tw-merge';
import {
    TypeChangeFilesSortModeSchema,
    changeFilesSortModeSchema,
    useFilesSortModes,
} from '@/schemas/files/change-files-sort-mode.schema';
import {
    TypeChangeFilesViewModeSchema,
    changeFilesViewModeSchema,
    useFilesViewModes,
} from '@/schemas/files/change-files-view-mode.schema';

const HeaderFilesSortingForm = () => {
    const { filesViewModes } = useFilesViewModes();
    const filesViewMode = filesPersistStore(state => state.filesViewMode);
    const setFilesViewMode = filesPersistStore(state => state.setFilesViewMode);

    const { filesSortModes } = useFilesSortModes();
    const filesSortMode = filesPersistStore(state => state.filesSortMode);
    const setFilesSortMode = filesPersistStore(state => state.setFilesSortMode);

    const filesSortDirection = filesPersistStore(
        state => state.filesSortDirection,
    );

    const setFilesSortDirection = filesPersistStore(
        state => state.setFilesSortDirection,
    );

    const formFilesViewMode = useForm<TypeChangeFilesViewModeSchema>({
        resolver: zodResolver(changeFilesViewModeSchema),
        values: {
            mode: filesViewMode,
        },
    });

    const formFilesSortMode = useForm<TypeChangeFilesSortModeSchema>({
        resolver: zodResolver(changeFilesSortModeSchema),
        values: {
            mode: filesSortMode,
        },
    });

    return (
        <div className="mx-4 flex gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={setFilesSortDirection}
            >
                <ListFilter
                    strokeWidth={3}
                    className={cn(
                        'text-foreground h-[1.2rem] w-[1.2rem] scale-100 rotate-180 text-white transition-all',
                        filesSortDirection === 'desc' && 'scale-0',
                    )}
                />
                <ListFilter
                    strokeWidth={3}
                    className={cn(
                        'absolute h-[1.2rem] w-[1.2rem] scale-100 transition-all',
                        filesSortDirection === 'asc' && 'scale-0',
                    )}
                />
            </Button>

            <Form {...formFilesSortMode}>
                <FormField
                    control={formFilesSortMode.control}
                    name="mode"
                    render={({ field }) => (
                        <Select
                            onValueChange={value => {
                                field.onChange(value);
                                formFilesSortMode.handleSubmit(data => {
                                    setFilesSortMode(data.mode);
                                })();
                            }}
                            value={field.value}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(filesSortModes).map(
                                    ([type, { title }]) => (
                                        <SelectItem key={type} value={type}>
                                            {title}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                    )}
                />
            </Form>

            <Form {...formFilesViewMode}>
                <FormField
                    control={formFilesViewMode.control}
                    name="mode"
                    render={({ field }) => {
                        const selectedMode = filesViewModes[field.value];

                        return (
                            <Select
                                onValueChange={value => {
                                    field.onChange(value);
                                    formFilesViewMode.handleSubmit(data => {
                                        setFilesViewMode(data.mode);
                                    })();
                                }}
                                value={field.value}
                            >
                                <SelectTrigger className="w-[66px]">
                                    <SelectValue asChild>
                                        {selectedMode && (
                                            <selectedMode.icon
                                                strokeWidth={2.1}
                                                className="text-foreground size-[20px]"
                                            />
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent align="end">
                                    {Object.entries(filesViewModes).map(
                                        ([type, { icon: Icon, title }]) => (
                                            <SelectItem key={type} value={type}>
                                                <div className="flex items-center gap-2">
                                                    <Icon strokeWidth={2} />
                                                    <span>{title}</span>
                                                </div>
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        );
                    }}
                />
            </Form>
        </div>
    );
};

export default HeaderFilesSortingForm;
