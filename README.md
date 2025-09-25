# Serverless Todo + React (Express • DynamoDB • API Gateway • Lambda)

Full‑stack CRUD todos with a React frontend and a serverless backend. Locally, Express runs on port 3001 and the React app (Vite) on port 3000. In AWS, API Gateway invokes a Lambda that runs the exact same Express app (via serverless-http) against DynamoDB.

## 🏗️ Architecture

### Solution Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Lambda        │
│                 │◄──►│   (REST API)    │◄──►│   (Express.js)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │   DynamoDB      │
                                               │   (NoSQL DB)    │
                                               └─────────────────┘
```

### AWS Services

- **API Gateway** → **Lambda** (serverless-http + Express)
- **DynamoDB** (todos)
- **IAM** (execution role / local dev user)
- **CloudWatch** (logs)

## 🚀 Features

- React frontend (Vite) with TanStack Query
- Todo CRUD: list, create, update (toggle complete), delete
- Open endpoints (auth removed)
- Swagger docs at `/api-docs`

## 📁 Structure (high level)

```
src/                # Express app, routes, controllers, DynamoDB repo
frontend/           # React + Vite UI (TanStack Query)
serverless.yml      # API Gateway + Lambda + DynamoDB resources
```

## 🛠️ Prerequisites

- Node.js 18+
- AWS account + IAM user for local dev (DynamoDB access)
- Serverless Framework (for deploy): `npm i -g serverless`

## 📦 Setup

1) Install deps
```bash
npm install
cd frontend && npm install && cd ..
```

2) Env (.env at repo root)
```env
PORT=3001
STAGE=dev
REGION=us-east-1
DYNAMODB_TABLE=serverless-todo-api-dev
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

3) Run both (frontend+backend)
```bash
npm run dev:all
```
Frontend: http://localhost:3000

Backend: http://localhost:3001

Docs: http://localhost:3001/api-docs

## 🚀 Deploy

```bash
serverless deploy --stage dev
```
Output includes the API Gateway URL; your deployed API base is `https://<id>.execute-api.<region>.amazonaws.com/dev/api/v1`.

### Local Development

1. **Start local development server**
   ```bash
   npm run dev
   ```

2. **Start with serverless offline**
   ```bash
   npm run offline
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

## 📚 API Endpoints (open)

- `GET /api/v1/health`
- `GET /api/v1/todos`
- `POST /api/v1/todos`
- `GET /api/v1/todos/:id`
- `PUT /api/v1/todos/:id`
- `DELETE /api/v1/todos/:id`

## 🔧 Config

Env highlights:
- `PORT` (backend) • `REGION` • `DYNAMODB_TABLE`
- `AWS_ACCESS_KEY_ID` • `AWS_SECRET_ACCESS_KEY` (local/dev only; Lambda uses its role)

### DynamoDB Schema

#### Users Table
- **Primary Key**: `id` (String)
- **GSI**: `email-index` on `email` field

#### Todos Table
- **Primary Key**: `id` (String)
- **GSI**: `userId-createdAt-index` on `userId` and `createdAt` fields

## 🧪 Quick Test

```bash
curl http://localhost:3001/api/v1/health
curl -X POST http://localhost:3001/api/v1/todos -H "Content-Type: application/json" -d '{"title":"Try app"}'
```

## 📊 Monitoring and Logs

- **CloudWatch Logs**: All Lambda function logs are automatically sent to CloudWatch
- **API Gateway Logs**: Request/response logging configured
- **Custom Metrics**: Application-specific metrics can be added

## 🔒 Notes

- Auth removed for simplicity (endpoints are public)
- Validate inputs with Joi; set CORS via env
- Lambda uses an execution role; local dev uses IAM user keys

## 💰 Cost Optimization

- **Pay-per-request DynamoDB**: Only pay for actual usage
- **Lambda cold starts**: Optimized for minimal cold start times
- **S3 Static Hosting**: Cost-effective frontend hosting
- **API Gateway**: Pay only for API calls made

## 🚀 Performance Features

- **Auto-scaling**: Lambda automatically scales based on demand
- **Connection pooling**: DynamoDB connection optimization
- **Response caching**: API Gateway response caching
- **Compression**: Gzip compression for responses

## 📈 Scalability

- **Horizontal scaling**: Lambda functions scale automatically
- **Database scaling**: DynamoDB auto-scaling
- **Global deployment**: Can be deployed to multiple AWS regions
- **CDN integration**: CloudFront can be added for global content delivery

## 🛠️ Development Workflow

1. **Local Development**: Use `npm run dev` for local development
2. **Testing**: Write tests in the `__tests__` directory
3. **Linting**: Use `npm run lint` to check code quality
4. **Deployment**: Use `npm run deploy` to deploy to AWS
5. **Monitoring**: Check CloudWatch logs and metrics

## 📝 API Documentation

Once deployed, visit `https://your-api-gateway-url.amazonaws.com/dev/api-docs` for interactive API documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Hani Ismail**

## 🙏 Acknowledgments

- AWS Solutions Architect Associate certification curriculum
- Serverless Framework documentation
- Express.js community
- DynamoDB best practices

---

## 🎯 Learning Outcomes

This project demonstrates:

- ✅ **Serverless Architecture Design**: Understanding of AWS Lambda, API Gateway, and DynamoDB
- ✅ **Event-Driven Applications**: Building scalable, event-driven serverless applications
- ✅ **API Gateway Integration**: Implementing REST APIs with proper routing and authentication
- ✅ **DynamoDB Best Practices**: NoSQL database design and query optimization
- ✅ **Security Implementation**: IAM roles, JWT authentication, and input validation
- ✅ **Cost Optimization**: Understanding serverless cost models and optimization strategies
- ✅ **Monitoring and Logging**: CloudWatch integration and application monitoring
- ✅ **Clean Architecture**: Separation of concerns and maintainable code structure

This project serves as a comprehensive example of modern serverless application development on AWS, showcasing best practices for scalability, security, and maintainability.
