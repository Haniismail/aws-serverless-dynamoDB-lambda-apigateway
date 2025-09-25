import { 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  QueryCommand 
} from '@aws-sdk/lib-dynamodb';
import { dynamoDB, TABLE_NAME } from '../dynamodb';
import { IUser, IUserCreate, IUserUpdate } from '../model/User';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export class UserRepository {
  async create(userData: IUserCreate): Promise<IUser> {
    const now = new Date().toISOString();
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user: IUser = {
      id: uuidv4(),
      ...userData,
      password: hashedPassword,
      verified: false,
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDB.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: user,
    }));

    return user;
  }

  async findById(id: string): Promise<IUser | null> {
    const result = await dynamoDB.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    }));

    return result.Item as IUser || null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const result = await dynamoDB.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email.toLowerCase(),
      },
    }));

    return result.Items?.[0] as IUser || null;
  }

  async update(id: string, updateData: IUserUpdate): Promise<IUser | null> {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.keys(updateData).forEach((key, index) => {
      if (updateData[key as keyof IUserUpdate] !== undefined) {
        updateExpressions.push(`#${key} = :val${index}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:val${index}`] = updateData[key as keyof IUserUpdate];
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

    return result.Attributes as IUser;
  }

  async comparePassword(user: IUser, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }
}
