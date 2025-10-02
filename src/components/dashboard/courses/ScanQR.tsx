/* eslint-disable @typescript-eslint/no-explicit-any */
// components/qr-scanner.tsx
import { useState, useRef, useEffect } from "react";
import { QrCode, Camera, CameraOff, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useScanQrAttendanceMutation } from "@/features/courses/courseAPI";

interface ScannerProps {
  onScanComplete?: () => void;
}

export const QrScanner = ({ onScanComplete }: ScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [scanQrAttendance] = useScanQrAttendanceMutation();

  // Check for camera availability
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoDevice = devices.some(
          (device) => device.kind === "videoinput"
        );
        setHasCamera(hasVideoDevice);
      } catch (error) {
        console.error("Error checking camera:", error);
        setHasCamera(false);
      }
    };
    checkCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsScanning(true);
      setScanResult(null);
    } catch (error) {
      console.error("Error starting camera:", error);
      toast.error("Cannot access camera. Please check permissions.");
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleManualCode = async () => {
    const sessionCode = prompt("Enter the session code:");
    if (sessionCode) {
      await processQrCode(sessionCode);
    }
  };

  const processQrCode = async (sessionCode: string) => {
    try {
      // Get user's current location (optional)
      let location = undefined;
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            });
          }
        );
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } catch (geoError) {
        toast.error(
          geoError instanceof Error ? geoError.message : "Location error"
        );
        console.log("Location not available, proceeding without location data");
      }

      const result = await scanQrAttendance({
        sessionCode,
        location,
      }).unwrap();

      setScanResult({ success: true, message: result.message });
      toast.success("Attendance recorded successfully!");

      if (onScanComplete) {
        onScanComplete();
      }

      // Auto close after success
      setTimeout(() => {
        stopCamera();
        setScanResult(null);
      }, 3000);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to record attendance";
      setScanResult({ success: false, message: errorMessage });
      toast.error(errorMessage);
    }
  };

  // Simulate QR code scanning (you can integrate a real QR scanner library like html5-qrcode)
  const simulateQrScan = () => {
    // For demo purposes - in real app, use a QR scanner library
    const demoCode = `SESSION_${Math.random()
      .toString(36)
      .substr(2, 8)
      .toUpperCase()}`;
    processQrCode(demoCode);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <QrCode className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Scan QR Code</CardTitle>
        <CardDescription>
          Scan the QR code provided by your instructor to mark attendance
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Camera Preview */}
        {isScanning && hasCamera && (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* QR Scanner Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white"></div>
              </div>
            </div>
          </div>
        )}

        {/* Scan Result */}
        {scanResult && (
          <div
            className={`p-4 rounded-lg flex items-center space-x-3 ${
              scanResult.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {scanResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span
              className={scanResult.success ? "text-green-800" : "text-red-800"}
            >
              {scanResult.message}
            </span>
          </div>
        )}

        {/* Camera Status */}
        {!hasCamera && (
          <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <CameraOff className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-yellow-800 text-sm">
              Camera not available. You can enter the session code manually.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          {!isScanning ? (
            <>
              {hasCamera && (
                <Button onClick={startCamera} className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              )}
              <Button
                onClick={handleManualCode}
                variant="outline"
                className="w-full"
              >
                Enter Code Manually
              </Button>
              {/* Demo button for testing */}
              <Button
                onClick={simulateQrScan}
                variant="secondary"
                className="w-full"
              >
                Test Scan (Demo)
              </Button>
            </>
          ) : (
            <Button
              onClick={stopCamera}
              variant="destructive"
              className="w-full"
            >
              <CameraOff className="h-4 w-4 mr-2" />
              Stop Camera
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Position the QR code within the frame</p>
          <p>• Ensure good lighting for better scanning</p>
          <p>• Hold steady until the code is recognized</p>
        </div>
      </CardContent>
    </Card>
  );
};
