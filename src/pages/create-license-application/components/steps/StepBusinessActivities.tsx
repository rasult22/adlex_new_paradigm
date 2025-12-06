import { useState, useMemo, useEffect, useRef } from 'react';
import { Input } from '@/components/base/input/input';
import { useSearchActivities, type BusinessActivity } from '@/queries';
import type { BusinessActivitySelection } from '../types';
import { X } from '@untitledui/icons';

interface ActivityInputProps {
    index: number;
    isMain: boolean;
    isRequired: boolean;
    selectedActivity: BusinessActivitySelection | null;
    onSelect: (activity: BusinessActivity) => void;
    onClear: () => void;
    error?: string;
}

const ActivityInput = ({
    index,
    isMain,
    isRequired,
    selectedActivity,
    onSelect,
    onClear,
    error,
}: ActivityInputProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Search activities
    const { data: searchResults, isLoading } = useSearchActivities({
        q: debouncedSearchQuery,
        limit: 20,
    });

    const availableActivities: BusinessActivity[] = useMemo(() => {
        if (debouncedSearchQuery.length < 2) return [];
        return searchResults || [];
    }, [debouncedSearchQuery, searchResults]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (activity: BusinessActivity) => {
        onSelect(activity);
        setSearchQuery('');
        setIsFocused(false);
    };

    const label = isMain 
        ? 'Main Business Activity' 
        : `Additional Activity ${index}`;

    // If activity is selected, show it as a readonly input with clear button
    if (selectedActivity) {
        // Build hint text with description and code/license_type
        const hintParts: string[] = [];
        if (selectedActivity.description) {
            hintParts.push(selectedActivity.description);
        }
        const codeLicenseParts: string[] = [];
        if (selectedActivity.code) {
            codeLicenseParts.push(`Code: ${selectedActivity.code}`);
        }
        if (selectedActivity.license_type) {
            codeLicenseParts.push(selectedActivity.license_type);
        }
        if (codeLicenseParts.length > 0) {
            hintParts.push(codeLicenseParts.join(' • '));
        }

        return (
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-secondary">
                        {label}
                        {isRequired && <span className="text-error-primary ml-1">*</span>}
                    </label>
                    {isMain && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-brand-solid text-white font-medium">
                            Main
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary ring-1 ring-border-primary">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary truncate">
                            {selectedActivity.name}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClear}
                        className="p-1 rounded-md text-tertiary hover:text-error-primary hover:bg-error-secondary transition-colors"
                        aria-label="Clear selection"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                {/* Activity details hint */}
                {hintParts.length > 0 && (
                    <div className="text-sm text-tertiary space-y-1">
                        {selectedActivity.description && (
                            <p>{selectedActivity.description}</p>
                        )}
                        {codeLicenseParts.length > 0 && (
                            <p>{codeLicenseParts.join(' • ')}</p>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Show search input
    return (
        <div className="space-y-1" ref={containerRef}>
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-secondary">
                    {label}
                    {isRequired && <span className="text-error-primary ml-1">*</span>}
                </label>
                {!isRequired && (
                    <span className="text-xs text-tertiary">(Optional)</span>
                )}
            </div>
            <div className="relative">
                <Input
                    placeholder="Type to search activities (min 2 characters)..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onFocus={() => setIsFocused(true)}
                    size="md"
                    hint={error}
                    isInvalid={!!error}
                />

                {/* Search Results Dropdown */}
                {isFocused && searchQuery.length >= 2 && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-64 overflow-y-auto bg-primary border border-border-primary rounded-lg shadow-lg">
                        {isLoading ? (
                            <div className="text-center py-4 text-sm text-tertiary">
                                Searching...
                            </div>
                        ) : availableActivities.length > 0 ? (
                            <div className="p-1">
                                {availableActivities.map((activity) => (
                                    <button
                                        key={activity.id}
                                        type="button"
                                        onClick={() => handleSelect(activity)}
                                        className="w-full text-left p-3 rounded-md hover:bg-secondary transition-colors"
                                    >
                                        <p className="text-sm font-medium text-primary">
                                            {activity.name}
                                        </p>
                                        {activity.description && (
                                            <p className="text-xs text-tertiary mt-0.5 line-clamp-2">
                                                {activity.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 mt-1 text-xs text-tertiary">
                                            {activity.code && <span>Code: {activity.code}</span>}
                                            {activity.license_type && <span>• {activity.license_type}</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-sm text-tertiary">
                                No activities found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}

                {isFocused && searchQuery.length > 0 && searchQuery.length < 2 && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-primary border border-border-primary rounded-lg shadow-lg">
                        <p className="text-xs text-tertiary text-center py-3">
                            Type at least 2 characters to search
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

interface StepBusinessActivitiesProps {
    selectedActivities: BusinessActivitySelection[];
    onActivitiesChange: (activities: BusinessActivitySelection[]) => void;
    error?: string;
}

export const StepBusinessActivities = ({
    selectedActivities,
    onActivitiesChange,
    error,
}: StepBusinessActivitiesProps) => {
    // Get activity for each slot (0 = main, 1 = additional 1, 2 = additional 2)
    const getActivityForSlot = (slotIndex: number): BusinessActivitySelection | null => {
        if (slotIndex === 0) {
            // Main activity slot - find the one marked as main, or first if none marked
            return selectedActivities.find(a => a.is_main) || selectedActivities[0] || null;
        }
        // Additional slots - find non-main activities
        const nonMainActivities = selectedActivities.filter(a => !a.is_main);
        return nonMainActivities[slotIndex - 1] || null;
    };

    const handleSelectActivity = (slotIndex: number, activity: BusinessActivity) => {
        const newActivity: BusinessActivitySelection = {
            activity_id: parseInt(activity.id),
            is_main: slotIndex === 0,
            name: activity.name,
            description: activity.description,
            code: activity.code,
            license_type: activity.license_type,
        };

        // Check if this activity is already selected in another slot
        const existingIndex = selectedActivities.findIndex(
            a => a.activity_id === parseInt(activity.id)
        );

        if (existingIndex !== -1) {
            // Activity already selected, don't add duplicate
            return;
        }

        // Add new activity
        onActivitiesChange([...selectedActivities, newActivity]);
    };

    const handleClearActivity = (slotIndex: number) => {
        const activityToClear = getActivityForSlot(slotIndex);
        if (!activityToClear) return;

        let newActivities = selectedActivities.filter(
            a => a.activity_id !== activityToClear.activity_id
        );

        // If we cleared the main activity and there are others, make the first one main
        if (slotIndex === 0 && newActivities.length > 0) {
            newActivities = newActivities.map((a, index) => ({
                ...a,
                is_main: index === 0,
            }));
        }

        onActivitiesChange(newActivities);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-primary mb-2">Business Activities</h2>
                <p className="text-md text-tertiary">
                    Select your main business activity (required) and up to 2 additional activities (optional). These will define the scope of your business operations.
                </p>
            </div>

            <div className="space-y-4">
                {/* Main Activity (Required) */}
                <ActivityInput
                    index={0}
                    isMain={true}
                    isRequired={true}
                    selectedActivity={getActivityForSlot(0)}
                    onSelect={(activity) => handleSelectActivity(0, activity)}
                    onClear={() => handleClearActivity(0)}
                    error={error}
                />

                {/* Additional Activity 1 (Optional) */}
                <ActivityInput
                    index={1}
                    isMain={false}
                    isRequired={false}
                    selectedActivity={getActivityForSlot(1)}
                    onSelect={(activity) => handleSelectActivity(1, activity)}
                    onClear={() => handleClearActivity(1)}
                />

                {/* Additional Activity 2 (Optional) */}
                <ActivityInput
                    index={2}
                    isMain={false}
                    isRequired={false}
                    selectedActivity={getActivityForSlot(2)}
                    onSelect={(activity) => handleSelectActivity(2, activity)}
                    onClear={() => handleClearActivity(2)}
                />
            </div>
        </div>
    );
};
