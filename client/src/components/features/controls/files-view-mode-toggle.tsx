import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/common/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/common/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/common/select';
import { filesPersistStore } from '@/libs/store/files/files.persist-store';
import {
    TypeChangeFilesViewModeSchema,
    changeFilesViewModeSchema,
    useFilesViewModes,
} from '@/schemas/files/change-files-view-mode.schema';

interface FilesViewModeToggleProps {
    isMobile: boolean;
}

const FilesViewModeToggle = ({ isMobile }: FilesViewModeToggleProps) => {
    const { filesViewModes } = useFilesViewModes();
    const filesViewMode = filesPersistStore(state => state.filesViewMode);
    const setFilesViewMode = filesPersistStore(state => state.setFilesViewMode);

    const formFilesViewMode = useForm<TypeChangeFilesViewModeSchema>({
        resolver: zodResolver(changeFilesViewModeSchema),
        values: {
            mode: filesViewMode,
        },
    });

    if (isMobile) {
        return (
            <Form {...formFilesViewMode}>
                <FormField
                    control={formFilesViewMode.control}
                    name="mode"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={value => {
                                        field.onChange(value);
                                        formFilesViewMode.handleSubmit(data => {
                                            setFilesViewMode(data.mode);
                                        })();
                                    }}
                                    defaultValue={field.value}
                                    className="flex flex-col"
                                >
                                    {Object.entries(filesViewModes).map(
                                        ([type, { icon: Icon, title }]) => (
                                            <FormItem
                                                key={type}
                                                className="flex items-center gap-3"
                                            >
                                                <FormLabel className="[&:has([data-state=unchecked])]:text-muted-foreground flex cursor-pointer items-center gap-2 font-normal">
                                                    <FormControl className="sr-only">
                                                        <RadioGroupItem
                                                            value={type}
                                                        />
                                                    </FormControl>

                                                    <Icon
                                                        strokeWidth={2}
                                                        className="size-[20px]"
                                                    />
                                                    {title}
                                                </FormLabel>
                                            </FormItem>
                                        ),
                                    )}
                                </RadioGroup>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </Form>
        );
    }

    return (
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
    );
};

export default FilesViewModeToggle;
