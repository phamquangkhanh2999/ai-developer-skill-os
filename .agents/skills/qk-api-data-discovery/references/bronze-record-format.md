# Bronze Record Format — NDJSON (Newline Delimited JSON)

Mỗi dòng là một đối tượng JSON độc lập, bảo tồn trọn vẹn dữ liệu gốc và dữ liệu truy vết:

```json
{
  "ingestion_metadata": {
    "ingestion_id": "b7a2d481-9f33-4a11-8e02-4876211c1209",
    "ingested_at": "2026-09-15T10:20:31.402Z",
    "source_type": "postman_collection",
    "collection_name": "ECommerce-Core-API",
    "endpoint": "GET /api/v1/orders",
    "environment": "staging",
    "status_code": 200,
    "response_time_ms": 184
  },
  "raw_request": {
    "method": "GET",
    "url": "https://staging.api.example.com/api/v1/orders?page=1&pageSize=20",
    "headers": {
      "Accept": "application/json",
      "Authorization": "Bearer [REDACTED_SECRET]"
    }
  },
  "raw_response": {
    "status": 200,
    "status_text": "OK",
    "headers": {
      "content-type": "application/json; charset=utf-8",
      "x-ratelimit-remaining": "59"
    },
    "body": {
      "data": [
        { "id": 501, "order_number": "ORD-2026-001", "total_amount": 1250000, "status": "COMPLETED" }
      ],
      "pagination": { "page": 1, "pageSize": 20, "total": 1 }
    }
  }
}
```

## Ví dụ nhiều bản ghi NDJSON:

```ndjson
{"ingestion_metadata":{"ingestion_id":"b7a2d481-9f33-4a11-8e02-4876211c1209","ingested_at":"2026-09-15T10:20:31.402Z","source_type":"postman_collection","collection_name":"ECommerce-Core-API","endpoint":"GET /api/v1/orders","environment":"staging","status_code":200,"response_time_ms":184},"raw_request":{"method":"GET","url":"https://staging.api.example.com/api/v1/orders?page=1&pageSize=20","headers":{"Accept":"application/json","Authorization":"Bearer [REDACTED_SECRET]}},"raw_response":{"status":200,"status_text":"OK","headers":{"content-type":"application/json; charset=utf-8","x-ratelimit-remaining":"59"},"body":{"data":[{"id":501,"order_number":"ORD-2026-001","total_amount":1250000,"status":"COMPLETED"}],"pagination":{"page":1,"pageSize":20,"total":1}}}}
{"ingestion_metadata":{"ingestion_id":"c8b3e592-0a44-5b22-9f33-5987322d3110","ingested_at":"2026-09-15T10:21:15.100Z","source_type":"postman_collection","collection_name":"ECommerce-Core-API","endpoint":"GET /api/v1/users","environment":"staging","status_code":200,"response_time_ms":92},"raw_request":{"method":"GET","url":"https://staging.api.example.com/api/v1/users?page=1&pageSize=20","headers":{"Accept":"application/json","Authorization":"Bearer [REDACTED_SECRET]}},"raw_response":{"status":200,"status_text":"OK","headers":{"content-type":"application/json; charset=utf-8","x-ratelimit-remaining":"120"},"body":{"data":[{"id":1024,"name":"Nguyen Van A","createdAt":"2026-09-15T10:20:00Z"}],"pagination":{"page":1,"pageSize":20,"total":128}}}}
```
