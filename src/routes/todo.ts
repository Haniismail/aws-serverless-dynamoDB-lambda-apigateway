import { Router } from 'express';
import { 
  createTodo, 
  getAllTodos, 
  getTodoById, 
  updateTodo, 
  deleteTodo 
} from '../controllers/todo/index';

const router = Router();

// Authentication removed: expose Todo CRUD publicly

// Todo CRUD routes
router.post('/', createTodo);
router.get('/', getAllTodos);
router.get('/:id', getTodoById);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
