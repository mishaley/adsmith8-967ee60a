
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Settings() {
  const testCleanupFunction = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('cleanup-org-folders', {
        body: { dryRun: true }
      });
      
      if (error) {
        console.error('Cleanup function error:', error);
        toast.error('Failed to test cleanup: ' + error.message);
        return;
      }
      
      console.log('Cleanup function response:', data);
      toast.success('Cleanup test completed successfully! Check console for details.');
    } catch (err) {
      console.error('Error invoking function:', err);
      toast.error('Failed to invoke cleanup function');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Storage Cleanup</h2>
          <p className="text-sm text-gray-600 mb-4">
            Test the cleanup function in dry-run mode to see which organization folders would be removed.
          </p>
          <Button 
            onClick={testCleanupFunction}
            variant="outline"
          >
            Test Cleanup Function
          </Button>
        </div>
      </div>
    </div>
  );
}
