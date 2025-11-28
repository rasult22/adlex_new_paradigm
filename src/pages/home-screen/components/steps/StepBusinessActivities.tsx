import { useEffect, useState } from 'react';
import { Select } from '@/components/base/select/select';
import type { BusinessActivity } from '../types';

interface StepBusinessActivitiesProps {
    selectedActivities: string[];
    onActivitiesChange: (activities: string[]) => void;
    error?: string;
}

export const StepBusinessActivities = ({
    selectedActivities,
    onActivitiesChange,
    error,
}: StepBusinessActivitiesProps) => {
    const [activities, setActivities] = useState<BusinessActivity[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch initial activities list
        const fetchActivities = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/v1/activities');
                const data = await response.json();
                setActivities(data);
            } catch (error) {
                console.error('Failed to fetch activities:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const handleSearch = async (query: string) => {
        if (!query.trim()) return;
        
        try {
            const response = await fetch(`/api/v1/activities/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error('Failed to search activities:', error);
        }
    };

    const handleSelectionChange = (activityId: string) => {
        if (selectedActivities.includes(activityId)) {
            // Remove if already selected
            onActivitiesChange(selectedActivities.filter(id => id !== activityId));
        } else if (selectedActivities.length < 3) {
            // Add if less than 3 selected
            onActivitiesChange([...selectedActivities, activityId]);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-primary mb-2">Business Activities</h2>
                <p className="text-md text-tertiary">
                    Select 1 to 3 business activities for your company. These will define the scope of your business operations.
                </p>
            </div>

            <div className="space-y-4">
                <div className="text-sm text-tertiary">
                    Selected: {selectedActivities.length} / 3
                </div>

                {/* Activity Search/Select */}
                <Select.ComboBox
                    label="Search and Select Activities"
                    placeholder="Search for business activities..."
                    size="md"
                    isInvalid={!!error}
                    hint={error}
                    items={activities.map(activity => ({
                        id: activity.id,
                        label: activity.label,
                        supportingText: activity.description,
                    }))}
                    onInputChange={handleSearch}
                >
                    {(item) => (
                        <Select.Item key={item.id} id={item.id}>
                            {item.label}
                        </Select.Item>
                    )}
                </Select.ComboBox>

                {/* Selected Activities Display */}
                {selectedActivities.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-secondary">Selected Activities:</p>
                        <div className="space-y-2">
                            {selectedActivities.map((activityId) => {
                                const activity = activities.find(a => a.id === activityId);
                                return activity ? (
                                    <div
                                        key={activityId}
                                        className="flex items-center justify-between p-3 rounded-lg bg-secondary ring-1 ring-border-primary"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-primary">{activity.label}</p>
                                            {activity.description && (
                                                <p className="text-xs text-tertiary">{activity.description}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleSelectionChange(activityId)}
                                            className="text-sm text-error-primary hover:text-error-primary_hover"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
