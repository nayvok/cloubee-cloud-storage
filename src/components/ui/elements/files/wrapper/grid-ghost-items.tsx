import { cn } from '@/libs/utils/tw-merge';
import { TypeChangeFilesViewModeSchema } from '@/schemas/files/change-files-view-mode.schema';

interface GridGhostItemsProps {
    viewMode: TypeChangeFilesViewModeSchema['mode'];
    itemsCount?: number;
}

const GridGhostItems = ({ viewMode, itemsCount = 15 }: GridGhostItemsProps) => {
    return (
        <>
            {viewMode !== 'list' &&
                Array.from({ length: itemsCount }).map((_, index) => (
                    <div
                        key={index}
                        className={cn(
                            'h-0',
                            viewMode === 'largeTile'
                                ? 'w-[144px]'
                                : viewMode === 'tile'
                                  ? 'w-[104px]'
                                  : '',
                        )}
                    ></div>
                ))}
        </>
    );
};

export default GridGhostItems;
