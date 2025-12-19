import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface OptionsEditorProps {
    value?: string;
    onChange: (val: string) => void;
}

export const OptionsEditor = ({ 
    value = '', 
    onChange 
}: OptionsEditorProps) => {
    const [inputValue, setInputValue] = useState('');
    
    // Parse the comma-separated string into an array of tags, removing empty ones
    const tags = value.split(',').map(t => t.trim()).filter(Boolean);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                const newTags = [...tags, newTag];
                onChange(newTags.join(', '));
                setInputValue('');
            }
        }
    };

    const removeTag = (indexToRemove: number) => {
        const newTags = tags.filter((_, index) => index !== indexToRemove);
        onChange(newTags.join(', '));
    };

    return (
        <div className="space-y-2">
             <label className="text-xs font-semibold uppercase tracking-wider text-brand-primary/80 ml-1">
                Dropdown Options
            </label>
            <div className="flex flex-wrap gap-2 p-3 min-h-[48px] rounded-xl border border-brand-border bg-brand-input focus-within:ring-2 focus-within:ring-brand-primary/50 focus-within:border-brand-primary transition-all">
                {tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(i)}
                            className="ml-1.5 hover:text-white focus:outline-none"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? "Type option and press Enter..." : "Add..."}
                    className="flex-1 bg-transparent border-none text-sm text-brand-text placeholder:text-gray-500 focus:outline-none min-w-[120px]"
                />
            </div>
            <p className="text-xs text-brand-muted ml-1">Example: "Red", press Enter, "Blue", press Enter.</p>
        </div>
    );
};
