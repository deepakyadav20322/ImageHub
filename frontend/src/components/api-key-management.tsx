import type React from "react";
import { useState } from "react";
import {
  Copy,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  X,
  Eye,
  EyeOff,
  Plus,
  PenIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import {
  useCreateApiKeyMutation,
  useDeleteApiKeyMutation,
  useGetAllApiKeysQuery,
  useToggleApiKeyStatusMutation,
  useUpdateApiKeyNameMutation,
} from "@/redux/apiSlice/itemsApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export interface ApiKey {
    apiKeyId: string; // UUID
    accountId: string; // UUID
    apiKey: string;
    name: string;
    apiSecret: string;
    isActive: boolean;
    userId: string | null; // UUID (nullable)
    createdAt: Date;
    updatedAt: Date;
  }

interface ApiKeyManagementProps {
  cloudName: string;
}

const ApiKeyManagement = ({ cloudName }: ApiKeyManagementProps) => {
//   const [apiKeys, setApiKeys] = useState<ApiKey[]>([
//     {
//       id: "1",
//       name: "mediaflows_6f076fc9-989...",
//       dateCreated: "Mar 07, 2025",
//       apiKey: "669376515796746",
//       apiSecret: "sk_live_51NXhR8SIh8hRLOVE2jd9",
//       status: "Active",
//     },
//     {
//       id: "2",
//       name: "d8s-cdef680f-b903-475d...",
//       dateCreated: "Mar 07, 2025",
//       apiKey: "433221851841758",
//       apiSecret: "sk_live_51NXhR8SIh8hRLOVE2jd9",
//       status: "Active",
//     },
//     {
//       id: "3",
//       name: "Untitled",
//       dateCreated: "Jan 06, 2024",
//       apiKey: "818812673898723",
//       apiSecret: "sk_live_51NXhR8SIh8hRLOVE2jd9",
//       status: "Active",
//     },
//   ]);
  


const { token } = useSelector((state: RootState) => state.auth);

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] =
    useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [currentAction, setCurrentAction] = useState<
    "create" | "delete" | null
  >(null);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [originalName, setOriginalName] = useState("");

  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>(
    {}
  );
  const [editingKeyId, setEditingKeyId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");

  const { data, isLoading, isError, refetch } = useGetAllApiKeysQuery({
    token: token ?? "",
  });
  const [createApiKey] = useCreateApiKeyMutation();
  const [deleteApiKey] = useDeleteApiKeyMutation();
  const [updateApiKey] = useUpdateApiKeyNameMutation()
  const [toggleApiKeyStatus] = useToggleApiKeyStatusMutation()
 const activeBucket = useSelector((state:RootState)=>state.resource.activeBucket)
  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };
  const apiKeys: ApiKey[] = data?.data || []
  const sortedApiKeys = [...apiKeys].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
  });

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('API secret copy successfully')
  };

  const handleStatusToggle = (id: string) => {
    // setApiKeys(
    //   apiKeys.map((key) =>
    //     key.id === id
    //       ? {
    //           ...key,
    //           status: key.status === "Active" ? "Inactive" : "Active",
    //         }
    //       : key
    //   )
    // );
  };

  const handleCreateApiKey = () => {
    setCurrentAction("create");
    setIsCreateDialogOpen(true);
  };

  const handleDeleteApiKey = (id: string) => {
    setCurrentAction("delete");
    setKeyToDelete(id);
    setIsVerificationDialogOpen(true);
  };


    const handleVerificationSubmit = async () => {
      try {
        if (currentAction === "create") {
          const result = await createApiKey({
            token: token ?? "",
            name: newKeyName,
          }).unwrap();
          if (result.success) {
            toast("API Key created successfully", {
              duration: 2000,
            });
            refetch();
            setNewKeyName("");
            setIsCreateDialogOpen(false);
          } else {
            throw new Error("Failed to create API key");
          }
        } else if (currentAction === "delete" && keyToDelete) {
          const result = await deleteApiKey({
            keyId: keyToDelete,
            token: token ?? "",
          }).unwrap();
          if (result.success) {
            toast.success("API Key deleted successfully", {
              duration: 3000,
            });
            refetch();
            setKeyToDelete(null);
          } else {
            throw new Error(result.message || "Failed to delete API key");
          }
        }
      } catch (error: any) {
        toast("API key Operation faild", { duration: 3500 });
      } finally {
        setVerificationCode("");
        setIsVerificationDialogOpen(false);
        setCurrentAction(null);
      }
  };

  const environmentVariable = `MEDIAHUB_URL=mediaHub://<your_api_key>:<your_api_secret>@${activeBucket??cloudName}`;

  const toggleSecretVisibility = (id: string) => {
    setVisibleSecrets((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleStartEditing = (id: string, currentName: string) => {
    setEditingKeyId(id);
    setEditingName(currentName);
    setOriginalName(currentName); // store original name for comparison
  };

    const handleSaveName = async (id: string) => {
        try {
            const trimmedName = editingName.trim();
          if (!editingName.trim()) {
            throw new Error("Name cannot be empty")
          }

          
    if (trimmedName === originalName.trim()) {
        // No changes made, skip API call
        handleCancelEditing();
        return;
      }
      if(trimmedName.length===0){
        handleCancelEditing();
        toast.error("Name never be empty!")
        return;
      }
      if(trimmedName.length<3){
        handleCancelEditing();
        toast.error("Name must be more than 3 charectar!")
        return;
      }
  
    
          const result = await updateApiKey({ 
            keyId: id, 
            token:token??'',
            name: editingName.trim()
          }).unwrap()
    
          if (result.success) {
            toast.success("Name updated successfully",{
              duration: 2000,
            })
            refetch()
            setEditingKeyId(null)
            setEditingName("")
          } else {
            throw new Error(result.message || "Failed to update name")
          }
        } catch (error: any) {
          toast.error("Failed to update name")
        }
      
    
  };

  const handleCancelEditing = () => {
    setEditingKeyId(null);
    setEditingName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>,id:string) => {
    if (e.key === "Enter") {
      handleSaveName(id);
    } else if (e.key === "Escape") {
      handleCancelEditing();
    }
  };

  return (
    <Card className="w-full min-w-2xl overflow-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-brand">API Keys</CardTitle>
        <div className="rounded-md bg-slate-100 px-3 py-1 dark:bg-slate-800">
         <strong> bucket name:- </strong> {activeBucket}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="mb-4 text-sm">
            Manage API key and secret pairs for your product environment. To
            build the environment variable for each pair, copy the provided
            format and substitute your actual values for the placeholders. Make
            sure to store your secrets securely.
          </p>

          <div className="mb-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <label
                  htmlFor="api-key"
                  className="mb-2 block text-sm font-medium"
                >
                  API environment variable
                </label>
                <div className="flex items-center rounded-md bg-slate-100 p-3 py-2 dark:bg-slate-800">
                  <code id="api-key" className="flex-1 overflow-x-auto text-sm">
                    {environmentVariable}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 shrink-0 "
                    onClick={() => handleCopyToClipboard(environmentVariable)}
                    aria-label="Copy API key"
                  >
                    <Copy className="h-4 w-4 cursor-pointer" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleCreateApiKey}
                // className="bg-primary text-white md:self-end dark:bg-gray-200 dark:text-black cursor-pointer"
                className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap md:self-end  cursor-pointer dark:text-white"
              >
                <Plus className="mr-1 h-4 w-4" />
                Generate New API Key
              </Button>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key Name</TableHead>
              <TableHead className="cursor-pointer" onClick={toggleSort}>
                <div className="flex items-center">
                  Date Created
                  {sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>API Key</TableHead>
              <TableHead>API Secret</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedApiKeys.length>0 ? (
              sortedApiKeys.map((key) => (
              <TableRow key={key.apiKeyId} className="bg-gray-50 dark:bg-slate-700">
                <TableCell className="font-medium">
                <div className="flex justify-center items-center gap-x-1 group">
                  {editingKeyId === key.apiKeyId ? (
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => editingKeyId && handleSaveName(editingKeyId)}
                      onKeyDown={(e) => handleKeyDown(e, key.apiKeyId)}
                      className="h-8 w-full"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-800 px-2 py-1 rounded"
                      onDoubleClick={() => handleStartEditing(key.apiKeyId, key.name)}
                      title="Double-click to edit"
                    >
                      {key.name}
                    </div>
                  )}
                  <PenIcon onClick={() => handleStartEditing(key.apiKeyId, key.name)} className="pt-1 cursor-pointer invisible group-hover:visible " size={16} fontWeight={'medium'} />
                </div>
                </TableCell>
                <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {key.apiKey}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 cursor-pointer"
                      onClick={() => handleCopyToClipboard(key.apiKey)}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy API Key</span>
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center bg-slate-200/70 dark:bg-zinc-800 rounded p-1 ps-2">
                    {visibleSecrets[key.apiKeyId]
                      ? <span className="truncate max-w-[200px] dark:bg-slate-800">{key.apiSecret}</span>
                      : "******************************"}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 cursor-pointer"
                      onClick={() => handleCopyToClipboard(key.apiSecret)}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy API Secret</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="cursor-pointer"
                      size="icon"
                      onClick={() => toggleSecretVisibility(key.apiKeyId)}
                    >
                      {visibleSecrets[key.apiKeyId] ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {visibleSecrets[key.apiKeyId]
                          ? "Hide API Secret"
                          : "Show API Secret"}
                      </span>
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Switch
                      checked={key.isActive === true}
                      onCheckedChange={() => handleStatusToggle(key.apiKeyId)}
                      className="mr-2"
                    />
                    <span
                      className={cn(
                        key.isActive === true
                          ? "text-green-500"
                          : "text-gray-500"
                      )}
                    >
                      {key.isActive?'Active':'Inactive'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleCopyToClipboard(key.apiKey)}
                      >
                        Copy API Key
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleCopyToClipboard(key.apiSecret)}
                      >
                        Copy API Secret
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-500"
                        onClick={() => handleDeleteApiKey(key.apiKeyId)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))):(
                <TableRow className="bg-gray-200 dark:bg-slate-800">
      <TableCell colSpan={6} className="text-center py-8 ">
        <div className="flex flex-col items-center justify-center space-y-2">
          <h2 className="text-lg font-medium">😊 No API keys available !</h2>
          <p className="text-sm text-muted-foreground">
            Create your first API key to get started
          </p>
        </div>
      </TableCell>
    </TableRow>
            )}

          </TableBody>
        </Table>

        {/* Create API Key Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="key-name" className="text-sm font-medium">
                  Key Name (optional)
                </label>
                <Input
                  id="key-name"
                  placeholder="Enter a name for your API key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Creating a new API key will require verification. A confirmation
                code will be sent to your email.
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsVerificationDialogOpen(true)}>
                  Continue
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Verification Dialog */}
        <Dialog
          open={isVerificationDialogOpen}
          onOpenChange={setIsVerificationDialogOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle>Password Verification</DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-center">
                Confirmation code has been sent to your email.
              </p>
              <div className="space-y-2">
                <label
                  htmlFor="verification-code"
                  className="text-sm font-medium"
                >
                  Email Confirmation Code
                </label>
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter confirmation code"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsVerificationDialogOpen(false);
                    setVerificationCode("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleVerificationSubmit}
                  disabled={!verificationCode}
                >
                  Approve
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManagement;
