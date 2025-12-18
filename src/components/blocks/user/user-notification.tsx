"use client"
import { GlobalContext } from "@/components/providers/contexts/global-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import NotificationService from "@/lib/api/NotificationService";
import { Bell, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Notification } from "@/models/notification";

export default function UserNotification() {
    const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 5;

    const global = useContext(GlobalContext);
    const currentUser = global?.user?.userId;

    const totalPages = Math.ceil(allNotifications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNotifications = allNotifications.slice(startIndex, endIndex);

    const fetchNotifiByUserId = async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            const res = await NotificationService.getNotiByUser(currentUser);
            if (res.data) {
                setAllNotifications(res.data);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifiByUserId();
    }, [currentUser]);

    const handlePageChange = (page : number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const renderSkeletons = () => {
        return Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="border shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-5 w-12" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                </CardContent>
            </Card>
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Bell className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Notifications</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage all your notifications
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-xl font-semibold">{allNotifications.length}</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchNotifiByUserId}
                        disabled={loading}
                        className="gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>
        
            {loading && (
                <div className="space-y-4">
                    {renderSkeletons()}
                </div>
            )}

            {!loading && currentNotifications.map(ntf => (
                <Card
                    key={ntf.notificationId}
                    className="border shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                            <CardTitle className="text-base font-semibold">
                                {ntf.notification?.title || "No title"}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs">
                                New
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {ntf.notification?.content || "No content"}
                        </p>
                    </CardContent>
                </Card>
            ))}

            {!loading && allNotifications.length === 0 && (
                <div className="text-center py-12">
                    <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                    <p className="text-gray-500">You don't have any notifications yet.</p>
                </div>
            )}

            {!loading && totalPages > 1 && (
                <div className="mt-8">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="gap-1"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                            </PaginationItem>

                            {getPageNumbers().map((page, index) => (
                                <PaginationItem key={index}>
                                    {page === '...' ? (
                                        <span className="px-2 text-gray-400">...</span>
                                    ) : (
                                        <Button
                                            variant={currentPage === page ? "default" : "ghost"}
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => handlePageChange(page as number)}
                                        >
                                            {page}
                                        </Button>
                                    )}
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="gap-1"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                    <div className="text-center mt-3 text-sm text-gray-500">
                        Page {currentPage} of {totalPages}
                        <span className="mx-2">•</span>
                        Showing {currentNotifications.length} of {allNotifications.length} notifications
                    </div>
                </div>
            )}
        </div>
    );
}