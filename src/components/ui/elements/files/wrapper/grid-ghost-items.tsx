import { cn } from '@/libs/utils/tw-merge';
import { TypeChangeFilesViewModeSchema } from '@/schemas/files/change-files-view-mode.schema';

interface GridGhostItemsProps {
    viewMode: TypeChangeFilesViewModeSchema['mode'];
    itemsCount?: number;
}

const GridGhostItems = ({ viewMode, itemsCount = 15 }: GridGhostItemsProps) => {
    const getViewModeWidth = () => {
        if (viewMode === 'largeTile') {
            return 'w-[144px]';
        } else if (viewMode === 'tile') {
            return 'w-[104px]';
        } else {
            return '';
        }
    };

    return (
        <>
            {viewMode !== 'list' &&
                Array.from({ length: itemsCount }).map((_, index) => {
                    return (
                        <div
                            key={index}
                            className={cn('h-0', getViewModeWidth())}
                        ></div>
                    );
                })}
        </>
    );
};

export default GridGhostItems;
