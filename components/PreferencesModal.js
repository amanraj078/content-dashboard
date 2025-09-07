"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "@/store/preferencesSlice";

const allCategories = ["technology", "sports", "finance", "movies", "music"];

export default function PreferencesModal({ open, onClose }) {
    const dispatch = useDispatch();
    const selected = useSelector((state) => state.preferences.categories);
    const [localSelection, setLocalSelection] = useState(selected);

    const toggleCategory = (category) => {
        setLocalSelection((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const save = () => {
        dispatch(setCategories(localSelection));
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
                <h2 className="text-lg font-bold mb-4">Select Categories</h2>
                <div className="space-y-2">
                    {allCategories.map((cat) => (
                        <label
                            key={cat}
                            className="flex items-center space-x-2"
                        >
                            <input
                                type="checkbox"
                                checked={localSelection.includes(cat)}
                                onChange={() => toggleCategory(cat)}
                            />
                            <span>{cat}</span>
                        </label>
                    ))}
                </div>
                <div className="flex justify-end mt-4 gap-2">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={save}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
