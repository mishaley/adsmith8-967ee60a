
import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
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
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Loader2, Upload, X} from "lucide-react";

// Mock data for asset groups (would come from API in production)
const mockAssetGroups = [
    {id: "ag-123456", name: "Main Performance Campaign"},
    {id: "ag-234567", name: "Summer Sale Assets"},
    {id: "ag-345678", name: "Product Showcase"},
    {id: "ag-456789", name: "Holiday Promotion"},
];

export default function LaunchSection() {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("create");
    const [createImages, setCreateImages] = useState<File[]>([]);
    const [updateImages, setUpdateImages] = useState<File[]>([]);
    const [assetGroups, setAssetGroups] = useState(mockAssetGroups);
    const [selectedAssetGroup, setSelectedAssetGroup] = useState<string>("");
    const createFileInputRef = useRef<HTMLInputElement>(null);
    const updateFileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [campaignId, setCampaignId] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [assetGroupName, setAssetGroupName] = useState("");
    const [headlines, setHeadlines] = useState("");
    const [descriptions, setDescriptions] = useState("");
    const [finalUrls, setFinalUrls] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [callToAction, setCallToAction] = useState("");
    const [imagePrompt, setImagePrompt] = useState("");
    const [imageStyle, setImageStyle] = useState("");

    // Simulating fetching asset groups from API
    useEffect(() => {
        // In a real implementation, this would fetch from your API
        // const fetchAssetGroups = async () => {
        //   const response = await fetch('/api/asset-groups');
        //   const data = await response.json();
        //   setAssetGroups(data);
        // }
        // fetchAssetGroups();

        // Using mock data for now
        setAssetGroups(mockAssetGroups);
    }, []);

    // Handle image uploads
    const handleCreateImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setCreateImages(prev => [...prev, ...newFiles]);
        }
    };

    const handleUpdateImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setUpdateImages(prev => [...prev, ...newFiles]);
        }
    };

    // Remove image functions
    const removeCreateImage = (index: number) => {
        setCreateImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeUpdateImage = (index: number) => {
        setUpdateImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (action: "create" | "update") => {
        setIsLoading(true);

        try {
            // Prepare form data for uploading files
            const formData = new FormData();

            // Add common text fields using state variables instead of DOM queries
            formData.append("assetGroupName", assetGroupName);
            formData.append("headlines", headlines);
            formData.append("descriptions", descriptions);
            formData.append("finalUrls", finalUrls);
            formData.append("businessName", businessName);
            formData.append("callToAction", callToAction);
            formData.append("customerId", customerId);

            // Add action-specific fields
            if (action === "create") {
                formData.append("campaignId", campaignId);

                // Add create images
                createImages.forEach((file, index) => {
                    formData.append(`images[${index}]`, file);
                });
            } else {
                // For update, use the selected asset group ID
                formData.append("assetGroupId", selectedAssetGroup);

                // Add update images
                updateImages.forEach((file, index) => {
                    formData.append(`images[${index}]`, file);
                });
            }

            // Add optional image generation fields
            formData.append("imagePrompt", imagePrompt);
            formData.append("imageStyle", imageStyle);

            // Log formData content
            console.log(`${action === "create" ? "Creating" : "Updating"} asset group with formData:`,
                Array.from(formData.entries()).reduce((obj, [key, value]) => {
                    obj[key] = value instanceof File ? `File: ${value.name}` : value;
                    return obj;
                }, {} as Record<string, any>)
            );

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.error(`Error ${action === "create" ? "creating" : "updating"} asset group:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    // Image preview component
    const renderImagePreviews = (images: File[], removeImage: (index: number) => void) => (
        <div className="grid grid-cols-3 gap-4 mt-2">
            {images.map((file, index) => (
                <div key={index} className="relative border rounded-md overflow-hidden h-24">
                    <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage(index)}
                    >
                        <X className="h-3 w-3"/>
                    </Button>
                </div>
            ))}
        </div>
    );

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Launch</CardTitle>
                <CardDescription>Create or update asset groups for your campaign</CardDescription>
            </CardHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mx-6">
                    <TabsTrigger value="create">Create Asset Group</TabsTrigger>
                    <TabsTrigger value="update">Update Asset Group</TabsTrigger>
                </TabsList>

                <CardContent>
                    <TabsContent value="create">
                        <div className="space-y-4">
                            <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                                <AlertDescription>
                                    Fill in all required fields to create a new asset group
                                </AlertDescription>
                            </Alert>

                            <div className="grid gap-4">
                                {/* Campaign and Customer ID fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="campaignId">Campaign ID *</label>
                                        <Input 
                                            id="campaignId" 
                                            placeholder="Enter campaign ID"
                                            value={campaignId}
                                            onChange={(e) => setCampaignId(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="customerId">Customer ID *</label>
                                        <Input 
                                            id="customerId"
                                            placeholder="Enter Google Ads account ID"
                                            value={customerId}
                                            onChange={(e) => setCustomerId(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="assetGroupName">Asset Group Name *</label>
                                    <Input 
                                        id="assetGroupName"
                                        placeholder="Enter a name for your asset group"
                                        value={assetGroupName}
                                        onChange={(e) => setAssetGroupName(e.target.value)}
                                    />
                                </div>

                                {/* New required fields */}
                                <div className="space-y-2">
                                    <label htmlFor="businessName">Business Name *</label>
                                    <Input 
                                        id="businessName"
                                        placeholder="Enter your business name"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="finalUrls">Final URLs *</label>
                                    <Textarea 
                                        id="finalUrls"
                                        placeholder="Enter landing page URLs (one per line)"
                                        rows={2}
                                        value={finalUrls}
                                        onChange={(e) => setFinalUrls(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="callToAction">Call to Action *</label>
                                    <Select value={callToAction} onValueChange={setCallToAction}>
                                        <SelectTrigger id="callToAction">
                                            <SelectValue placeholder="Select a call to action"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SHOP_NOW">Shop Now</SelectItem>
                                            <SelectItem value="LEARN_MORE">Learn More</SelectItem>
                                            <SelectItem value="SIGN_UP">Sign Up</SelectItem>
                                            <SelectItem value="GET_QUOTE">Get Quote</SelectItem>
                                            <SelectItem value="APPLY_NOW">Apply Now</SelectItem>
                                            <SelectItem value="DOWNLOAD">Download</SelectItem>
                                            <SelectItem value="SUBSCRIBE">Subscribe</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="headlines">Headlines *</label>
                                    <Textarea 
                                        id="headlines"
                                        placeholder="Enter headlines (one per line, up to 5)"
                                        rows={3}
                                        value={headlines}
                                        onChange={(e) => setHeadlines(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="descriptions">Descriptions *</label>
                                    <Textarea 
                                        id="descriptions"
                                        placeholder="Enter descriptions (one per line, up to 5)"
                                        rows={3}
                                        value={descriptions}
                                        onChange={(e) => setDescriptions(e.target.value)}
                                    />
                                </div>

                                {/* Image Upload Section */}
                                <div className="space-y-2">
                                    <label>Image Assets *</label>
                                    <div
                                        className="border border-dashed rounded-md p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100"
                                        onClick={() => createFileInputRef.current?.click()}>
                                        <Upload className="mx-auto h-8 w-8 text-gray-400"/>
                                        <p className="mt-2 text-sm text-gray-600">Click to upload
                                            images (JPG, PNG, WebP)</p>
                                        <p className="text-xs text-gray-500 mt-1">Maximum 5MB per
                                            file</p>
                                    </div>
                                    <input
                                        ref={createFileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        multiple
                                        className="hidden"
                                        onChange={handleCreateImageUpload}
                                    />
                                    {createImages.length > 0 && renderImagePreviews(createImages, removeCreateImage)}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="update">
                        <div className="space-y-4">
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                                <AlertDescription>
                                    Select an asset group to update its properties
                                </AlertDescription>
                            </Alert>

                            <div className="grid gap-4">
                                {/* Asset Group Selection instead of ID input */}
                                <div className="space-y-2">
                                    <label htmlFor="assetGroupSelect">Select Asset Group *</label>
                                    <Select
                                        value={selectedAssetGroup}
                                        onValueChange={setSelectedAssetGroup}
                                    >
                                        <SelectTrigger id="assetGroupSelect">
                                            <SelectValue
                                                placeholder="Choose an asset group to update"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {assetGroups.map(group => (
                                                <SelectItem key={group.id} value={group.id}>
                                                    {group.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="assetGroupName">Asset Group Name</label>
                                    <Input 
                                        id="assetGroupName"
                                        placeholder="Update asset group name (optional)"
                                        value={assetGroupName}
                                        onChange={(e) => setAssetGroupName(e.target.value)}
                                    />
                                </div>

                                {/* New fields for update */}
                                <div className="space-y-2">
                                    <label htmlFor="businessName">Business Name</label>
                                    <Input 
                                        id="businessName"
                                        placeholder="Update business name (optional)"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="finalUrls">Final URLs</label>
                                    <Textarea 
                                        id="finalUrls"
                                        placeholder="Update landing page URLs (one per line, optional)"
                                        rows={2}
                                        value={finalUrls}
                                        onChange={(e) => setFinalUrls(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="callToAction">Call to Action</label>
                                    <Select value={callToAction} onValueChange={setCallToAction}>
                                        <SelectTrigger id="callToAction">
                                            <SelectValue
                                                placeholder="Update call to action (optional)"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SHOP_NOW">Shop Now</SelectItem>
                                            <SelectItem value="LEARN_MORE">Learn More</SelectItem>
                                            <SelectItem value="SIGN_UP">Sign Up</SelectItem>
                                            <SelectItem value="GET_QUOTE">Get Quote</SelectItem>
                                            <SelectItem value="APPLY_NOW">Apply Now</SelectItem>
                                            <SelectItem value="DOWNLOAD">Download</SelectItem>
                                            <SelectItem value="SUBSCRIBE">Subscribe</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="headlines">Headlines</label>
                                    <Textarea 
                                        id="headlines"
                                        placeholder="Update headlines (one per line, optional)"
                                        rows={3}
                                        value={headlines}
                                        onChange={(e) => setHeadlines(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="descriptions">Descriptions</label>
                                    <Textarea 
                                        id="descriptions"
                                        placeholder="Update descriptions (one per line, optional)"
                                        rows={3}
                                        value={descriptions}
                                        onChange={(e) => setDescriptions(e.target.value)}
                                    />
                                </div>

                                {/* Image Upload Section for Update */}
                                <div className="space-y-2">
                                    <label>Update Image Assets</label>
                                    <div
                                        className="border border-dashed rounded-md p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100"
                                        onClick={() => updateFileInputRef.current?.click()}>
                                        <Upload className="mx-auto h-8 w-8 text-gray-400"/>
                                        <p className="mt-2 text-sm text-gray-600">Click to upload
                                            new images (JPG, PNG, WebP)</p>
                                        <p className="text-xs text-gray-500 mt-1">Maximum 5MB per
                                            file</p>
                                    </div>
                                    <input
                                        ref={updateFileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        multiple
                                        className="hidden"
                                        onChange={handleUpdateImageUpload}
                                    />
                                    {updateImages.length > 0 && renderImagePreviews(updateImages, removeUpdateImage)}
                                </div>


                            </div>
                        </div>
                    </TabsContent>
                </CardContent>

                <CardFooter>
                    <Button
                        onClick={() => handleSubmit(activeTab as "create" | "update")}
                        disabled={isLoading || (activeTab === "update" && !selectedAssetGroup)}
                        className="ml-auto"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        {activeTab === "create" ? "Create Asset Group" : "Update Asset Group"}
                    </Button>
                </CardFooter>
            </Tabs>
        </Card>
    );
}
