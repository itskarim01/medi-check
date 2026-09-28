"use client";

import { useEffect, useState } from "react";

type Status = "loading" | "unsupported" | "blocked" | "off" | "on";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function saveSubscription(subscription: PushSubscription) {
  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription.toJSON()),
  });
  if (!res.ok) throw new Error("Failed to save subscription");
}

export default function NotifyPush() {
  const [status, setStatus] = useState<Status>("loading");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        setStatus("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        setStatus("blocked");
        return;
      }
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        const existing = await registration.pushManager.getSubscription();
        if (existing) {
          // Re-save so the DB row always belongs to whoever is logged in right now
          await saveSubscription(existing);
          setStatus("on");
        } else {
          setStatus("off");
        }
      } catch {
        setStatus("off");
      }
    }
    init();
  }, []);

  async function turnOn() {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setStatus(permission === "denied" ? "blocked" : "off");
      return;
    }
    await navigator.serviceWorker.register("/sw.js");
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    });
    await saveSubscription(subscription);
    setStatus("on");
  }

  async function turnOff() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
      await subscription.unsubscribe();
    }
    setStatus("off");
  }

  async function handleToggle() {
    setBusy(true);
    setError(null);
    try {
      if (status === "on") {
        await turnOff();
      } else {
        await turnOn();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const isOn = status === "on";
  const disabled = busy || status === "loading" || status === "unsupported" || status === "blocked";

  const description =
    status === "unsupported"
      ? "This browser doesn't support push notifications."
      : status === "blocked"
      ? "Notifications are blocked for this site. Allow them in your browser's site settings, then reload this page."
      : "Get a notification on this device when a dose is due, even when MedTracker is closed.";

  return (
    <div className="p-lg rounded-xl shadow-lg bg-white flex items-center justify-between gap-md">
      <div className="flex-1">
        <p className="font-body-lg text-body-lg text-on-surface font-semibold">Push reminders</p>
        <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>
        {error && <p className="font-label-sm text-label-sm text-error mt-xs">{error}</p>}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-label="Push reminders"
        onClick={handleToggle}
        disabled={disabled}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          isOn ? "bg-primary" : "bg-outline-variant"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            isOn ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}