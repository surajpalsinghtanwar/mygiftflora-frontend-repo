# Product DTO Validation Examples

This document contains recommended validation rules for the product create/update payload you described. It includes examples for:

- Joi (Express/Koa)
- class-validator (NestJS / TypeScript)
- JSON Schema

These examples focus on fields you asked about: category_id, subcategory_id, subsubcategory_id, variants array, images, and general product metadata.

---

## 1) Joi (Express / Koa)

```js
const Joi = require('joi');

const variantSchema = Joi.object({
  label: Joi.string().allow('', null),
  value: Joi.string().allow('', null),
  price: Joi.number().required(),
  originalPrice: Joi.number().optional(),
  isDefault: Joi.boolean().default(false),
  weight: Joi.string().allow('', null),
  serves: Joi.string().allow('', null),
});

const productSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string().allow('', null),
  short_description: Joi.string().allow('', null),
  sku: Joi.string().allow('', null),
  stock: Joi.number().integer().min(0).default(0),
  category_id: Joi.string().guid({ version: ['uuidv4','uuidv5'] }).required(),
  subcategory_id: Joi.string().guid().optional().allow(null,''),
  subsubcategory_id: Joi.string().guid().optional().allow(null,''),
  price: Joi.number().precision(2).required(),
  discounted_price: Joi.number().precision(2).optional(),
  variants: Joi.array().items(variantSchema).min(1).required(),
  // File uploads (main_image and gallery_images) should be validated separately using multer or the file middleware
});

module.exports = productSchema;
```

Notes:
- Validate uploaded files (content-type, size) in file middleware.
- Return structured errors: { errors: { field: 'message' } } so the frontend can show per-field messages.

---

## 2) class-validator (NestJS / TypeScript)

```ts
import { IsString, IsOptional, IsBoolean, IsNumber, IsUUID, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class VariantDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  originalPrice?: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  category_id: string;

  @IsOptional()
  @IsUUID()
  subcategory_id?: string;

  @IsOptional()
  @IsUUID()
  subsubcategory_id?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discounted_price?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];
}
```

Notes:
- Use NestJS pipes to automatically validate and return 400 with validation errors.

---

## 3) JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": { "type": "string", "minLength": 2 },
    "category_id": { "type": "string", "format": "uuid" },
    "price": { "type": "number" },
    "variants": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "properties": {
          "price": { "type": "number" },
          "isDefault": { "type": "boolean" }
        },
        "required": ["price"]
      }
    }
  },
  "required": ["name", "category_id", "price", "variants"]
}
```

---

### Error format recommendation
Return errors in a consistent shape so the frontend can show per-field messages. Example:

```json
{ "errors": { "name": "Product name already exists", "variants": "At least one variant price required" } }
```

This matches existing frontend code which expects `errorData.errors || {}` when showing errors.

---

If you want, I can also:
- Add an Express/NestJS route example that enforces these validations and demonstrates file handling (multer or busboy).
- Produce a Postman collection JSON that calls the multipart upload with sample images.
- Add a tiny Jest/PwE2E test that posts to the NextJS API proxy or directly to backend.
