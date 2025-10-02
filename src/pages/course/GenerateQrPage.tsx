/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, QrCode, CheckCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react"; // Use named import instead of default

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGenerateQrSessionMutation,
  useGetCourseQuery,
} from "@/features/courses/courseAPI";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const GenerateQrPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [duration, setDuration] = useState<number>(15);
  const [generatedQr, setGeneratedQr] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  console.log("Generated QR page - Course ID:", courseId);
  console.log("Generated QR page - Generated QR:", generatedQr);

  const { data: courseData, isLoading: courseLoading } = useGetCourseQuery(
    courseId!
  );
  const [generateQr, { isLoading: generating }] =
    useGenerateQrSessionMutation();

  const course = courseData?.data;

  useEffect(() => {
    if (generatedQr) {
      const expiresAt = new Date(generatedQr.expiresAt).getTime();
      const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.max(0, expiresAt - now);
        setTimeLeft(Math.ceil(remaining / 1000));
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [generatedQr]);

  if (!user || (user.role !== "STAFF" && user.role !== "ADMIN")) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">🚫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600">
            Only staff members can generate QR codes.
          </p>
        </div>
      </div>
    );
  }

  const handleGenerateQr = async () => {
    try {
      const result = await generateQr({
        courseId: courseId!,
        duration,
      }).unwrap();
      setGeneratedQr(result.data);
      toast.success("QR code generated successfully!");
    } catch (error: any) {
      console.error("Generate QR error:", error);
      toast.error(error?.data?.message || "Failed to generate QR code");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Generate a scan URL that students can use

  if (courseLoading) {
    return <QrSkeleton />;
  }

  if (!course) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Course Not Found
          </h3>
          <p className="text-gray-600 mb-4">
            The course you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/courses/${courseId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generate QR Code</h1>
          <p className="text-gray-600 mt-1">
            Create a QR code for {course.title} attendance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code Settings</CardTitle>
            <CardDescription>
              Configure the QR code duration and generate a new session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-medium text-gray-900 w-12">
                  {duration}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                How long the QR code will be valid for students to scan
              </p>
            </div>

            <Button
              onClick={handleGenerateQr}
              disabled={generating}
              className="w-full"
              size="lg"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating QR Code...
                </>
              ) : (
                <>
                  <QrCode className="h-5 w-5 mr-2" />
                  Generate QR Code
                </>
              )}
            </Button>

            {generatedQr && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">QR Code Generated!</span>
                </div>
                <p className="text-sm text-green-700">
                  Share this QR code with students. It will expire in{" "}
                  {formatTime(timeLeft)}.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* QR Code Display */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
            <CardDescription>
              {generatedQr
                ? `Valid for ${formatTime(
                    timeLeft
                  )} - Students can scan this code`
                : "Generate a QR code to display it here"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[400px]">
            {generatedQr ? (
              <>
                {/* Actual QR Code Display */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <QRCodeSVG
                    value={generatedQr.qrData}
                    size={256}
                    level="H" // High error correction
                    includeMargin
                    fgColor="#000000"
                    bgColor="#ffffff"
                  />
                </div>

                {/* Session Information */}
                <div className="w-full space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-blue-600 font-medium">
                        Session Code
                      </span>
                      <code className="text-lg font-mono font-bold text-blue-800 mt-1">
                        {generatedQr.qrSession.sessionCode}
                      </code>
                    </div>

                    <div className="flex flex-col items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm text-orange-600 font-medium">
                        Time Remaining
                      </span>
                      <span className="text-lg font-bold text-orange-800 mt-1">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {/* <div className="flex gap-2">
                    <Button
                      onClick={downloadQRCode}
                      variant="outline"
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Info
                    </Button>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="flex-1"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Data
                        </>
                      )}
                    </Button>
                  </div> */}

                  {/* Scan URL for easy sharing */}
                  {/* <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2 text-center">
                      Scan URL (for manual entry):
                    </p>
                    <code className="text-xs bg-white p-2 rounded border block text-center break-all">
                      {getScanUrl()}
                    </code>
                  </div> */}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  No QR Code Generated
                </p>
                <p className="text-sm text-gray-600">
                  Configure the duration and click "Generate QR Code" to create
                  a scannable attendance code.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions for Students */}
      {generatedQr && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instructions for Students</CardTitle>
            <CardDescription>
              Share these instructions with your students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Open Camera App
                </h3>
                <p className="text-sm text-gray-600">
                  Students should open their phone's camera app
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Scan QR Code</h3>
                <p className="text-sm text-gray-600">
                  Point the camera at the QR code to scan it
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Mark Attendance
                </h3>
                <p className="text-sm text-gray-600">
                  Follow the link to mark their attendance automatically
                </p>
              </div>
            </div>

            {/* Additional Instructions */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">
                Important Notes:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• QR code expires in {duration} minutes</li>
                <li>• Students must be enrolled in this course</li>
                <li>• Each student can only scan once per session</li>
                <li>• Ensure good lighting when scanning</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Information */}
      {generatedQr && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Technical Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Course:</span>
                <p className="text-gray-600">{course.title}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Session Code:</span>
                <p className="text-gray-600 font-mono">
                  {generatedQr.qrSession.sessionCode}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Generated At:</span>
                <p className="text-gray-600">{new Date().toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Expires At:</span>
                <p className="text-gray-600">
                  {new Date(generatedQr.expiresAt).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const QrSkeleton = () => (
  <div className="container mx-auto py-8 px-4 max-w-4xl">
    <div className="flex items-center gap-4 mb-8">
      <Skeleton className="h-8 w-8 rounded" />
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Skeleton className="h-96 w-full rounded-lg" />
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
  </div>
);

export default GenerateQrPage;
