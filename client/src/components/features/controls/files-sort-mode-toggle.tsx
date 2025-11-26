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
    TypeChangeFilesSortModeSchema,
    changeFilesSortModeSchema,
    useFilesSortModes,
} from '@/schemas/files/change-files-sort-mode.schema';

interface FilesSortModeToggleProps {
    isMobile: boolean;
}

const FilesSortModeToggle = ({ isMobile }: FilesSortModeToggleProps) => {
    const { filesSortModes } = useFilesSortModes();
    const filesSortMode = filesPersistStore(state => state.filesSortMode);
    const setFilesSortMode = filesPersistStore(state => state.setFilesSortMode);

    const formFilesSortMode = useForm<TypeChangeFilesSortModeSchema>({
        resolver: zodResolver(changeFilesSortModeSchema),
        values: {
            mode: filesSortMode,
        },
    });
    if (isMobile) {
        return (
            <Form {...formFilesSortMode}>
                <FormField
                    control={formFilesSortMode.control}
                    name="mode"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={value => {
                                        field.onChange(value);
                                        formFilesSortMode.handleSubmit(data => {
                                            setFilesSortMode(data.mode);
                                        })();
                                    }}
                                    defaultValue={field.value}
                                    className="flex flex-col"
                                >
                                    {Object.entries(filesSortModes).map(
                                        ([type, { title }]) => (
                                            <FormItem
                                                key={type}
                                                className="flex items-center gap-3"
                                            >
                                                <FormLabel className="[&:has([data-state=unchecked])]:text-muted-foreground flex cursor-pointer items-center gap-2 font-normal">
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            value={type}
                                                        />
                                                    </FormControl>
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
    );
};

export default FilesSortModeToggle;
