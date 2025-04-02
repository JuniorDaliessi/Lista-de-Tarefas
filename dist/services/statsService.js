"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class StatsService {
    // Obter todas as estatísticas do usuário
    getUserStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Estatísticas gerais de tarefas
                const taskStats = yield database_1.default.query(`SELECT
          COUNT(*) AS total_tasks,
          SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) AS completed_tasks,
          SUM(CASE WHEN completed = false THEN 1 ELSE 0 END) AS pending_tasks,
          SUM(CASE WHEN completed = false AND due_date < CURRENT_DATE THEN 1 ELSE 0 END) AS overdue_tasks,
          SUM(CASE WHEN priority = 'alta' THEN 1 ELSE 0 END) AS high_priority_tasks,
          SUM(CASE WHEN priority = 'média' THEN 1 ELSE 0 END) AS medium_priority_tasks,
          SUM(CASE WHEN priority = 'baixa' THEN 1 ELSE 0 END) AS low_priority_tasks,
          COUNT(DISTINCT category_id) FILTER (WHERE category_id IS NOT NULL) AS categories_used,
          COUNT(DISTINCT project_id) FILTER (WHERE project_id IS NOT NULL) AS projects_used
        FROM tasks
        WHERE user_id = $1`, [userId]);
                // Estatísticas de tempo de conclusão
                const completionTimeStats = yield database_1.default.query(`SELECT
          AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/86400) AS avg_completion_days,
          MIN(EXTRACT(EPOCH FROM (updated_at - created_at))/86400) AS min_completion_days,
          MAX(EXTRACT(EPOCH FROM (updated_at - created_at))/86400) AS max_completion_days,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (updated_at - created_at))/86400) AS median_completion_days
        FROM tasks
        WHERE 
          user_id = $1 
          AND completed = true`, [userId]);
                // Estatísticas por período de tempo (últimos 30 dias)
                const timeStats = yield database_1.default.query(`SELECT
          COUNT(*) AS tasks_created_last_30d,
          SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) AS tasks_completed_last_30d
        FROM tasks 
        WHERE 
          user_id = $1 
          AND created_at > NOW() - INTERVAL '30 days'`, [userId]);
                // Estatísticas de projetos
                const projectStats = yield database_1.default.query(`SELECT
          COUNT(*) AS total_projects,
          AVG(p.total_tasks) AS avg_tasks_per_project,
          AVG(p.completion_percentage) AS avg_project_completion
        FROM (
          SELECT 
            p.id,
            COUNT(t.id) AS total_tasks,
            CASE 
              WHEN COUNT(t.id) > 0 THEN 
                (SUM(CASE WHEN t.completed = true THEN 1 ELSE 0 END)::float / COUNT(t.id)) * 100
              ELSE 0
            END AS completion_percentage
          FROM 
            projects p
          LEFT JOIN 
            tasks t ON p.id = t.project_id AND t.user_id = p.user_id
          WHERE 
            p.user_id = $1
          GROUP BY 
            p.id
        ) p`, [userId]);
                // Estatísticas de categorias
                const categoryStats = yield database_1.default.query(`SELECT
          COUNT(*) AS total_categories,
          AVG(c.task_count) AS avg_tasks_per_category
        FROM (
          SELECT 
            cat.id,
            COUNT(t.id) AS task_count
          FROM 
            categories cat
          LEFT JOIN 
            tasks t ON cat.id = t.category_id
          WHERE 
            cat.user_id = $1
          GROUP BY 
            cat.id
        ) c`, [userId]);
                // Estatísticas de uso
                const usageStats = yield database_1.default.query(`SELECT
          MIN(created_at) AS first_task_date,
          MAX(created_at) AS latest_task_date,
          COUNT(DISTINCT DATE(created_at)) AS active_days
        FROM tasks
        WHERE user_id = $1`, [userId]);
                // Estatísticas de subtarefas
                const subtaskStats = yield database_1.default.query(`SELECT
          COUNT(*) AS total_subtasks,
          SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) AS completed_subtasks,
          AVG(st.subtask_count) AS avg_subtasks_per_task
        FROM (
          SELECT 
            t.id,
            COUNT(s.id) AS subtask_count
          FROM 
            tasks t
          LEFT JOIN 
            subtasks s ON t.id = s.task_id
          WHERE 
            t.user_id = $1
          GROUP BY 
            t.id
        ) st
        CROSS JOIN subtasks
        WHERE subtasks.user_id = $1`, [userId]);
                // Atividade por dia da semana
                const weekdayStats = yield database_1.default.query(`SELECT
          EXTRACT(DOW FROM created_at) AS day_of_week,
          COUNT(*) AS task_count
        FROM tasks
        WHERE user_id = $1
        GROUP BY day_of_week
        ORDER BY day_of_week`, [userId]);
                // Mapear dias da semana para nomes
                const weekdayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
                const weekdayActivity = Array(7).fill(0);
                weekdayStats.rows.forEach((row) => {
                    weekdayActivity[row.day_of_week] = parseInt(row.task_count);
                });
                const mappedWeekdayStats = weekdayNames.map((name, index) => ({
                    day: name,
                    task_count: weekdayActivity[index]
                }));
                // Compilar todas as estatísticas
                return {
                    tasks: taskStats.rows[0],
                    completion_time: completionTimeStats.rows[0],
                    time_period: timeStats.rows[0],
                    projects: projectStats.rows[0],
                    categories: categoryStats.rows[0],
                    subtasks: subtaskStats.rows[0],
                    usage: usageStats.rows[0],
                    weekday_activity: mappedWeekdayStats,
                    last_updated: new Date()
                };
            }
            catch (error) {
                console.error('Erro ao buscar estatísticas do usuário:', error);
                throw error;
            }
        });
    }
    // Obter progresso diário do usuário nos últimos X dias
    getDailyProgress(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, days = 30) {
            try {
                const result = yield database_1.default.query(`WITH date_series AS (
          SELECT generate_series(
            CURRENT_DATE - INTERVAL '${days} days',
            CURRENT_DATE,
            INTERVAL '1 day'
          )::date AS date
        ),
        daily_tasks AS (
          SELECT
            DATE(created_at) AS date,
            COUNT(*) AS tasks_created,
            COUNT(*) FILTER (WHERE completed = true) AS tasks_completed
          FROM tasks
          WHERE
            user_id = $1
            AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
          GROUP BY DATE(created_at)
        )
        SELECT
          ds.date,
          COALESCE(dt.tasks_created, 0) AS tasks_created,
          COALESCE(dt.tasks_completed, 0) AS tasks_completed
        FROM date_series ds
        LEFT JOIN daily_tasks dt ON ds.date = dt.date
        ORDER BY ds.date`, [userId]);
                return result.rows;
            }
            catch (error) {
                console.error('Erro ao buscar progresso diário:', error);
                throw error;
            }
        });
    }
    // Obter distribuição de tarefas por categoria
    getCategoryDistribution(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query(`SELECT
          c.name AS category_name,
          COUNT(t.id) AS task_count,
          SUM(CASE WHEN t.completed = true THEN 1 ELSE 0 END) AS completed_count,
          SUM(CASE WHEN t.completed = false THEN 1 ELSE 0 END) AS pending_count
        FROM categories c
        LEFT JOIN tasks t ON c.id = t.category_id AND t.user_id = c.user_id
        WHERE c.user_id = $1
        GROUP BY c.id, c.name
        ORDER BY task_count DESC`, [userId]);
                // Incluir "Sem categoria" para tarefas sem categoria
                const uncategorizedResult = yield database_1.default.query(`SELECT
          'Sem categoria' AS category_name,
          COUNT(*) AS task_count,
          SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) AS completed_count,
          SUM(CASE WHEN completed = false THEN 1 ELSE 0 END) AS pending_count
        FROM tasks
        WHERE 
          user_id = $1 
          AND category_id IS NULL`, [userId]);
                return [...result.rows, ...uncategorizedResult.rows];
            }
            catch (error) {
                console.error('Erro ao buscar distribuição de categorias:', error);
                throw error;
            }
        });
    }
    // Obter estatísticas de tempo médio em colunas kanban
    getKanbanMetrics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query(`SELECT 
          p.name AS project_name,
          kc.title AS column_title,
          COUNT(DISTINCT t.id) AS task_count,
          AVG(EXTRACT(EPOCH FROM (COALESCE(tm.left_at, NOW()) - tm.entered_at))/3600) AS avg_time_hours
        FROM 
          projects p
        JOIN 
          kanban_columns kc ON p.id = kc.project_id
        LEFT JOIN 
          task_metrics tm ON kc.id = tm.column_id
        LEFT JOIN 
          tasks t ON p.id = t.project_id AND kc.title = t.column_id
        WHERE 
          p.user_id = $1
        GROUP BY 
          p.name, kc.title
        ORDER BY 
          p.name, kc.title`, [userId]);
                return result.rows;
            }
            catch (error) {
                console.error('Erro ao buscar métricas kanban:', error);
                throw error;
            }
        });
    }
    // Obter distribuição de prioridades
    getPriorityDistribution(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query(`SELECT
          COALESCE(priority, 'sem prioridade') AS priority,
          COUNT(*) AS task_count,
          SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) AS completed_count,
          SUM(CASE WHEN completed = false THEN 1 ELSE 0 END) AS pending_count
        FROM tasks
        WHERE user_id = $1
        GROUP BY priority
        ORDER BY 
          CASE 
            WHEN priority = 'alta' THEN 1
            WHEN priority = 'média' THEN 2
            WHEN priority = 'baixa' THEN 3
            ELSE 4
          END`, [userId]);
                return result.rows;
            }
            catch (error) {
                console.error('Erro ao buscar distribuição de prioridades:', error);
                throw error;
            }
        });
    }
    // Obter média de tempo para conclusão de tarefas por categoria
    getCategoryCompletionTime(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query(`SELECT
          COALESCE(c.name, 'Sem categoria') AS category_name,
          AVG(EXTRACT(EPOCH FROM (t.updated_at - t.created_at))/86400) AS avg_days_to_complete,
          COUNT(*) AS completed_task_count
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE 
          t.user_id = $1 
          AND t.completed = true
        GROUP BY c.name
        ORDER BY avg_days_to_complete DESC`, [userId]);
                return result.rows;
            }
            catch (error) {
                console.error('Erro ao buscar tempo de conclusão por categoria:', error);
                throw error;
            }
        });
    }
    // Obter dados de produtividade para dashboard
    getDashboardData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Tarefas para hoje
                const todayTasks = yield database_1.default.query(`SELECT COUNT(*) AS count
        FROM tasks
        WHERE 
          user_id = $1 
          AND completed = false
          AND (
            due_date = CURRENT_DATE
            OR (due_date IS NULL AND created_at::date = CURRENT_DATE)
          )`, [userId]);
                // Tarefas atrasadas
                const overdueTasks = yield database_1.default.query(`SELECT COUNT(*) AS count
        FROM tasks
        WHERE 
          user_id = $1 
          AND completed = false 
          AND due_date < CURRENT_DATE`, [userId]);
                // Tarefas próximas (7 dias)
                const upcomingTasks = yield database_1.default.query(`SELECT COUNT(*) AS count
        FROM tasks
        WHERE 
          user_id = $1 
          AND completed = false 
          AND due_date > CURRENT_DATE
          AND due_date <= CURRENT_DATE + INTERVAL '7 days'`, [userId]);
                // Tarefas completadas hoje
                const completedToday = yield database_1.default.query(`SELECT COUNT(*) AS count
        FROM tasks
        WHERE 
          user_id = $1 
          AND completed = true 
          AND DATE(updated_at) = CURRENT_DATE`, [userId]);
                // Tarefas completadas nos últimos 7 dias
                const completedLastWeek = yield database_1.default.query(`SELECT COUNT(*) AS count
        FROM tasks
        WHERE 
          user_id = $1 
          AND completed = true 
          AND updated_at > NOW() - INTERVAL '7 days'`, [userId]);
                // Taxa de conclusão
                const completionRate = yield database_1.default.query(`SELECT
          CASE 
            WHEN COUNT(*) > 0 
            THEN ROUND((SUM(CASE WHEN completed = true THEN 1 ELSE 0 END)::float / COUNT(*)) * 100, 1)
            ELSE 0
          END AS rate
        FROM tasks
        WHERE user_id = $1`, [userId]);
                // Projetos em andamento
                const activeProjects = yield database_1.default.query(`SELECT COUNT(*) AS count
        FROM projects
        WHERE user_id = $1`, [userId]);
                // Dados resumidos para o dashboard
                return {
                    today_tasks: parseInt(todayTasks.rows[0].count),
                    overdue_tasks: parseInt(overdueTasks.rows[0].count),
                    upcoming_tasks: parseInt(upcomingTasks.rows[0].count),
                    completed_today: parseInt(completedToday.rows[0].count),
                    completed_last_week: parseInt(completedLastWeek.rows[0].count),
                    completion_rate: parseFloat(completionRate.rows[0].rate),
                    active_projects: parseInt(activeProjects.rows[0].count)
                };
            }
            catch (error) {
                console.error('Erro ao buscar dados do dashboard:', error);
                throw error;
            }
        });
    }
}
exports.default = new StatsService();
