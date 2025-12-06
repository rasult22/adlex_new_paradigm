import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { AppLayout } from '../../components/app-layout';
import { 
    createLicenseApplication,
    useLicenseApplications,
    type LicenseApplicationStatus,
} from '@/queries';
import { Button } from '@/components/base/buttons/button';
import { Plus, Eye, ArrowRight } from '@untitledui/icons';
import { useNavigate } from 'react-router';
import { Table, TableCard } from '@/components/application/table/table';
import { TableBody } from 'react-aria-components';
import { BadgeWithDot } from '@/components/base/badges/badges';
import { PaginationCardDefault } from '@/components/application/pagination/pagination';
import { LoadingIndicator } from '@/components/application/loading-indicator/loading-indicator';

// Generate a unique session ID
const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Status badge color mapping
const statusColors: Record<LicenseApplicationStatus, 'gray' | 'brand' | 'warning' | 'success' | 'error'> = {
    draft: 'gray',
    submitted: 'brand',
    in_progress: 'warning',
    approved: 'success',
    rejected: 'error',
};

// Status display labels
const statusLabels: Record<LicenseApplicationStatus, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    in_progress: 'In Progress',
    approved: 'Approved',
    rejected: 'Rejected',
};

// Format date to readable string
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const ITEMS_PER_PAGE = 10;

export const HomeScreen = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    // Fetch applications with pagination
    const { data: applicationsData, isLoading } = useLicenseApplications({
        limit: ITEMS_PER_PAGE,
        offset: (page - 1) * ITEMS_PER_PAGE,
    });

    const applications = applicationsData?.items || [];
    const totalItems = applicationsData?.total || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Mutation for creating license application
    const createApplicationMutation = useMutation({
        mutationFn: createLicenseApplication,
        onSuccess: (data) => {
            navigate(`/create-license-application?application_id=${data.id}&session_id=${data.session_id}`);
        },
        onError: (error: Error) => {
            console.error('Failed to create license application:', error);
        },
    });

    const handleStart = () => {
        const sessionId = generateSessionId();
        createApplicationMutation.mutate(sessionId);
    };

    const handleViewApplication = (applicationId: string, sessionId: string) => {
        navigate(`/create-license-application?application_id=${applicationId}&session_id=${sessionId}`);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <AppLayout>
            <div className="flex h-dvh flex-row bg-primary">
                <motion.div 
                    layout
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="border-l border-border-primary w-full py-8 flex flex-col"
                >
                    {/* Header */}
                    <div className='px-8 flex justify-between items-center mb-6'>
                        <div className='font-semibold text-[24px] leading-[32px]'>
                            Applications
                        </div>
                        <Button 
                            isLoading={createApplicationMutation.isPending} 
                            iconLeading={Plus} 
                            size="lg" 
                            onClick={handleStart}
                        >
                            Submit an application
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-8 overflow-auto">
                        {isLoading ? (
                            // Loading state
                            <div className="flex items-center justify-center h-64">
                                <LoadingIndicator size="md" />
                            </div>
                        ) : applications.length === 0 ? (
                            // Empty state
                            <div className="flex flex-col w-full bg-primary h-full items-center justify-center">
                                <div className="text-center space-y-4">
                                    <h3 className="text-xl font-semibold text-primary">Ready to start your company in IFZA?</h3>
                                    <p className="text-md text-tertiary">
                                        Submit your application now with Adlex AI
                                    </p>
                                    <Button 
                                        isLoading={createApplicationMutation.isPending} 
                                        iconLeading={Plus} 
                                        size="lg" 
                                        onClick={handleStart}
                                    >
                                        Submit an application
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // Applications table
                            <TableCard.Root>
                                <TableCard.Header 
                                    title="Your Applications" 
                                    badge={totalItems.toString()}
                                    description="Manage and track your license applications"
                                />
                                <Table aria-label="Applications table">
                                    <Table.Header>
                                        <Table.Head>Company Names</Table.Head>
                                        <Table.Head>Status</Table.Head>
                                        <Table.Head>Activities</Table.Head>
                                        <Table.Head>Progress</Table.Head>
                                        <Table.Head>Created</Table.Head>
                                        <Table.Head>Actions</Table.Head>
                                    </Table.Header>
                                    <TableBody items={applications}>
                                        {(application) => (
                                            <Table.Row key={application.id}>
                                                <Table.Cell>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-sm font-medium text-primary">
                                                            {application.company_name_1 || 'Not specified'}
                                                        </span>
                                                        {application.company_name_2 && (
                                                            <span className="text-xs text-tertiary">
                                                                Alt: {application.company_name_2}
                                                            </span>
                                                        )}
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <BadgeWithDot color={statusColors[application.status]} size="sm">
                                                        {statusLabels[application.status]}
                                                    </BadgeWithDot>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div className="flex flex-col gap-0.5">
                                                        {application.business_activities && application.business_activities.length > 0 ? (
                                                            <>
                                                                <span className="text-sm text-primary">
                                                                    {application.business_activities.find(a => a.is_main)?.name || 
                                                                     application.business_activities[0]?.name || 
                                                                     'N/A'}
                                                                </span>
                                                                {application.business_activities.length > 1 && (
                                                                    <span className="text-xs text-tertiary">
                                                                        +{application.business_activities.length - 1} more
                                                                    </span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-sm text-tertiary">Not selected</span>
                                                        )}
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-brand-solid rounded-full transition-all"
                                                                style={{ width: `${application.completion_percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-tertiary">
                                                            {application.completion_percentage}%
                                                        </span>
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <span className="text-sm text-tertiary whitespace-nowrap">
                                                        {formatDate(application.created_at)}
                                                    </span>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Button
                                                        size="sm"
                                                        color="link-gray"
                                                        iconLeading={application.status === 'draft' ? ArrowRight : Eye}
                                                        onClick={() => handleViewApplication(application.id, application.session_id)}
                                                    >
                                                        {application.status === 'draft' ? 'Continue' : 'View'}
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                    </TableBody>
                                </Table>
                                
                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <PaginationCardDefault
                                        page={page}
                                        total={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                )}
                            </TableCard.Root>
                        )}
                    </div>
                </motion.div>
            </div>
        </AppLayout>
    );
};

