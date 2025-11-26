'use server';

import { cookies, headers } from 'next/headers';

import {
    COOKIE_NAME,
    Language,
    defaultLanguage,
    languages,
} from '@/libs/i18n/config';

export async function getBrowserLanguage() {
    const lang = (await headers())
        .get('accept-language')
        ?.split(',')[0]
        ?.split('-')[0];
    return lang || defaultLanguage;
}

export async function getCurrentLanguage() {
    const cookiesStore = await cookies();

    const systemLanguage = await getBrowserLanguage();
    const cookieLanguage = cookiesStore.get(COOKIE_NAME)?.value;

    if (cookieLanguage) {
        return cookieLanguage;
    } else if (languages.includes(systemLanguage as Language)) {
        return systemLanguage;
    } else {
        return defaultLanguage;
    }
}

export async function setLanguage(language: Language) {
    const cookiesStore = await cookies();

    return cookiesStore.set(COOKIE_NAME, language);
}
