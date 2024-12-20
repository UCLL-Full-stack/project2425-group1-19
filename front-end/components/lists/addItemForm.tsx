import React, {useState} from 'react';
import {Item} from '@/types';
import {useTranslation} from 'next-i18next';

type Props = {
    onAddItem: (item: Item, newShoppingListName?: string) => void;
    onNeedRefresh: () => void;
    shoppingListName: string;
};

const AddItemForm: React.FC<Props> = ({onAddItem, onNeedRefresh, shoppingListName}) => {
    const [newItem, setNewItem] = useState<Item>({
        name: '',
        description: '',
        price: 0,
        urgency: 'mid'
    });
    const [listName, setListName] = useState<string>(shoppingListName);
    const [toAddListName, setToAddListName] = useState<string>(shoppingListName);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { t } = useTranslation();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setNewItem(prevItem => ({
            ...prevItem,
            [name]: value
        }));
    };

    const validateItem = (item: Item): string | null => {
        setErrorMessage(null);

        if (typeof item.name !== 'string' || item.name.length > 40) {
            return t('lists.form.validate.name');
        }

        if (typeof item.description !== 'string' || item.description.length > 240) {
            return t('lists.form.validate.description');
        }

        if (!item.price) {
            return t('lists.form.validate.price');
        }


        const validUrgencies: string[] = ['low', 'mid', 'high'];
        if (item.urgency !== undefined && !validUrgencies.includes(item.urgency)) {
            return t('lists.form.validate.urgency');
        }

        return null;
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateItem(newItem);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        setErrorMessage(null);

        if (!shoppingListName && toAddListName) {
            onAddItem(newItem, toAddListName);
        } else {
            onAddItem(newItem);
        }

        // Reset the form after adding the item
        setNewItem({
            name: '',
            description: '',
            price: 0,
            urgency: 'mid'
        });
        setListName('');

        //Refresh lists
        await onNeedRefresh()
    };
    const isFormValid = newItem.name && newItem.description;

    return (
        <div className="flex flex-col items-center p-4">
            <h3 className='text-xl font-semibold mt-6 mb-2'>{t("lists.form.title")}</h3>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            <form onSubmit={handleAddItem} className="w-full max-w-lg bg-transparent p-6 rounded-lg shadow-md">
                {listName === '' && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ListName">
                            {t("lists.form.listname")}
                        </label>
                        <input
                            type="text"
                            name="ListName"
                            id="ListName"
                            placeholder={t("lists.form.placeholder.listname")}
                            value={toAddListName}
                            onChange={(e) => setToAddListName(e.target.value)}
                            autoCorrect='false'
                            autoComplete='false'
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        {t("lists.form.itemname")}
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder={t("lists.form.placeholder.itemname")}
                        value={newItem.name}
                        onChange={handleChange}
                        autoCorrect='false'
                        autoComplete='false'
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        {t("lists.form.description")}
                    </label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        placeholder={t("lists.form.placeholder.description")}
                        value={newItem.description}
                        onChange={handleChange}
                        autoCorrect='false'
                        autoComplete='false'
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                        {t("lists.form.price")}
                    </label>
                    <input
                        type="number"
                        min={0}
                        max={100000}
                        name="price"
                        id="price"
                        placeholder={t("lists.form.placeholder.price")}
                        value={newItem.price}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="urgency">
                        {t("lists.form.urgency")}
                    </label>
                    <select
                        name="urgency"
                        id="urgency"
                        value={newItem.urgency}
                        onChange={handleChange}
                        autoCorrect='false'
                        autoComplete='false'
                        required
                        className="w-full px-3 py-2 border rounded"
                    >
                        <option value="low">{t("lists.form.placeholder.1")}</option>
                        <option value="mid">{t("lists.form.placeholder.2")}</option>
                        <option value="high">{t("lists.form.placeholder.3")}</option>
                    </select>
                </div>
                <div className="mb-4">
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        // onSubmit={(e) => {e.preventDefault(); handleAddItem();}}
                        className="w-full bg-blue-500 text-white px-3 py-2 rounded disabled:opacity-50"
                    >
                        {t("lists.form.submit")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddItemForm;
