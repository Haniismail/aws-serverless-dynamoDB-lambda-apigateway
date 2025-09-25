import { 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  DeleteCommand, 
  QueryCommand,
  ScanCommand 
} from '@aws-sdk/lib-dynamodb';
import { dynamoDB, TABLE_NAME } from '../dynamodb';
import { ITodo, ITodoCreate, ITodoUpdate } from '../model/Todo';
import { v4 as uuidv4 } from 'uuid';

export class TodoRepository {
  async create(todoData: ITodoCreate): Promise<ITodo> {
    const now = new Date().toISOString();
    const todo: ITodo = {
      id: uuidv4(),
      ...todoData,
      completed: false,
      priority: todoData.priority || 'medium',
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDB.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: todo,
    }));

    return todo;
  }

  async findById(id: string): Promise<ITodo | null> {
    const result = await dynamoDB.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    }));

    return result.Item as ITodo || null;
  }

  async findByUserId(userId: string, limit: number = 50, lastKey?: string): Promise<{
    items: ITodo[];
    lastEvaluatedKey?: string;
  }> {
    const params: any = {
      TableName: TABLE_NAME,
      IndexName: 'userId-createdAt-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ScanIndexForward: false, // Sort by createdAt descending
      Limit: limit,
    };

    if (lastKey) {
      params.ExclusiveStartKey = JSON.parse(lastKey);
    }

    const result = await dynamoDB.send(new QueryCommand(params));

    return {
      items: result.Items as ITodo[] || [],
      lastEvaluatedKey: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : undefined,
    };
  }

  async update(id: string, updateData: ITodoUpdate): Promise<ITodo | null> {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.keys(updateData).forEach((key, index) => {
      if (updateData[key as keyof ITodoUpdate] !== undefined) {
        updateExpressions.push(`#${key} = :val${index}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:val${index}`] = updateData[key as keyof ITodoUpdate];
      }
    });

    if (updateExpressions.length === 0) {
      return this.findById(id);
    }

    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const result = await dynamoDB.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }));

    return result.Attributes as ITodo;
  }

  async delete(id: string): Promise<boolean> {
    await dynamoDB.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
    }));

    return true;
  }

  async getAll(limit: number = 50, lastKey?: string): Promise<{
    items: ITodo[];
    lastEvaluatedKey?: string;
  }> {
    const params: any = {
      TableName: TABLE_NAME,
      Limit: limit,
    };

    if (lastKey) {
      params.ExclusiveStartKey = JSON.parse(lastKey);
    }

    const result = await dynamoDB.send(new ScanCommand(params));

    return {
      items: result.Items as ITodo[] || [],
      lastEvaluatedKey: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : undefined,
    };
  }
}
