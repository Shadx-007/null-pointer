'use client';

import { useDashboardStore } from '@/lib/store';
import { Circle } from 'lucide-react';

export function ServiceHealth() {
  const services = useDashboardStore((state) => state.services);

  const statusColors = {
    online: { dot: 'bg-emerald-500', text: 'text-emerald-500', label: 'Online' },
    warning: { dot: 'bg-amber-500', text: 'text-amber-500', label: 'Warning' },
    offline: { dot: 'bg-red-500', text: 'text-red-500', label: 'Offline' },
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Service Health</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const status = statusColors[service.status];
          return (
            <div
              key={service.id}
              className="glass card-glow border border-gray-200 dark:border-white/10 p-5 rounded-2xl hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`relative w-3 h-3 rounded-full ${status.dot}`}>
                    {service.status === 'online' && (
                      <div className="absolute inset-0 rounded-full bg-current opacity-75 animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {service.name}
                    </h3>
                    <p className={`text-xs font-medium ${status.text}`}>{status.label}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-muted-foreground font-medium">CPU Usage</span>
                  <span className="text-gray-900 dark:text-white font-bold">{service.cpuUsage}%</span>
                </div>
                <div className="w-full bg-gray-300 dark:bg-muted rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      service.cpuUsage > 70
                        ? 'bg-red-500'
                        : service.cpuUsage > 50
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                    }`}
                    style={{ width: `${service.cpuUsage}%` }}
                  />
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-700 dark:text-muted-foreground font-medium">Uptime</span>
                  <span className="text-gray-900 dark:text-white font-bold">{service.uptime}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
