import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/libs/i18n/request.ts');

const nextConfig: NextConfig = {
    reactStrictMode: true,
    allowedDevOrigins: ['http://192.168.0.193:8080', 'http://localhost:8080'],
};

export default withNextIntl(nextConfig);
