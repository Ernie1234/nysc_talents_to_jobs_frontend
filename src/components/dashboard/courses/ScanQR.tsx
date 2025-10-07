/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import {
  QrCode,
  Camera,
  CameraOff,
  CheckCircle,
  XCircle,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useScanQrAttendanceMutation } from "@/features/courses/courseAPI";
import { Html5QrcodeScanner } from "html5-qrcode";

interface ScannerProps {
  onScanComplete?: () => void;
}

export const ScannerComponent = ({ onScanComplete }: ScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scanQrAttendance] = useScanQrAttendanceMutation();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

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
      // Check camera permissions first
      await navigator.mediaDevices.getUserMedia({ video: true });
      setIsScanning(true);
      setScanResult(null);
      setShowManualInput(false);

      // Initialize scanner after a brief delay to ensure DOM is ready
      setTimeout(() => {
        if (scannerContainerRef.current && !scannerRef.current) {
          scannerRef.current = new Html5QrcodeScanner(
            "qr-scanner-container",
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              supportedScanTypes: [],
            },
            false
          );

          scannerRef.current.render(
            (decodedText: string) => {
              console.log("QR Code detected:", decodedText);
              processQrCode(decodedText);
            },
            (error: string) => {
              // Don't log every scan error - it's normal during scanning
              if (!error.includes("No MultiFormat Readers")) {
                console.error("QR Scanner error:", error);
              }
            }
          );
        }
      }, 100);
    } catch (error) {
      console.error("Error starting camera:", error);
      toast.error("Cannot access camera. Please check permissions.");
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const processQrCode = async (sessionCode: string) => {
    try {
      // Stop scanning immediately when a QR code is detected
      stopCamera();

      // Validate session code format
      if (!sessionCode || sessionCode.trim().length === 0) {
        throw new Error("Invalid session code");
      }

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
        console.log(
          "Location not available, proceeding without location data",
          geoError
        );
        // Don't show error for location - it's optional
      }

      const result = await scanQrAttendance({
        sessionCode: sessionCode.trim(),
        location,
      }).unwrap();

      setScanResult({ success: true, message: result.message });
      toast.success("Attendance recorded successfully!");

      if (onScanComplete) {
        onScanComplete();
      }

      // Auto close after success
      setTimeout(() => {
        setScanResult(null);
        setShowManualInput(false);
      }, 3000);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to record attendance";
      setScanResult({ success: false, message: errorMessage });
      toast.error(errorMessage);

      // Allow user to try again
      setTimeout(() => {
        setScanResult(null);
      }, 3000);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      toast.error("Please enter a session code");
      return;
    }
    await processQrCode(manualCode);
  };

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

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
        {/* Manual Input Form */}
        {showManualInput && (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="sessionCode"
                className="block text-sm font-medium mb-2"
              >
                Session Code
              </label>
              <input
                id="sessionCode"
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="Enter session code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
                autoComplete="off"
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Submit
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowManualInput(false);
                  setManualCode("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {isScanning && hasCamera && (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <div
              id="qr-scanner-container"
              ref={scannerContainerRef}
              className="w-full h-full"
            />
            {/* Scanner overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-white"></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-white"></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-white"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-white"></div>
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
        {!hasCamera && !showManualInput && (
          <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <CameraOff className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-yellow-800 text-sm">
              Camera not available. Please enter the session code manually.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {!showManualInput && (
          <div className="flex flex-col space-y-2">
            {!isScanning ? (
              <>
                {hasCamera && (
                  <Button onClick={startCamera} className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera Scanner
                  </Button>
                )}
                <Button
                  onClick={() => setShowManualInput(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Enter Code Manually
                </Button>
              </>
            ) : (
              <Button onClick={stopCamera} variant="outline" className="w-full">
                <CameraOff className="h-4 w-4 mr-2" />
                Stop Scanner
              </Button>
            )}
          </div>
        )}

        {/* Instructions */}
        {!showManualInput && (
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Position the QR code within the frame</p>
            <p>• Ensure good lighting for better scanning</p>
            <p>• Hold steady until the code is recognized</p>
            <p>• Or enter the code manually if camera is unavailable</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
