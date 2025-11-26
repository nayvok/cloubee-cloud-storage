import { LoaderCircle } from 'lucide-react';

const SettingsLoader = () => {
    return (
        <div className="text-muted-foreground inline-flex size-full min-h-[25vh] items-center justify-center gap-2 text-sm">
            <span>Loading...</span>
            <LoaderCircle className="size-5 animate-spin" />
        </div>
    );
};

export default SettingsLoader;
