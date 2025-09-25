import { Response, Request } from 'express';
import { TodoRepository } from '../../database/repository/TodoRepository';
import { ApiResponse } from '../../core/ApiResponse';

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const todoRepository = new TodoRepository();
    
    // First check if the todo exists
    const existingTodo = await todoRepository.findById(id);
    if (!existingTodo) {
      return ApiResponse.error(res, 404, 'Todo not found');
    }

    await todoRepository.delete(id);

    return ApiResponse.success(res, null, 'Todo deleted successfully');
  } catch (error) {
    console.error('Delete todo error:', error);
    return ApiResponse.error(res, 500, 'Internal server error');
  }
};
