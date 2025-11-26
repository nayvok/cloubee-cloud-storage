import { LoaderCircle } from 'lucide-react';

const CircleCenteredLoader = () => {
    return (
        <div className="flex size-full items-center justify-center">
            <LoaderCircle className="size-12 animate-spin" strokeWidth={1} />
        </div>
    );
};

export default CircleCenteredLoader;
