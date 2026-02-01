import express, { Express, Request, Response } from 'express';
import { Platform } from '../core/Platform';
import { Task } from '../types';

/**
 * REST API for the AI Teams platform
 */
export class ApiServer {
  private app: Express;
  private platform: Platform;
  private port: number;

  constructor(platform: Platform, port: number = 3000) {
    this.app = express();
    this.platform = platform;
    this.port = port;
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup middleware
   */
  private setupMiddleware(): void {
    this.app.use(express.json());
    
    // CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });
  }

  /**
   * Setup API routes
   */
  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({ status: 'ok', timestamp: new Date() });
    });

    // Create team
    this.app.post('/api/teams', async (req: Request, res: Response) => {
      try {
        const config = req.body;
        const team = await this.platform.createTeam(config);
        await team.start();
        res.json({
          success: true,
          team: {
            id: team.getConfig().id,
            name: team.getConfig().name,
            agents: team.getAgents().map((a) => ({
              id: a.getId(),
              name: a.getName(),
              type: a.getType()
            }))
          }
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Create ecommerce team
    this.app.post('/api/teams/ecommerce', async (req: Request, res: Response) => {
      try {
        const { teamId } = req.body;
        const team = await this.platform.createEcommerceTeam(teamId);
        await team.start();
        res.json({
          success: true,
          team: {
            id: team.getConfig().id,
            name: team.getConfig().name,
            description: team.getConfig().description,
            agents: team.getAgents().map((a) => ({
              id: a.getId(),
              name: a.getName(),
              type: a.getType()
            }))
          }
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get all teams
    this.app.get('/api/teams', (req: Request, res: Response) => {
      const teams = this.platform.getAllTeams().map(team => ({
        id: team.getConfig().id,
        name: team.getConfig().name,
        description: team.getConfig().description,
        agentCount: team.getAgents().length
      }));
      res.json({ success: true, teams });
    });

    // Get team details
    this.app.get('/api/teams/:teamId', (req: Request, res: Response) => {
      const team = this.platform.getTeam(req.params.teamId as string);
      if (!team) {
        res.status(404).json({ success: false, error: 'Team not found' });
        return;
      }

      res.json({
        success: true,
        team: {
          id: team.getConfig().id,
          name: team.getConfig().name,
          description: team.getConfig().description,
          agents: team.getAgents().map((a) => ({
            id: a.getId(),
            name: a.getName(),
            type: a.getType(),
            enabled: a.isEnabled()
          }))
        }
      });
    });

    // Submit task
    this.app.post('/api/teams/:teamId/tasks', async (req: Request, res: Response) => {
      try {
        const task: Task = {
          id: `task-${Date.now()}`,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
          ...req.body
        };

        const taskId = await this.platform.submitTask(req.params.teamId as string, task);
        res.json({ success: true, taskId });
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get task status
    this.app.get('/api/teams/:teamId/tasks/:taskId', (req: Request, res: Response) => {
      const team = this.platform.getTeam(req.params.teamId as string);
      if (!team) {
        res.status(404).json({ success: false, error: 'Team not found' });
        return;
      }

      const task = team.getTask(req.params.taskId as string);
      if (!task) {
        res.status(404).json({ success: false, error: 'Task not found' });
        return;
      }

      res.json({ success: true, task });
    });

    // Get all tasks for a team
    this.app.get('/api/teams/:teamId/tasks', (req: Request, res: Response) => {
      const team = this.platform.getTeam(req.params.teamId as string);
      if (!team) {
        res.status(404).json({ success: false, error: 'Team not found' });
        return;
      }

      const tasks = team.getAllTasks();
      res.json({ success: true, tasks });
    });
  }

  /**
   * Start the API server
   */
  start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.port, () => {
        console.log(`API Server running on port ${this.port}`);
        resolve();
      });
    });
  }

  /**
   * Get Express app
   */
  getApp(): Express {
    return this.app;
  }
}
