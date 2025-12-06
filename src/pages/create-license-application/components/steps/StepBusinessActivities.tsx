import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/base/input/input';
import { useListActivities, useSearchActivities, type BusinessActivity } from '@/queries';
import type { BusinessActivitySelection } from '../types';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    // Debounce search query - wait 300ms after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch initial activities list
    const { data: activitiesListData, isLoading: isLoadingList } = useListActivities({
        limit: 100,
    });

    // Search activities (only when query is at least 2 characters)
    const { data: searchResults, isLoading: isSearching } = useSearchActivities({
        q: debouncedSearchQuery,
        limit: 20,
    });

    // Use search results if searching, otherwise use the full list
    const availableActivities: BusinessActivity[] = useMemo(() => {
        const activities = debouncedSearchQuery.length >= 2 
            ? (searchResults || [])
            : (activitiesListData?.items || []);
        
        // Filter out already selected activities
        return activities.filter(
            activity => !selectedActivities.some(
                selected => selected.activity_id === parseInt(activity.id)
            )
        );
    }, [debouncedSearchQuery, searchResults, activitiesListData, selectedActivities]);

    const isLoading = isLoadingList || isSearching;

    const handleAddActivity = (activityId: string) => {
        if (selectedActivities.length >= 3) return;

        const activity = availableActivities.find(a => a.id === activityId);
        if (!activity) return;

        const newActivity: BusinessActivitySelection = {
            activity_id: parseInt(activityId),
            is_main: selectedActivities.length === 0, // First one is main by default
            name: activity.name, // Save the name for display
        };
        onActivitiesChange([...selectedActivities, newActivity]);
        setSearchQuery(''); // Clear search after selection
    };

    const handleRemoveActivity = (activityId: number) => {
        const newActivities = selectedActivities.filter(a => a.activity_id !== activityId);
        
        // If we removed the main activity, make the first remaining one main
        if (newActivities.length > 0 && !newActivities.some(a => a.is_main)) {
            newActivities[0].is_main = true;
        }
        
        onActivitiesChange(newActivities);
    };

    const toggleMainActivity = (activityId: number) => {
        onActivitiesChange(
            selectedActivities.map(a => ({
                ...a,
                is_main: a.activity_id === activityId,
            }))
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-primary mb-2">Business Activities</h2>
                <p className="text-md text-tertiary">
                    Select 1 to 3 business activities for your company. These will define the scope of your business operations.
                </p>
            </div>

            {/* Selected Activities */}
            {selectedActivities.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-secondary">Selected Activities ({selectedActivities.length}/3)</p>
                    </div>
                    <div className="space-y-2">
                        {selectedActivities.map((selected) => {
                            // Try to get full details from loaded data
                            const fullActivity = activitiesListData?.items.find(
                                a => a.id === selected.activity_id.toString()
                            ) || searchResults?.find(
                                a => a.id === selected.activity_id.toString()
                            );

                            const displayName = selected.name || fullActivity?.name || `Activity ID: ${selected.activity_id}`;
                            
                            return (
                                <div
                                    key={selected.activity_id}
                                    className="flex items-start gap-3 p-4 rounded-lg bg-secondary ring-1 ring-border-primary"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-semibold text-primary">
                                                {displayName}
                                            </p>
                                            {selected.is_main && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-solid text-white font-medium">
                                                    Main Activity
                                                </span>
                                            )}
                                        </div>
                                        {fullActivity?.description && (
                                            <p className="text-xs text-tertiary line-clamp-2">{fullActivity.description}</p>
                                        )}
                                        {fullActivity && (
                                            <div className="flex items-center gap-2 mt-2 text-xs text-tertiary">
                                                {fullActivity.code && <span>Code: {fullActivity.code}</span>}
                                                {fullActivity.license_type && <span>• {fullActivity.license_type}</span>}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {!selected.is_main && selectedActivities.length > 1 && (
                                            <button
                                                onClick={() => toggleMainActivity(selected.activity_id)}
                                                className="text-xs px-3 py-1.5 rounded-md text-brand-solid hover:bg-brand-solid hover:text-white transition-colors whitespace-nowrap"
                                            >
                                                Set as Main
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleRemoveActivity(selected.activity_id)}
                                            className="text-xs px-3 py-1.5 rounded-md text-error-primary hover:bg-error-primary hover:text-white transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Search and Add */}
            {selectedActivities.length < 3 && (
                <div className="space-y-3">
                    <p className="text-sm font-semibold text-secondary">
                        {selectedActivities.length === 0 ? 'Search for Activities' : 'Add More Activities'}
                    </p>
                    
                    {/* Search Input */}
                    <Input
                        placeholder="Type to search activities (min 2 characters)..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                        // iconLeading={FileSearch01}
                        size="md"
                        hint={error}
                        isInvalid={!!error}
                    />

                    {/* Search Results */}
                    {searchQuery.length >= 2 && (
                        <div className="space-y-2">
                            {isLoading ? (
                                <div className="text-center py-8 text-sm text-tertiary">
                                    Searching...
                                </div>
                            ) : availableActivities.length > 0 ? (
                                <div className="max-h-96 overflow-y-auto space-y-1 border border-border-primary rounded-lg p-2">
                                    {availableActivities.map((activity) => (
                                        <button
                                            key={activity.id}
                                            onClick={() => handleAddActivity(activity.id)}
                                            className="w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors group"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-primary group-hover:text-brand-solid">
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
                                                </div>
                                                <span className="text-xs text-brand-solid opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    + Add
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-sm text-tertiary">
                                    No activities found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}

                    {searchQuery.length > 0 && searchQuery.length < 2 && (
                        <p className="text-xs text-tertiary text-center py-4">
                            Type at least 2 characters to search
                        </p>
                    )}
                </div>
            )}

            {selectedActivities.length >= 3 && (
                <div className="text-center py-4 px-6 rounded-lg bg-secondary border border-border-primary">
                    <p className="text-sm text-tertiary">
                        Maximum of 3 activities selected. Remove one to add a different activity.
                    </p>
                </div>
            )}
        </div>
    );
};
