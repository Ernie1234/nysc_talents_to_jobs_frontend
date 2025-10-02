// pages/attendance-scanner.tsx
import { useState } from "react";
import { QrCode, Calendar, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { QrScanner } from "@/components/dashboard/courses/ScanQR";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AttendanceScannerPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("scanner");

  if (!user || (user.role !== "CORPS_MEMBER" && user.role !== "SIWES")) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">🚫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600 mb-4">
            Only corps members can access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Attendance Scanner
        </h1>
        <p className="text-gray-600">
          Scan QR codes to mark your attendance for courses
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scanner" className="flex items-center space-x-2">
            <QrCode className="h-4 w-4" />
            <span>QR Scanner</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Attendance History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-6">
          {/* Scanner Section */}
          <div className="flex justify-center">
            <QrScanner onScanComplete={() => setActiveTab("history")} />
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How to use the scanner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                  <Clock className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Timing</p>
                  <p className="text-sm text-gray-600">
                    QR codes are only valid during class sessions and expire
                    after a short time
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                  <BookOpen className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Requirements</p>
                  <p className="text-sm text-gray-600">
                    You must be enrolled in the course and physically present in
                    class
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>
                Your attendance records across all enrolled courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No attendance records yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Scan a QR code during your next class session to record
                  attendance.
                </p>
                <Button onClick={() => setActiveTab("scanner")}>
                  Go to Scanner
                </Button>
              </div>

              {/* You can add actual attendance history here later */}
              {/* {attendanceRecords.map((record) => ( ... ))} */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceScannerPage;
