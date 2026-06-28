"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import { Key, Plus, Trash2, Copy, Check, ShieldAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

type ApiKey = {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  createdAt: string;
  lastUsedAt: string | null;
};

const createKeySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type CreateKeyData = z.infer<typeof createKeySchema>;

export default function ApiKeysSettingsPage() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRawKey, setNewRawKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: keys, isLoading } = useQuery<ApiKey[]>({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const token = await getToken();
      return apiClient.get<ApiKey[]>("/api-keys", { ...(token && { token }) });
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateKeyData>({
    resolver: zodResolver(createKeySchema),
  });

  const { mutate: createKey, isPending: isCreating } = useMutation({
    mutationFn: async (data: CreateKeyData) => {
      const token = await getToken();
      return apiClient.post<{ key: string } & ApiKey>("/api-keys", { ...data, scopes: ["read", "write"] }, { ...(token && { token }) });
    },
    onSuccess: (data) => {
      setNewRawKey(data.key);
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      reset();
      setIsModalOpen(false);
      toast.success("API Key generated successfully");
    },
    onError: () => toast.error("Failed to create API key"),
  });

  const { mutate: revokeKey, isPending: isRevoking } = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      return apiClient.delete(`/api-keys/${id}`, { ...(token && { token }) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API Key revoked");
    },
    onError: () => toast.error("Failed to revoke API key"),
  });

  const copyToClipboard = () => {
    if (newRawKey) {
      navigator.clipboard.writeText(newRawKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">API Keys</h3>
        <p className="text-sm text-muted-foreground">
          Generate and manage API keys to programmatically interact with your workspace.
        </p>
      </div>

      {newRawKey && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-warning mt-0.5" />
            <div className="flex-1 space-y-2">
              <h4 className="text-sm font-semibold text-warning-foreground">Save your new API key</h4>
              <p className="text-sm text-warning-foreground/80">
                Please copy this key and save it somewhere safe. For security reasons, <strong>we will not show it to you again</strong>.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <code className="flex-1 px-3 py-2 bg-background/50 border border-warning/20 rounded-lg text-sm font-mono text-foreground break-all">
                  {newRawKey}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-background border border-warning/20 rounded-lg text-foreground hover:bg-background/80 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={() => setNewRawKey(null)}
                className="mt-4 text-sm font-medium text-warning-foreground hover:underline"
              >
                I have saved it securely
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border border-border rounded-xl bg-card text-card-foreground shadow-sm">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
          <div>
            <h3 className="text-lg font-semibold leading-none tracking-tight">Active API Keys</h3>
            <p className="text-sm text-muted-foreground mt-2">Manage access to your data.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create new key
          </button>
        </div>
        
        <div className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !keys || keys.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <Key className="w-10 h-10 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground">No API keys generated</h3>
              <p className="text-muted-foreground mt-1 text-sm max-w-sm">
                Create an API key to authenticate requests from your own applications.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {keys.map((key) => (
                <div key={key.id} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">{key.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">{key.keyPrefix}••••••••</code>
                      <span>Created {new Date(key.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to revoke this key? Any integrations using it will immediately stop working.")) {
                        revokeKey(key.id);
                      }
                    }}
                    disabled={isRevoking}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Revoke Key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95">
          <div className="bg-card border border-border shadow-lg rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/20">
              <h2 className="text-lg font-semibold text-foreground">Generate API Key</h2>
            </div>
            
            <form onSubmit={handleSubmit((d) => createKey(d))} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Key Name</label>
                <input
                  {...register("name")}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g. Production Zapier Integration"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 px-4 py-2 shadow-sm"
                >
                  {isCreating ? "Generating..." : "Generate Key"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
