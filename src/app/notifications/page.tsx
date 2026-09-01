"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Bell, CheckCheck } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  body?: string;
  type?: string;
  read?: boolean;
  createdAt?: string;
}

function NotificationsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="py-4 border-b border-border-subtle">
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-3 w-full mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((json) => {
        const data = Array.isArray(json) ? json : json.data ?? [];
        setNotifications(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-light tracking-tight text-text-primary">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all as read
            </Button>
          )}
        </div>
        <p className="text-sm text-text-secondary mb-8">
          {unreadCount > 0
            ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
            : "All caught up."}
        </p>

        {loading ? (
          <NotificationsSkeleton />
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Bell
              className="w-10 h-10 text-text-muted mb-6"
              strokeWidth={1}
            />
            <h2 className="text-xl font-light text-text-primary mb-2">
              No notifications yet.
            </h2>
            <p className="text-sm text-text-secondary text-center max-w-sm">
              You&apos;ll see updates and alerts here as they come in.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {notifications.map((item, index) => (
              <div
                key={item.id}
                onClick={() => !item.read && markAsRead(item.id)}
                className={cn(
                  "group py-4 transition-colors duration-200 cursor-pointer",
                  index < notifications.length - 1 &&
                    "border-b border-border-subtle",
                  !item.read && "bg-bg-surface/50 -mx-3 px-3 rounded-sm"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {item.type && (
                        <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted bg-bg-surface px-1.5 py-0.5 rounded-sm">
                          {item.type}
                        </span>
                      )}
                      {!item.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400/70" />
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-sm mb-0.5",
                        item.read
                          ? "text-text-secondary font-normal"
                          : "text-text-primary font-medium"
                      )}
                    >
                      {item.title}
                    </p>
                    {item.body && (
                      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                        {item.body}
                      </p>
                    )}
                  </div>
                  <time className="text-[10px] text-text-muted whitespace-nowrap mt-0.5">
                    {timeAgo(item.createdAt)}
                  </time>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
