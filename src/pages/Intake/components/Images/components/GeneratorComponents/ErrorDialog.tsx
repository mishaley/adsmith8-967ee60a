
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface ErrorDialogProps {
  showErrorDialog: boolean;
  setShowErrorDialog: (show: boolean) => void;
  errorDetails: string;
  handleGenerateImages?: () => void;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  showErrorDialog,
  setShowErrorDialog,
  errorDetails,
  handleGenerateImages
}) => {
  return (
    <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Error Generating Image</DialogTitle>
          <DialogDescription>
            There was an error generating your image. Please try again.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <p className="text-sm text-red-600">{errorDetails}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowErrorDialog(false)}>
            Close
          </Button>
          {handleGenerateImages && (
            <Button onClick={handleGenerateImages}>
              Try Again
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
