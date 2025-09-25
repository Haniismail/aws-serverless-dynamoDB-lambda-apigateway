import { Response, Request } from 'express';
import { TodoRepository } from '../../database/repository/TodoRepository';
import { ApiResponse } from '../../core/ApiResponse';
import { ITodoCreate } from '../../database/model/Todo';
import Joi from 'joi';

const createTodoSchema = Joi.object({
  title: Joi.string().required().min(1).max(200),
  description: Joi.string().optional().max(1000),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.string().isoDate().optional(),
  tags: Joi.array().items(Joi.string().max(50)).optional(),
});

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { error, value } = createTodoSchema.validate(req.body);
    if (error) {
      return ApiResponse.error(res, 400, error.details[0].message);
    }

    const todoData: ITodoCreate = {
      ...value,
    };

    const todoRepository = new TodoRepository();
    const todo = await todoRepository.create(todoData);

    return ApiResponse.success(res, todo, 'Todo created successfully', 201);
  } catch (error) {
    console.error('Create todo error:', error);
    return ApiResponse.error(res, 500, 'Internal server error');
  }
};
