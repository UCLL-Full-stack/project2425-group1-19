import React, { useState } from 'react';
import { Profile } from '@/types';
import { addProfile, fetchProfiles, addUser } from '@/service/profileService';
import { useTranslation } from 'next-i18next';

interface AddProfileFormProps {
    onProfileAdded: () => void;
}

const AddProfileForm: React.FC<AddProfileFormProps> = ({ onProfileAdded }) => {
    const [newProfile, setNewProfile] = useState<Profile>({
        userId: 0,
        email: '',
        name: '',
        lastName: '',
    });
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // New state for success message
    const { t } = useTranslation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const validateProfile = (profile: Profile): string | null => {
        if (!profile.email || profile.email.length > 240) {
            return 'Email is required and must be less than 240 characters';
        }
        if (!profile.name || profile.name.length > 100) {
            return 'Name is required and must be less than 100 characters';
        }
        if (!profile.lastName || profile.lastName.length > 100) {
            return 'Last name is required and must be less than 100 characters';
        }
        return null;
    };

    const validateUser = (username: string, password: string): string | null => {
        if (!username || username.length > 50) {
            return 'Username is required and must be less than 50 characters';
        }
        if (!password || password.length < 6) {
            return 'Password is required and must be at least 6 characters long';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Fetch existing profiles to determine new userId
            const profiles = await fetchProfiles();

            // Find the highest userId and increment it
            const highestUserId = profiles.reduce(
                (maxId: number, profile: Profile) => {
                    return Math.max(maxId, profile.userId);
                },
                0
            );

            const newUserId = highestUserId + 1;

            // Update the profile with the new userId
            const profileToSubmit = { ...newProfile, userId: newUserId };

            // Validate the profile fields
            const profileValidationError = validateProfile(profileToSubmit);
            if (profileValidationError) {
                setErrorMessage(profileValidationError);
                return;
            }

            // Validate the user fields
            const userValidationError = validateUser(username, password);
            if (userValidationError) {
                setErrorMessage(userValidationError);
                return;
            }

            // Submit the profile
            const profileResult = await addProfile(profileToSubmit);
            console.log('Profile added successfully:', profileResult);

            // Create the user with the same userId
            const userResult = await addUser({ id: newUserId, username, password, role: 'adult' }); // Added role here
            console.log('User added successfully:', userResult);

            // Reset the form after successful submission
            setNewProfile({
                userId: 0,
                email: '',
                name: '',
                lastName: '',
            });
            setUsername('');
            setPassword('');
            setErrorMessage(null);

            // Set success message
            setSuccessMessage('Profile and user added successfully!');

            // Call the callback to refetch profiles
            onProfileAdded();

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);

        } catch (error) {
            console.error('Failed to add profile and user:', error);
            setErrorMessage('Failed to add profile and user');
        }
    };

    const isFormValid = newProfile.email && newProfile.name && newProfile.lastName && username && password;

    return (
        <div className="flex flex-col items-center p-4">
            <h3 className="text-xl font-semibold mt-6 mb-2">{t("profile.form.title")}</h3>
            {errorMessage && <p className="text-red-500 mb-4">{t("profile.form.failed")}</p>}
            {successMessage && <p className="text-green-500 mb-4">{t("profile.form.success")}</p>} {/* Success message */}
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-transparent p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        {t("profile.form.email")}
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder={t("profile.form.placeholder.email")}
                        value={newProfile.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        {t("profile.form.name")}
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder={t("profile.form.placeholder.name")}
                        value={newProfile.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                        {t("profile.form.lastname")}
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder={t("profile.form.placeholder.lastname")}
                        value={newProfile.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        {t("profile.form.username")}
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder={t("profile.form.placeholder.username")}
                        value={username}
                        onChange={handleUserChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        {t("profile.form.password")}
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder={t("profile.form.placeholder.password")}
                        value={password}
                        onChange={handleUserChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className="w-full bg-blue-500 text-white px-3 py-2 rounded disabled:opacity-50"
                    >
                        Add Profile and User
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProfileForm;
