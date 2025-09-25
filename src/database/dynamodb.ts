import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Create DynamoDB client
const client = new DynamoDBClient({
  region: process.env.REGION || 'us-east-1',
});

// Create DynamoDB document client
export const dynamoDB = DynamoDBDocumentClient.from(client);

// Table name
export const TABLE_NAME = process.env.DYNAMODB_TABLE || 'serverless-todo-api-dev';
