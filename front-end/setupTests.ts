import '@testing-library/jest-dom';

// Mock useTranslation from next-i18next
jest.mock('next-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key, // Return the key as the translation
        i18n: {
            changeLanguage: jest.fn(), // Mock changeLanguage function
        },
    }),
}));