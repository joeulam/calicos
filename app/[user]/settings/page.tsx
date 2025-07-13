"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useTheme } from "@/components/theme-provider";

export default function SettingsPage() {
  const supabase = createClient();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currencyPreference, setCurrencyPreference] = useState("USD");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        toast.error("Failed to fetch user data.");
        console.error("Error fetching user:", userError);
        setLoading(false);
        return;
      }

      if (user) {
        setUserName(user.user_metadata?.full_name || "");
        setUserEmail(user.email || "");

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select(
            "notifications_enabled, dark_mode_enabled, currency_preference"
          )
          .eq("id", user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          toast.error("Failed to fetch user preferences.");
          console.error("Error fetching profile:", profileError);
        } else if (profile) {
          setNotificationsEnabled(profile.notifications_enabled ?? true);
          setCurrencyPreference(profile.currency_preference || "USD");
        }
      }
      setLoading(false);
    }

    fetchUserData();
    setMounted(true);
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
      error: userAuthError,
    } = await supabase.auth.getUser();

    if (userAuthError || !user) {
      toast.error("You must be logged in to update your profile.");
      setLoading(false);
      return;
    }

    const { error: updateAuthError } = await supabase.auth.updateUser({
      email: userEmail,
      data: { full_name: userName },
    });

    if (updateAuthError) {
      toast.error(`Failed to update profile: ${updateAuthError.message}`);
      console.error("Error updating Auth user:", updateAuthError);
      setLoading(false);
      return;
    }

    const { error: updateProfileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          notifications_enabled: notificationsEnabled ?? true,
          dark_mode_enabled: isDarkMode ?? false,
        },
        { onConflict: "id" }
      );

    if (updateProfileError) {
      toast.error(
        `Failed to update preferences: ${
          updateProfileError.message || "Unknown error"
        }`
      );
      console.error("Error updating profile table:", updateProfileError);
      setLoading(false);
      return;
    }

    toast.success("Profile Updated Successfully!");
    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      toast.error("Password Change Failed");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      toast.error("Password Change Failed");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setPasswordError(`Failed to change password: ${error.message}`);
      toast.error("Password Change Failed");
      console.error("Error changing password:", error);
    } else {
      toast.success("Password Changed Successfully!");
      setPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  

  return (
    <div
      className={`transition-all duration-300 py-10 px-6 md:px-10 w-[100vw] md:w-[80vw]`}
    >
            <meta name="viewport" content="width=device-width, initial-scale=.7" />

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>
      <Toaster />

      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-foreground">Profile Information</CardTitle>
          <CardDescription className="text-muted-foreground">Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Label htmlFor="userName">Name</Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Name"
                className="mt-1"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="userEmail">Email</Label>
              <Input
                id="userEmail"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="mt-1"
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading}>
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-foreground">Appearance</CardTitle>
          <CardDescription className="text-muted-foreground">
            Customize the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="darkMode">Dark Mode</Label>
            {mounted && (
              <Switch
                id="darkMode"
                checked={isDarkMode}
                onCheckedChange={(checked) => {
                  toggleDarkMode(checked);
                  handleUpdateProfile({
                    preventDefault: () => {},
                  } as React.FormEvent);
                }}
                disabled={loading}
              />
            )}
            {!mounted && (
              <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-foreground">Password & Security</CardTitle>
          <CardDescription className="text-muted-foreground">Change your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="mt-1"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="mt-1"
                disabled={loading}
              />
              {passwordError && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            <Button type="submit" disabled={loading}>
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-foreground">Preferences</CardTitle>
          <CardDescription className="text-muted-foreground">Set your application preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <select
              id="currency"
              value={currencyPreference}
              onChange={async (e) => {
                setCurrencyPreference(e.target.value);
                handleUpdateProfile({
                  preventDefault: () => {},
                } as React.FormEvent);
              }}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-background text-foreground"
              disabled={loading}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      
    </div>
  );
}