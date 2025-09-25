# Serverless Todo API - Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                AWS Cloud                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   Frontend      │    │   API Gateway   │    │   Lambda        │            │
│  │   (S3 Hosted)   │◄──►│   (REST API)    │◄──►│   (Express.js)  │            │
│  │                 │    │                 │    │                 │            │
│  │ • Static HTML   │    │ • Route /api/*  │    │ • JWT Auth      │            │
│  │ • JavaScript    │    │ • CORS Enabled  │    │ • CRUD Logic    │            │
│  │ • CSS Styling   │    │ • Rate Limiting │    │ • Validation    │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│                                                         │                     │
│                                                         ▼                     │
│                                               ┌─────────────────┐            │
│                                               │   DynamoDB      │            │
│                                               │   (NoSQL DB)    │            │
│                                               │                 │            │
│                                               │ • Users Table   │            │
│                                               │ • Todos Table   │            │
│                                               │ • GSI Indexes   │            │
│                                               └─────────────────┘            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Detailed Component Architecture

### 1. Frontend (S3 Static Website)
```
┌─────────────────────────────────────────────────────────┐
│                    S3 Bucket                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              index.html                         │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │         Authentication UI               │   │   │
│  │  │  • Login Form                          │   │   │
│  │  │  • Register Form                       │   │   │
│  │  │  • JWT Token Management                │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │           Todo Management UI            │   │   │
│  │  │  • Create Todo                         │   │   │
│  │  │  • List Todos                          │   │   │
│  │  │  • Update Todo                         │   │   │
│  │  │  • Delete Todo                         │   │   │
│  │  │  • Priority Management                 │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 2. API Gateway Configuration
```
┌─────────────────────────────────────────────────────────┐
│                  API Gateway                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Route Configuration                │   │
│  │                                                 │   │
│  │  GET  /dev/api/v1/health                        │   │
│  │  POST /dev/api/v1/auth/register                 │   │
│  │  POST /dev/api/v1/auth/login                    │   │
│  │  GET  /dev/api/v1/auth/me                       │   │
│  │  GET  /dev/api/v1/todos                         │   │
│  │  POST /dev/api/v1/todos                         │   │
│  │  GET  /dev/api/v1/todos/{id}                    │   │
│  │  PUT  /dev/api/v1/todos/{id}                    │   │
│  │  DELETE /dev/api/v1/todos/{id}                  │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Security Features                  │   │
│  │  • CORS Configuration                          │   │
│  │  • Request Validation                          │   │
│  │  • Rate Limiting                               │   │
│  │  • CloudWatch Logging                          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 3. Lambda Function (Express.js Application)
```
┌─────────────────────────────────────────────────────────┐
│                  AWS Lambda                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Express.js App                     │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │            Middleware Layer             │   │   │
│  │  │  • Helmet (Security)                   │   │   │
│  │  │  • CORS                                │   │   │
│  │  │  • Body Parser                         │   │   │
│  │  │  • JWT Authentication                  │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │            Controller Layer             │   │   │
│  │  │  • Auth Controllers                     │   │   │
│  │  │  • Todo Controllers                     │   │   │
│  │  │  • Error Handling                       │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │            Service Layer                │   │   │
│  │  │  • User Repository                      │   │   │
│  │  │  • Todo Repository                      │   │   │
│  │  │  • DynamoDB Client                      │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 4. DynamoDB Data Model
```
┌─────────────────────────────────────────────────────────┐
│                  DynamoDB Tables                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Users Table                        │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │  Primary Key: id (String)               │   │   │
│  │  │  Attributes:                            │   │   │
│  │  │  • email (String)                       │   │   │
│  │  │  • firstName (String)                   │   │   │
│  │  │  • lastName (String)                    │   │   │
│  │  │  • password (String)                    │   │   │
│  │  │  • verified (Boolean)                   │   │   │
│  │  │  • createdAt (String)                   │   │   │
│  │  │  • updatedAt (String)                   │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │  GSI: email-index                       │   │   │
│  │  │  • Partition Key: email                 │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Todos Table                        │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │  Primary Key: id (String)               │   │   │
│  │  │  Attributes:                            │   │   │
│  │  │  • userId (String)                      │   │   │
│  │  │  • title (String)                       │   │   │
│  │  │  • description (String)                 │   │   │
│  │  │  • completed (Boolean)                  │   │   │
│  │  │  • priority (String)                    │   │   │
│  │  │  • dueDate (String)                     │   │   │
│  │  │  • tags (String Array)                  │   │   │
│  │  │  • createdAt (String)                   │   │   │
│  │  │  • updatedAt (String)                   │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │  GSI: userId-createdAt-index            │   │   │
│  │  │  • Partition Key: userId                │   │   │
│  │  │  • Sort Key: createdAt                  │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Registration/Login Flow
```
Frontend → API Gateway → Lambda → DynamoDB
    ↓           ↓          ↓         ↓
1. User fills  → 2. POST   → 3. Joi   → 4. Hash
   form           request     validation  password
    ↓           ↓          ↓         ↓
5. Display     ← 6. JWT    ← 7. Create ← 8. Store
   success        token      user       in DB
```

### 2. Todo CRUD Flow
```
Frontend → API Gateway → Lambda → DynamoDB
    ↓           ↓          ↓         ↓
1. User action → 2. HTTP   → 3. JWT   → 4. Query/
   (CRUD)        request     auth      Update
    ↓           ↓          ↓         ↓
5. Update UI   ← 6. JSON  ← 7. Process ← 8. Return
   display       response    data       results
```

## Security Architecture

### 1. Authentication & Authorization
```
┌─────────────────────────────────────────────────────────┐
│                Security Layers                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              API Gateway                        │   │
│  │  • CORS Configuration                          │   │
│  │  • Request Validation                          │   │
│  │  • Rate Limiting                               │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Lambda Function                    │   │
│  │  • JWT Token Validation                        │   │
│  │  • Helmet Security Headers                     │   │
│  │  • Input Sanitization                          │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              DynamoDB                           │   │
│  │  • IAM Role-based Access                       │   │
│  │  • Encryption at Rest                          │   │
│  │  • VPC Endpoints (Optional)                    │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture

### 1. CI/CD Pipeline
```
┌─────────────────────────────────────────────────────────┐
│                Deployment Flow                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Development                        │   │
│  │  • Local Development (npm run dev)             │   │
│  │  • Serverless Offline (npm run offline)       │   │
│  │  • Testing & Validation                        │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Build & Deploy                     │   │
│  │  • TypeScript Compilation                      │   │
│  │  • Serverless Deploy (npm run deploy)         │   │
│  │  • AWS Resource Creation                       │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Production                         │   │
│  │  • Lambda Function Deployed                    │   │
│  │  • API Gateway Configured                      │   │
│  │  • DynamoDB Tables Created                     │   │
│  │  • S3 Frontend Hosted                          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Monitoring & Logging

### 1. CloudWatch Integration
```
┌─────────────────────────────────────────────────────────┐
│                Monitoring Stack                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │              CloudWatch Logs                    │   │
│  │  • Lambda Function Logs                         │   │
│  │  • API Gateway Access Logs                      │   │
│  │  • Application Error Logs                       │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              CloudWatch Metrics                 │   │
│  │  • Lambda Invocations                          │   │
│  │  • API Gateway Request Count                   │   │
│  │  • DynamoDB Read/Write Capacity                │   │
│  │  • Error Rates                                 │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              CloudWatch Alarms                  │   │
│  │  • High Error Rate Alerts                      │   │
│  │  • High Latency Alerts                         │   │
│  │  • DynamoDB Throttling Alerts                  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Cost Optimization

### 1. Pay-per-Use Model
- **Lambda**: Pay only for actual function invocations
- **API Gateway**: Pay per API call
- **DynamoDB**: Pay per read/write request
- **S3**: Pay for storage and requests

### 2. Auto-scaling
- **Lambda**: Automatically scales based on demand
- **DynamoDB**: Auto-scaling based on traffic patterns
- **API Gateway**: No scaling configuration needed

## Scalability Features

### 1. Horizontal Scaling
- Multiple Lambda instances can run concurrently
- DynamoDB automatically partitions data
- API Gateway handles high request volumes

### 2. Performance Optimization
- Lambda cold start optimization
- DynamoDB connection pooling
- API Gateway response caching
- S3 CloudFront CDN (optional)

This architecture provides a robust, scalable, and cost-effective solution for a serverless todo application that can handle varying loads while maintaining high availability and security.
