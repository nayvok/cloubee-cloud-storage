import {
    FILE_ICON_CONFIG,
    FileIconCategory,
    FileIconType,
    SPECIAL_FILES,
} from '@/libs/constants/file-icons';

export const getFileIcon = (
    mimeType: string | null,
    fileName: string,
    isFolder?: boolean,
) => {
    if (isFolder) return FILE_ICON_CONFIG.folder.icon;

    const normalizedName = fileName.toLowerCase();
    const specialEntry = Object.entries(SPECIAL_FILES).find(
        ([name]) => normalizedName === name,
    );

    if (specialEntry) {
        return FILE_ICON_CONFIG[specialEntry[1]].icon;
    }

    const entries = Object.entries(FILE_ICON_CONFIG) as [
        FileIconType,
        FileIconCategory,
    ][];

    const extension = fileName.includes('.')
        ? fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
        : '';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extMatch = entries.find(([_, config]) =>
        config.extensions?.includes(extension),
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mimeMatch = entries.find(([_, config]) =>
        config.mime?.some(mime => mimeType?.startsWith(mime.replace('/*', ''))),
    );

    return (
        (extMatch && extMatch[1].icon) ||
        (mimeMatch && mimeMatch[1].icon) ||
        FILE_ICON_CONFIG.default.icon
    );
};
