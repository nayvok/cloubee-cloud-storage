import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

interface UseMobileProps {
    breakpoints?: number;
}

export function useIsMobile({
    breakpoints = MOBILE_BREAKPOINT,
}: UseMobileProps = {}) {
    const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${breakpoints - 1}px)`);
        const onChange = () => {
            setIsMobile(window.innerWidth < breakpoints);
        };
        mql.addEventListener('change', onChange);
        setIsMobile(window.innerWidth < breakpoints);
        return () => mql.removeEventListener('change', onChange);
    }, [breakpoints]);

    return !!isMobile;
}
