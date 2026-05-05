import { useState, useEffect } from "react";

const AVATAR_KEY = "anonvote-avatar";

/**
 * Manages the user's avatar image stored as a base64 data URL in localStorage.
 * Falls back to the first letter of the org name if no image is set.
 */
export function useAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    return localStorage.getItem(AVATAR_KEY);
  });

  const uploadAvatar = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("File must be an image"));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        reject(new Error("Image must be under 2MB"));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        localStorage.setItem(AVATAR_KEY, dataUrl);
        setAvatarUrl(dataUrl);
        // Dispatch event so other components (Navbar) update immediately
        window.dispatchEvent(new Event("avatar-updated"));
        resolve();
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const removeAvatar = () => {
    localStorage.removeItem(AVATAR_KEY);
    setAvatarUrl(null);
    window.dispatchEvent(new Event("avatar-updated"));
  };

  // Listen for updates from other components
  useEffect(() => {
    const handler = () => {
      setAvatarUrl(localStorage.getItem(AVATAR_KEY));
    };
    window.addEventListener("avatar-updated", handler);
    return () => window.removeEventListener("avatar-updated", handler);
  }, []);

  return { avatarUrl, uploadAvatar, removeAvatar };
}
