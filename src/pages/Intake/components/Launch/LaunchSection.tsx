import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload, X } from "lucide-react";
import { GoogleAdsOAuth } from "./GoogleAdsOAuth";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import type { Database } from '@/integrations/supabase/types';
import CollapsibleSection from "../CollapsibleSection";

// Mock data for asset groups (would come from API in production)
const mockAssetGroups = [
    { id: "ag-123456", name: "Main Performance Campaign" },
    { id: "ag-234567", name: "Summer Sale Assets" },
    { id: "ag-345678", name: "Product Showcase" },
    { id: "ag-456789", name: "Holiday Promotion" },
];

type GoogleAdsAccount = Database['public']['Tables']['google_ads_accounts']['Row'];

export default function LaunchSection() {
    const [accounts, setAccounts] = useState<GoogleAdsAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAccount, setSelectedAccount] = useState<GoogleAdsAccount | null>(null);
    const { toast } = useToast();

    // Fetch all Google Ads accounts without user context
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const { data, error } = await supabase
                    .from('google_ads_accounts')
                    .select('*');

                if (error) throw error;
                setAccounts(data || []);
            } catch (error) {
                console.error('Failed to fetch Google Ads accounts:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to fetch Google Ads accounts',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const handleAccountConnected = async (account: Omit<GoogleAdsAccount, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            // Insert new account without organization context
            const { data, error } = await supabase
                .from('google_ads_accounts')
                .insert({
                    ...account,
                    organization_id: '00000000-0000-0000-0000-000000000000', // Default organization ID
                })
                .select()
                .single();

            if (error) throw error;

            setAccounts(prev => [...prev, data]);
            setSelectedAccount(data);

            toast({
                title: 'Success',
                description: 'Successfully connected Google Ads account',
            });
        } catch (error) {
            console.error('Failed to add Google Ads account:', error);
            toast({
                title: 'Error',
                description: 'Failed to add Google Ads account',
                variant: 'destructive',
            });
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Get manager customer ID from environment
    const managerCustomerId = import.meta.env.VITE_GOOGLE_ADS_MANAGER_CUSTOMER_ID || '';

    return (
        <CollapsibleSection title="LAUNCH">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Launch Campaign</h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Google Ads Account</h3>
                        <p className="text-sm text-gray-500">
                            Connect your Google Ads account to manage campaigns
                        </p>
                    </div>

                    {accounts.length > 0 ? (
                        <div className="space-y-2">
                            <Label>Select Account</Label>
                            <Select
                                value={selectedAccount?.id || ''}
                                onValueChange={(value) => {
                                    const account = accounts.find(a => a.id === value);
                                    setSelectedAccount(account || null);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts.map((account) => (
                                        <SelectItem key={account.id} value={account.id}>
                                            {account.name} ({account.customer_id})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : null}

                    {/* Always show the connect button */}
                    <div className="space-y-4">
                        <GoogleAdsOAuth
                            onAccountConnected={handleAccountConnected}
                            accountType="client"
                            managerCustomerId={managerCustomerId}
                        />
                        <div className="text-sm text-muted-foreground">
                            <p>Before connecting, please ensure:</p>
                            <ol className="list-decimal list-inside mt-2">
                                <li>You have access to the Google Ads account</li>
                                <li>The account is linked to our agency (ID: {managerCustomerId})</li>
                                <li>The linking request has been accepted in Google Ads</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </CollapsibleSection>

    );
}
