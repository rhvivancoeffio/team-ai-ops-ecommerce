/**
 * Base message structure for inter-agent communication
 */
export interface Message {
  id: string;
  type: string;
  from: string;
  to: string;
  payload: any;
  timestamp: Date;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

/**
 * Task structure for agent processing
 */
export interface Task {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  data: any;
  result?: any;
  error?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Agent capability definition
 */
export interface AgentCapability {
  name: string;
  description: string;
  inputSchema?: any;
  outputSchema?: any;
}

/**
 * Agent configuration
 */
export interface AgentConfig {
  id: string;
  name: string;
  type: string;
  capabilities: AgentCapability[];
  enabled?: boolean;
  settings?: Record<string, any>;
}

/**
 * Team configuration
 */
export interface TeamConfig {
  id: string;
  name: string;
  description: string;
  agents: AgentConfig[];
  workflows?: WorkflowConfig[];
}

/**
 * Workflow configuration
 */
export interface WorkflowConfig {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  triggers?: WorkflowTrigger[];
}

/**
 * Workflow step
 */
export interface WorkflowStep {
  id: string;
  agentId: string;
  action: string;
  input?: any;
  condition?: string;
  nextSteps?: string[];
}

/**
 * Workflow trigger
 */
export interface WorkflowTrigger {
  type: 'event' | 'schedule' | 'manual';
  config: any;
}

/**
 * Event structure for platform events
 */
export interface PlatformEvent {
  type: string;
  source: string;
  data: any;
  timestamp: Date;
}
