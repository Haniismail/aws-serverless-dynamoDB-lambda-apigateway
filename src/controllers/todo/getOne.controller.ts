import { Response, Request } from 'express';
import { TodoRepository } from '../../database/repository/TodoRepository';
import { ApiResponse } from '../../core/ApiResponse';

export const getTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const todoRepository = new TodoRepository();
    const todo = await todoRepository.findById(id);

    if (!todo) {
      return ApiResponse.error(res, 404, 'Todo not found');
    }

    return ApiResponse.success(res, todo, 'Todo retrieved successfully');
  } catch (error) {
    console.error('Get todo by ID error:', error);
    return ApiResponse.error(res, 500, 'Internal server error');
  }
};
