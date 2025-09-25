import { Response, Request } from 'express';
import { TodoRepository } from '../../database/repository/TodoRepository';
import { ApiResponse } from '../../core/ApiResponse';
import { ITodoUpdate } from '../../database/model/Todo';
import Joi from 'joi';

const updateTodoSchema = Joi.object({
  title: Joi.string().optional().min(1).max(200),
  description: Joi.string().optional().max(1000),
  completed: Joi.boolean().optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.string().isoDate().optional(),
  tags: Joi.array().items(Joi.string().max(50)).optional(),
});

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error, value } = updateTodoSchema.validate(req.body);
    if (error) {
      return ApiResponse.error(res, 400, error.details[0].message);
    }

    const todoRepository = new TodoRepository();
    
    // First check if the todo exists
    const existingTodo = await todoRepository.findById(id);
    if (!existingTodo) {
      return ApiResponse.error(res, 404, 'Todo not found');
    }

    const updateData: ITodoUpdate = value;
    const updatedTodo = await todoRepository.update(id, updateData);

    if (!updatedTodo) {
      return ApiResponse.error(res, 500, 'Failed to update todo');
    }

    return ApiResponse.success(res, updatedTodo, 'Todo updated successfully');
  } catch (error) {
    console.error('Update todo error:', error);
    return ApiResponse.error(res, 500, 'Internal server error');
  }
};
