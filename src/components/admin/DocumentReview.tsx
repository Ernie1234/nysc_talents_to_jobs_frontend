/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Eye, FileText, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} from "@/features/admin/adminAPI";
import { toast } from "sonner";

const statusColors = {
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  SUSPENDED: "bg-orange-100 text-orange-800",
  PENDING: "bg-yellow-100 text-yellow-800",
};

interface DocumentWithUser {
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  status: "ACCEPTED" | "REJECTED" | "SUSPENDED" | "PENDING";
  documents: Array<{
    fileName: string;
    fileUrl: string;
    fileType: "ppa_letter" | "request_letter";
    fileSize: number;
    uploadedAt: Date;
    description?: string;
  }>;
  onboardingCompleted: boolean;
  createdAt: string;
}

export const DocumentReview: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<{
    user: any;
    document: any;
  } | null>(null);

  const { data, isLoading, refetch } = useGetAllUsersQuery({
    page: 1,
    limit: 50,
    // Only get users with documents
  });

  const [updateUserStatus] = useUpdateUserStatusMutation();

  const handleStatusUpdate = async (userId: string, newStatus: string) => {
    try {
      await updateUserStatus({ userId, status: newStatus }).unwrap();
      toast.success(`Document ${newStatus.toLowerCase()} successfully`);
      refetch();
      setSelectedDocument(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  // Transform users data to include documents from user profile
  const documentsToReview: DocumentWithUser[] = React.useMemo(() => {
    if (!data?.data?.users) return [];

    return data.data.users
      .filter(
        (user: any) =>
          (user.role === "CORPS_MEMBER" || user.role === "SIWES") &&
          user.onboardingCompleted &&
          user.profile?.status === "PENDING"
      )
      .map((user: any) => ({
        userId: user.id || user._id,
        userName: user.fullName || `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        role: user.role,
        status: user.profile?.status || "PENDING",
        documents: [], // In real implementation, this would come from user profile documents
        onboardingCompleted: user.onboardingCompleted,
        createdAt: user.createdAt,
      }));
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Review</CardTitle>
          <CardDescription>Loading documents...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Document Review</CardTitle>
          <CardDescription>
            Review and approve PPA letters and request documents from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documentsToReview.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No documents to review
              </h3>
              <p className="text-gray-600">
                All submitted documents have been reviewed or no new
                submissions.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentsToReview.map((item) => (
                  <TableRow key={item.userId}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.userEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.role}</Badge>
                    </TableCell>
                    <TableCell>
                      {item.role === "CORPS_MEMBER"
                        ? "PPA Letter"
                        : "Request Letter"}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[item.status]}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedDocument({ user: item, document: null })
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleStatusUpdate(item.userId, "ACCEPTED")
                          }
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleStatusUpdate(item.userId, "REJECTED")
                          }
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Document Preview Dialog */}
      <Dialog
        open={!!selectedDocument}
        onOpenChange={() => setSelectedDocument(null)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Review Document</DialogTitle>
            <DialogDescription>
              Review and approve the submitted document
            </DialogDescription>
          </DialogHeader>

          {selectedDocument && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">User Information</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <strong>Name:</strong> {selectedDocument.user.userName}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedDocument.user.userEmail}
                    </p>
                    <p>
                      <strong>Role:</strong> {selectedDocument.user.role}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedDocument.user.status}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Document Information</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <strong>Type:</strong>{" "}
                      {selectedDocument.user.role === "CORPS_MEMBER"
                        ? "PPA Letter"
                        : "Request Letter"}
                    </p>
                    <p>
                      <strong>Submitted:</strong>{" "}
                      {new Date(
                        selectedDocument.user.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-center space-x-4">
                  <FileText className="h-16 w-16 text-blue-600" />
                  <div>
                    <p className="font-medium">Document Preview</p>
                    <p className="text-sm text-muted-foreground">
                      Document preview would be displayed here
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Note: Integrate with your file storage system to display
                      actual documents
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedDocument(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleStatusUpdate(selectedDocument.user.userId, "REJECTED")
                  }
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() =>
                    handleStatusUpdate(selectedDocument.user.userId, "ACCEPTED")
                  }
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
