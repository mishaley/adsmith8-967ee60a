
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface ErrorDialogProps {
  showErrorDialog: boolean;
  setShowErrorDialog: React.Dispatch<React.SetStateAction<boolean>>;
  errorDetails: string | null;
  handleGenerateImages: () => void;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  showErrorDialog,
  setShowErrorDialog,
  errorDetails,
  handleGenerateImages
}) => {
  return (
    <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Image Generation Error</AlertDialogTitle>
          <AlertDialogDescription className="max-h-80 overflow-y-auto whitespace-pre-wrap font-mono text-xs">
            {errorDetails}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction onClick={handleGenerateImages}>Retry</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
