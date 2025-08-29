import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ComponentProps, PropsWithChildren, ReactNode } from 'react';

interface BigPictureWrapperProps extends PropsWithChildren {
    onPrev: () => void;
    onNext: () => void;
    onPrevDisabled: boolean;
    onNextDisabled: boolean;
    onOpenChange: () => void;
    groupableButtons?: ReactNode;
}

export const BigPictureGroupableButton = ({
    children,
    ...props
}: PropsWithChildren & ComponentProps<'button'>) => {
    return (
        <button
            className="flex size-9 items-center justify-center rounded-md p-2 text-white"
            {...props}
        >
            {children}
        </button>
    );
};

const BigPictureWrapper = ({
    onPrev,
    onNext,
    onOpenChange,
    children,
    onPrevDisabled,
    onNextDisabled,
    groupableButtons,
}: BigPictureWrapperProps) => {
    return (
        <div className="fixed top-0 left-0 z-[200] size-full bg-black">
            <div className="absolute top-0 left-0 z-[300] flex w-full items-center justify-end p-2">
                <div className="flex rounded-lg bg-black/30">
                    {groupableButtons}
                    <button
                        className="flex size-9 items-center justify-center rounded-md p-2 text-white"
                        onClick={onOpenChange}
                    >
                        <X className="size-full" />
                    </button>
                </div>
            </div>

            {!onPrevDisabled && (
                <div className="absolute top-[50%] left-5 z-3 -translate-y-[50%]">
                    <button
                        onClick={onPrev}
                        className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-black/30 p-2 text-white"
                    >
                        <ChevronLeft className="size-10" />
                    </button>
                </div>
            )}

            {!onNextDisabled && (
                <div className="absolute top-[50%] right-5 z-3 -translate-y-[50%]">
                    <button
                        onClick={onNext}
                        className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-black/30 p-2 text-white"
                    >
                        <ChevronRight className="size-10" />
                    </button>
                </div>
            )}

            <div className="relative h-full max-w-full">{children}</div>
        </div>
    );
};

export default BigPictureWrapper;
