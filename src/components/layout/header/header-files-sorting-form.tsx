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
    TypeChangeFilesSortModSchema,
    changeFilesSortModeSchema,
    filesSortMods,
} from '@/schemas/files/change-files-sort-mode';
import {
    TypeChangeFilesViewModSchema,
    changeFilesViewModeSchema,
    filesViewMods,
} from '@/schemas/files/change-files-view-mode';

const HeaderFilesSortingForm = () => {
    const filesViewMode = filesPersistStore(state => state.filesViewMode);
    const setFilesViewMode = filesPersistStore(state => state.setFilesViewMode);

    const filesSortMode = filesPersistStore(state => state.filesSortMode);
    const setFilesSortMode = filesPersistStore(state => state.setFilesSortMode);

    const formFilesViewMode = useForm<TypeChangeFilesViewModSchema>({
        resolver: zodResolver(changeFilesViewModeSchema),
        values: {
            mode: filesViewMode,
        },
    });

    const formFilesSortMode = useForm<TypeChangeFilesSortModSchema>({
        resolver: zodResolver(changeFilesSortModeSchema),
        values: {
            mode: filesSortMode,
        },
    });

    return (
        <div className="mx-4 flex gap-2">
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
                                {Object.entries(filesSortMods).map(
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
                    render={({ field }) => (
                        <Select
                            onValueChange={value => {
                                field.onChange(value);
                                formFilesViewMode.handleSubmit(data => {
                                    setFilesViewMode(data.mode);
                                })();
                            }}
                            value={field.value}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(filesViewMods).map(
                                    ([type, { icon: Icon, title }]) => (
                                        <SelectItem key={type} value={type}>
                                            <Icon
                                                strokeWidth={0.5}
                                                className=""
                                            />
                                            {title}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                    )}
                />
            </Form>
        </div>
    );
};

export default HeaderFilesSortingForm;
