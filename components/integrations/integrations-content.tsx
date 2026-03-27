'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, AlertCircle, CheckCircle, Clock, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'pending' | 'error' | 'not_configured';
  description: string;
  errors?: number;
  lastSynced?: Date;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'aws',
    name: 'AWS',
    icon: '🔷',
    status: 'connected',
    description: 'Amazon Web Services for cloud infrastructure',
    lastSynced: new Date(Date.now() - 300000),
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    icon: '📊',
    status: 'connected',
    description: 'Google Cloud Platform services',
    lastSynced: new Date(Date.now() - 600000),
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    status: 'connected',
    description: 'Send notifications to Slack channels',
    lastSynced: new Date(Date.now() - 120000),
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: '🎮',
    status: 'pending',
    description: 'Discord webhooks for alerts',
  },
  {
    id: 'email',
    name: 'Email',
    icon: '📧',
    status: 'error',
    description: 'SMTP email notifications',
    errors: 2,
  },
  {
    id: 'datadog',
    name: 'Datadog',
    icon: '📈',
    status: 'not_configured',
    description: 'Monitoring and analytics platform',
  },
];

const OVERVIEW = {
  connected: INTEGRATIONS.filter((i) => i.status === 'connected').length,
  errors: INTEGRATIONS.filter((i) => i.status === 'error').reduce((sum, i) => sum + (i.errors || 0), 0),
  pending: INTEGRATIONS.filter((i) => i.status === 'pending').length,
  not_configured: INTEGRATIONS.filter((i) => i.status === 'not_configured').length,
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'connected':
      return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30';
    case 'error':
      return 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/30';
    case 'pending':
      return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30';
    default:
      return 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-500/10 border-gray-300 dark:border-gray-500/30';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'connected':
      return <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    case 'error':
      return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    default:
      return <Cloud className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
  }
};

export function IntegrationsContent() {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [apiKey, setApiKey] = useState('');

  const handleConnect = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === integrationId
          ? { ...i, status: 'connected' as const, lastSynced: new Date() }
          : i
      )
    );
    toast.success(`${integrationId.toUpperCase()} connected successfully`);
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === integrationId
          ? { ...i, status: 'not_configured' as const }
          : i
      )
    );
    toast.success(`${integrationId.toUpperCase()} disconnected`);
  };

  const handleAddIntegration = () => {
    if (!selectedService || !apiKey.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === selectedService
          ? { ...i, status: 'connected' as const, lastSynced: new Date() }
          : i
      )
    );

    toast.success(`${selectedService} integration added`);
    setShowModal(false);
    setSelectedService('');
    setApiKey('');
  };

  return (
    <div className="space-y-8">
      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Connected', value: OVERVIEW.connected, color: 'emerald' },
          { label: 'Errors', value: OVERVIEW.errors, color: 'red' },
          { label: 'Pending', value: OVERVIEW.pending, color: 'amber' },
          { label: 'Not Configured', value: OVERVIEW.not_configured, color: 'gray' },
        ].map((item) => (
          <motion.div
            key={item.label}
            className={`glass card-glow border border-${item.color}-300 dark:border-${item.color}-500/10 p-4 rounded-2xl`}
            whileHover={{ scale: 1.02 }}
          >
            <p className={`text-xs font-semibold text-${item.color}-700 dark:text-${item.color}-300 mb-1`}>
              {item.label}
            </p>
            <p className={`text-2xl font-bold text-${item.color}-900 dark:text-white`}>{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Add Integration Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 dark:bg-green-500 hover:bg-blue-700 dark:hover:bg-green-600 text-white font-semibold transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Integration
      </button>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <motion.div
            key={integration.id}
            className="glass card-glow border border-gray-300 dark:border-white/10 p-6 rounded-2xl"
            whileHover={{ scale: 1.02 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{integration.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{integration.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-white/70">{integration.description}</p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(integration.status)} mb-4`}>
              {getStatusIcon(integration.status)}
              <span className="capitalize">{integration.status.replace('_', ' ')}</span>
            </div>

            {/* Last Synced */}
            {integration.lastSynced && (
              <p className="text-xs text-gray-600 dark:text-white/70 mb-4">
                Last synced: {integration.lastSynced.toLocaleTimeString()}
              </p>
            )}

            {/* Errors */}
            {integration.errors && (
              <p className="text-xs text-red-700 dark:text-red-300 mb-4">
                {integration.errors} error{integration.errors > 1 ? 's' : ''} detected
              </p>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-gray-300 dark:border-white/10 space-y-2">
              {integration.status === 'connected' ? (
                <button
                  onClick={() => handleDisconnect(integration.id)}
                  className="w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-semibold text-sm transition-colors"
                >
                  Disconnect
                </button>
              ) : integration.status === 'not_configured' ? (
                <>
                  <button
                    onClick={() => {
                      setSelectedService(integration.id);
                      setShowModal(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold text-sm transition-colors"
                  >
                    Connect
                  </button>
                  <button
                    onClick={() => handleConnect(integration.id)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-900 dark:text-white font-semibold text-sm transition-colors"
                  >
                    Configure
                  </button>
                </>
              ) : integration.status === 'pending' ? (
                <button
                  onClick={() => handleConnect(integration.id)}
                  className="w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold text-sm transition-colors"
                >
                  Authorize
                </button>
              ) : (
                <button
                  onClick={() => handleDisconnect(integration.id)}
                  className="w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-semibold text-sm transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Integration Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass card-glow border border-gray-300 dark:border-white/10 p-6 rounded-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Integration</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Service Select */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Select Service
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-400"
                  >
                    <option value="">Choose a service...</option>
                    {integrations
                      .filter((i) => i.status === 'not_configured' || i.status === selectedService)
                      .map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* API Key Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-400"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddIntegration}
                    className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-900 dark:text-white font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
