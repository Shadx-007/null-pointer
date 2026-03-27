import { create } from 'zustand';

export interface Service {
  id: string;
  name: string;
  status: 'online' | 'warning' | 'offline';
  cpuUsage: number;
  uptime: string;
}

export interface DashboardMetrics {
  activeIncidents: number;
  resolvedToday: number;
  totalServices: number;
  aiActionsExecuted: number;
}

export type AgentMode = 'yolo' | 'plan' | 'approval';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface AIAgentState {
  mode: AgentMode;
  confidence: number;
  autoRemediation: boolean;
  dryRun: boolean;
  riskLevel: RiskLevel;
  lastAction: string;
  actionTime: string;
}

interface DashboardStore {
  metrics: DashboardMetrics;
  services: Service[];
  cpuData: Array<{ name: string; [key: string]: string | number }>;
  latencyData: Array<{ name: string; [key: string]: string | number }>;
  errorRateData: Array<{ name: string; [key: string]: string | number }>;
  agentState: AIAgentState;
  updateMetrics: (metrics: Partial<DashboardMetrics>) => void;
  updateCpuData: (data: typeof DashboardStore.prototype.cpuData) => void;
  updateLatencyData: (data: typeof DashboardStore.prototype.latencyData) => void;
  updateErrorRateData: (data: typeof DashboardStore.prototype.errorRateData) => void;
  updateServiceStatus: (serviceId: string, status: Service['status']) => void;
  updateAgentMode: (mode: AgentMode) => void;
  updateConfidence: (confidence: number) => void;
  updateAutoRemediation: (enabled: boolean) => void;
  updateDryRun: (enabled: boolean) => void;
  updateRiskLevel: (risk: RiskLevel) => void;
  recordAction: (action: string) => void;
  emergencyStop: () => void;
}

const generateMockCpuData = () => [
  { name: 'API Gateway', cpu: 45, limit: 100 },
  { name: 'Auth Service', cpu: 32, limit: 100 },
  { name: 'User Service', cpu: 58, limit: 100 },
  { name: 'Order Service', cpu: 42, limit: 100 },
  { name: 'Notification', cpu: 28, limit: 100 },
  { name: 'Database', cpu: 65, limit: 100 },
];

const generateMockLatencyData = () => [
  { name: '00:00', 'API Gateway': 45, 'Auth': 32, 'User': 58 },
  { name: '04:00', 'API Gateway': 52, 'Auth': 38, 'User': 62 },
  { name: '08:00', 'API Gateway': 38, 'Auth': 28, 'User': 48 },
  { name: '12:00', 'API Gateway': 61, 'Auth': 45, 'User': 72 },
  { name: '16:00', 'API Gateway': 48, 'Auth': 35, 'User': 55 },
  { name: '20:00', 'API Gateway': 54, 'Auth': 40, 'User': 65 },
  { name: '23:59', 'API Gateway': 41, 'Auth': 30, 'User': 52 },
];

const generateMockErrorData = () => [
  { name: 'Mon', errors: 4, limit: 100 },
  { name: 'Tue', errors: 3, limit: 100 },
  { name: 'Wed', errors: 2, limit: 100 },
  { name: 'Thu', errors: 5, limit: 100 },
  { name: 'Fri', errors: 1, limit: 100 },
  { name: 'Sat', errors: 2, limit: 100 },
  { name: 'Sun', errors: 3, limit: 100 },
];

const mockServices: Service[] = [
  { id: '1', name: 'API Gateway', status: 'online', cpuUsage: 45, uptime: '99.98%' },
  { id: '2', name: 'Auth Service', status: 'online', cpuUsage: 32, uptime: '99.99%' },
  { id: '3', name: 'User Service', status: 'online', cpuUsage: 58, uptime: '99.95%' },
  { id: '4', name: 'Order Service', status: 'warning', cpuUsage: 42, uptime: '99.92%' },
  { id: '5', name: 'Notification Service', status: 'online', cpuUsage: 28, uptime: '99.97%' },
  { id: '6', name: 'Database Service', status: 'online', cpuUsage: 65, uptime: '99.99%' },
];

export const useDashboardStore = create<DashboardStore>((set) => ({
  metrics: {
    activeIncidents: 2,
    resolvedToday: 8,
    totalServices: 6,
    aiActionsExecuted: 156,
  },
  services: mockServices,
  cpuData: generateMockCpuData(),
  latencyData: generateMockLatencyData(),
  errorRateData: generateMockErrorData(),
  agentState: {
    mode: 'plan',
    confidence: 78,
    autoRemediation: false,
    dryRun: true,
    riskLevel: 'medium',
    lastAction: 'Scaled API Gateway - Resolved latency spike',
    actionTime: '2 minutes ago',
  },
  updateMetrics: (metrics) =>
    set((state) => ({ metrics: { ...state.metrics, ...metrics } })),
  updateCpuData: (data) => set({ cpuData: data }),
  updateLatencyData: (data) => set({ latencyData: data }),
  updateErrorRateData: (data) => set({ errorRateData: data }),
  updateServiceStatus: (serviceId, status) =>
    set((state) => ({
      services: state.services.map((s) =>
        s.id === serviceId ? { ...s, status } : s
      ),
    })),
  updateAgentMode: (mode) =>
    set((state) => ({
      agentState: { ...state.agentState, mode },
    })),
  updateConfidence: (confidence) =>
    set((state) => ({
      agentState: { ...state.agentState, confidence: Math.min(100, Math.max(0, confidence)) },
    })),
  updateAutoRemediation: (autoRemediation) =>
    set((state) => ({
      agentState: { ...state.agentState, autoRemediation },
    })),
  updateDryRun: (dryRun) =>
    set((state) => ({
      agentState: { ...state.agentState, dryRun },
    })),
  updateRiskLevel: (riskLevel) =>
    set((state) => ({
      agentState: { ...state.agentState, riskLevel },
    })),
  recordAction: (action) =>
    set((state) => ({
      agentState: { ...state.agentState, lastAction: action, actionTime: 'just now' },
    })),
  emergencyStop: () =>
    set((state) => ({
      agentState: {
        ...state.agentState,
        mode: 'plan',
        autoRemediation: false,
        dryRun: true,
        lastAction: 'Emergency stop activated',
        actionTime: 'just now',
      },
    })),
}));
