# Data Contract YAML Template

Cấu trúc Data Contract YAML (`schema/data_contract.yaml`):

```yaml
contract_version: "1.0.0"
dataset: "orders"
source_endpoint: "GET /api/v1/orders"
schema:
  fields:
    - name: "id"
      type: "integer"
      nullable: false
      description: "Primary key của đơn hàng"
    - name: "order_number"
      type: "string"
      nullable: false
      format: "^ORD-[0-9]{4}-[0-9]+$"
    - name: "total_amount"
      type: "numeric"
      nullable: false
    - name: "status"
      type: "string"
      allowed_values: ["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"]
quality_rules:
  - rule: "id must be unique"
    level: "critical"
  - rule: "total_amount must be greater than or equal to 0"
    level: "critical"
  - rule: "order_number must not be null"
    level: "critical"
```

## Ví dụ Data Contract cho Users dataset:

```yaml
contract_version: "1.0.0"
dataset: "users"
source_endpoint: "GET /api/v1/users"
schema:
  fields:
    - name: "id"
      type: "integer"
      nullable: false
      description: "Primary key của người dùng"
    - name: "name"
      type: "string"
      nullable: false
      description: "Họ và tên đầy đủ"
    - name: "email"
      type: "string"
      nullable: true
      format: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
      description: "Email liên hệ (có thể không có)"
    - name: "createdAt"
      type: "datetime"
      nullable: false
      format: "ISO-8601"
    - name: "roles"
      type: "array[string]"
      nullable: false
      description: "Danh sách vai trò của người dùng"
quality_rules:
  - rule: "id must be unique"
    level: "critical"
  - rule: "email must match email format"
    level: "high"
  - rule: "name must not be empty string"
    level: "critical"
  - rule: "createdAt must be valid ISO-8601 datetime"
    level: "high"
```
