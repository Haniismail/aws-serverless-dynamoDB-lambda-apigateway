import { Response, Request } from 'express';
import { TodoRepository } from '../../database/repository/TodoRepository';
import { ApiResponse } from '../../core/ApiResponse';

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const lastKey = req.query.lastKey as string;

    const todoRepository = new TodoRepository();
    const result = await todoRepository.getAll(limit, lastKey);

    return ApiResponse.success(res, {
      todos: result.items,
      pagination: {
        limit,
        lastEvaluatedKey: result.lastEvaluatedKey,
        hasMore: !!result.lastEvaluatedKey,
      },
    }, 'Todos retrieved successfully');
  } catch (error) {
    console.error('Get all todos error:', error);
    return ApiResponse.error(res, 500, 'Internal server error');
  }
};
