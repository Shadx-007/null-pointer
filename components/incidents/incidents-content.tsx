'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, CheckCircle, AlertCircle, Clock, Zap, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface Incident {
  id: string;
  service: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved';
  timestamp: Date;
  title: string;
  description: string;
  timeline: TimelineEvent[];
  aiAnalysis: string;
}

interface TimelineEvent {
  label: string;
  timestamp: Date;
  icon: 'detected' | 'analysis' | 'found' | 'action' | 'resolved';
}

const INCIDENTS: Incident[] = [
  {
    id: '1',
    service: 'API Gateway',
    severity: 'critical',
    status: 'active',
    timestamp: new Date(Date.now() - 2400000),
    title: 'High Latency - API Gateway',
    description: 'Database connection pool exhausted due to traffic spike',
    timeline: [
      { label: 'Detected', timestamp: new Date(Date.now() - 2400000), icon: 'detected' },
      { label: 'AI Analysis', timestamp: new Date(Date.now() - 2100000), icon: 'analysis' },
      { label: 'Root Cause Found', timestamp: new Date(Date.now() - 1800000), icon: 'found' },
      { label: 'Action Taken', timestamp: new Date(Date.now() - 900000), icon: 'action' },
    ],
    aiAnalysis: 'High latency caused by database connection pool exhaustion. Traffic spike led to 5000 concurrent connections. AI automatically scaled database read replicas and cleared backlog queue. Latency normalized within 3 minutes.',
  },
  {
    id: '2',
    service: 'Auth Service',
    severity: 'high',
    status: 'resolved',
    timestamp: new Date(Date.now() - 7200000),
    title: 'Auth Service Timeout',
    description: 'Token validation endpoint exceeded timeout threshold',
    timeline: [
      { label: 'Detected', timestamp: new Date(Date.now() - 7200000), icon: 'detected' },
      { label: 'AI Analysis', timestamp: new Date(Date.now() - 6900000), icon: 'analysis' },
      { label: 'Root Cause Found', timestamp: new Date(Date.now() - 6600000), icon: 'found' },
      { label: 'Action Taken', timestamp: new Date(Date.now() - 6300000), icon: 'action' },
      { label: 'Resolved', timestamp: new Date(Date.now() - 5400000), icon: 'resolved' },
    ],
    aiAnalysis: 'Token validation cache had expired, forcing database lookups. AI invalidated and rebuilt cache, restored endpoint performance to baseline.',
  },
  {
    id: '3',
    service: 'User Service',
    severity: 'medium',
    status: 'active',
    timestamp: new Date(Date.now() - 1800000),
    title: 'Memory Leak Detected',
    description: 'Gradual increase in memory consumption observed',
    timeline: [
      { label: 'Detected', timestamp: new Date(Date.now() - 1800000), icon: 'detected' },
      { label: 'AI Analysis', timestamp: new Date(Date.now() - 1500000), icon: 'analysis' },
    ],
    aiAnalysis: 'Potential memory leak identified in session management module. Recommend graceful restart and code review of event listeners.',
  },
  {
    id: '4',
    service: 'Payment Service',
    severity: 'low',
    status: 'resolved',
    timestamp: new Date(Date.now() - 14400000),
    title: 'Increased Error Rate',
    description: '2% of transactions failing validation',
    timeline: [
      { label: 'Detected', timestamp: new Date(Date.now() - 14400000), icon: 'detected' },
      { label: 'AI Analysis', timestamp: new Date(Date.now() - 14100000), icon: 'analysis' },
      { label: 'Root Cause Found', timestamp: new Date(Date.now() - 13800000), icon: 'found' },
      { label: 'Resolved', timestamp: new Date(Date.now() - 13500000), icon: 'resolved' },
    ],
    aiAnalysis: 'Gateway timeout intermittently blocking payment validation. Issue resolved after provider network recovered.',
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-500/10';
    case 'high':
      return 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-500/10';
    case 'medium':
      return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10';
    default:
      return 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10';
  }
};

const getStatusColor = (status: string) => {
  return status === 'resolved'
    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10'
    : 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-500/10';
};

export function IncidentsContent() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = INCIDENTS.filter((incident) => {
    const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleResolve = () => {
    if (selectedIncident?.status === 'active') {
      toast.success(`Incident ${selectedIncident.id} marked as resolved`);
      setSelectedIncident(null);
    }
  };

  const handleTriggerFix = () => {
    toast.success('AI fix triggered - running remediation...');
  };

  const handleEscalate = () => {
    toast.info('Incident escalated to on-call engineer');
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="glass card-glow border border-gray-300 dark:border-white/10 p-4 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-600 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-400"
            />
          </div>

          {/* Filters */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-400"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-400"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="glass card-glow border border-gray-300 dark:border-white/10 p-8 rounded-2xl text-center">
              <p className="text-gray-600 dark:text-white/70">No incidents found</p>
            </div>
          ) : (
            filtered.map((incident) => (
              <motion.div
                key={incident.id}
                onClick={() => setSelectedIncident(incident)}
                className="glass card-glow border border-gray-300 dark:border-white/10 p-4 rounded-2xl cursor-pointer hover:border-gray-400 dark:hover:border-white/20 transition-all"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{incident.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getSeverityColor(incident.severity)}`}>
                        {incident.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-white/70 mb-2">{incident.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-white/70">
                      <span>Service: {incident.service}</span>
                      <span>{new Date(incident.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(incident.status)}`}>
                    {incident.status === 'resolved' ? 'RESOLVED' : 'ACTIVE'}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Details Panel */}
        <AnimatePresence>
          {selectedIncident && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass card-glow border border-gray-300 dark:border-white/10 p-6 rounded-2xl space-y-6 sticky top-24"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">{selectedIncident.title}</h2>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Badges */}
              <div className="flex gap-2">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getSeverityColor(selectedIncident.severity)}`}>
                  {selectedIncident.severity.toUpperCase()}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(selectedIncident.status)}`}>
                  {selectedIncident.status === 'resolved' ? 'RESOLVED' : 'ACTIVE'}
                </span>
              </div>

              {/* Service */}
              <div>
                <p className="text-xs text-gray-600 dark:text-white/70 font-semibold mb-1">SERVICE AFFECTED</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedIncident.service}</p>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-xs text-gray-600 dark:text-white/70 font-semibold mb-3">INCIDENT TIMELINE</p>
                <div className="space-y-3">
                  {selectedIncident.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          {event.icon === 'detected' && <AlertCircle className="w-3 h-3 text-white" />}
                          {event.icon === 'analysis' && <Zap className="w-3 h-3 text-white" />}
                          {event.icon === 'found' && <Shield className="w-3 h-3 text-white" />}
                          {event.icon === 'action' && <Clock className="w-3 h-3 text-white" />}
                          {event.icon === 'resolved' && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        {idx < selectedIncident.timeline.length - 1 && (
                          <div className="w-0.5 h-8 bg-gradient-to-b from-blue-500/50 to-transparent mt-1" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{event.label}</p>
                        <p className="text-xs text-gray-600 dark:text-white/70">{event.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Analysis */}
              <div>
                <p className="text-xs text-gray-600 dark:text-white/70 font-semibold mb-2">AI ANALYSIS</p>
                <p className="text-sm text-gray-700 dark:text-white/80 leading-relaxed">{selectedIncident.aiAnalysis}</p>
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-2 border-t border-gray-300 dark:border-white/10">
                {selectedIncident.status === 'active' && (
                  <>
                    <button
                      onClick={handleTriggerFix}
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                      Trigger AI Fix
                    </button>
                    <button
                      onClick={handleResolve}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={handleEscalate}
                      className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                      Escalate
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
