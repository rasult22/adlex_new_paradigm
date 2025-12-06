import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, LogOut01, Save01 } from "@untitledui/icons";
import { AdlexSidebar } from "@/components/adlex-sidebar";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { useAuthStore } from "@/stores/auth";
import { logoutUser } from "@/queries/auth";

export const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user, refreshToken, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Local form state (API not implemented yet)
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
      navigate("/auth");
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);

    // TODO: Implement API call when endpoint is available
    // For now, just simulate saving
    await new Promise((resolve) => setTimeout(resolve, 500));

    setSuccessMessage("Profile saved successfully! (API not implemented yet)");
    setIsSaving(false);
  };

  return (
    <div className="flex min-h-screen bg-primary">
      <AdlexSidebar activeUrl="/profile" />

      <main className="flex-1 px-6 py-8 lg:px-12">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Button
              color="secondary"
              size="sm"
              iconLeading={ArrowLeft}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">
              Profile Settings
            </h1>
            <p className="mt-1 text-md text-tertiary">
              Manage your account settings and preferences.
            </p>
          </div>

          {/* Profile Form */}
          <div className="rounded-xl border border-secondary bg-primary p-6">
            <Form onSubmit={handleSave} className="flex flex-col gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="First Name"
                  type="text"
                  name="first_name"
                  placeholder="Enter your first name"
                  size="md"
                  value={formData.first_name}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, first_name: value }))
                  }
                />
                <Input
                  label="Last Name"
                  type="text"
                  name="last_name"
                  placeholder="Enter your last name"
                  size="md"
                  value={formData.last_name}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, last_name: value }))
                  }
                />
              </div>

              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="Enter your email"
                size="md"
                value={formData.email}
                isDisabled
                hint="Email cannot be changed"
              />

              <Input
                label="Phone"
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                size="md"
                value={formData.phone}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, phone: value }))
                }
              />

              {successMessage && (
                <div className="rounded-lg bg-success-secondary p-3 text-sm text-success-primary">
                  {successMessage}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="md"
                  iconLeading={Save01}
                  isDisabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </Form>
          </div>

          {/* Logout Section */}
          <div className="mt-8 rounded-xl border border-error-secondary bg-primary p-6">
            <h2 className="text-lg font-semibold text-primary">Sign Out</h2>
            <p className="mt-1 text-sm text-tertiary">
              Sign out of your account on this device.
            </p>
            <div className="mt-4">
              <Button
                color="secondary-destructive"
                size="md"
                iconLeading={LogOut01}
                onClick={handleLogout}
                isDisabled={isLoading}
              >
                {isLoading ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>

          {/* Account Info */}
          <div className="mt-8 rounded-xl border border-secondary bg-secondary_subtle p-6">
            <h2 className="text-lg font-semibold text-primary">
              Account Information
            </h2>
            <div className="mt-4 grid gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-tertiary">User ID</span>
                <span className="font-mono text-secondary">{user?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tertiary">Role</span>
                <span className="capitalize text-secondary">{user?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tertiary">Status</span>
                <span
                  className={
                    user?.is_active ? "text-success-primary" : "text-error-primary"
                  }
                >
                  {user?.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-tertiary">Member since</span>
                <span className="text-secondary">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
