declare module "react-qr-scanner" {
  import { CSSProperties, ComponentType } from "react";

  interface QrScannerProps {
    onResult: (result: { text: string } | null) => void;
    onError: (error: Error) => void;
    constraints?: MediaTrackConstraints;
    scanDelay?: number;
    style?: CSSProperties;
    className?: string;
  }

  export const QrScanner: ComponentType<QrScannerProps>;
}
