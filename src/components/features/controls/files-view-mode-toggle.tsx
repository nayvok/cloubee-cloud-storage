import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Form, FormField } from '@/components/ui/common/form';
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

const FilesViewModeToggle = () => {
    const { filesViewModes } = useFilesViewModes();
    const filesViewMode = filesPersistStore(state => state.filesViewMode);
    const setFilesViewMode = filesPersistStore(state => state.setFilesViewMode);

    const formTrashViewMode = useForm<TypeChangeFilesViewModeSchema>({
        resolver: zodResolver(changeFilesViewModeSchema),
        values: {
            mode: filesViewMode,
        },
    });

    return (
        <Form {...formTrashViewMode}>
            <FormField
                control={formTrashViewMode.control}
                name="mode"
                render={({ field }) => {
                    const selectedMode = filesViewModes[field.value];

                    return (
                        <Select
                            onValueChange={value => {
                                field.onChange(value);
                                formTrashViewMode.handleSubmit(data => {
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
