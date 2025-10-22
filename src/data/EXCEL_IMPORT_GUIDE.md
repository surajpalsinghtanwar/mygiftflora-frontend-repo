# Excel Data Import Guide for MyGiftFlora

## 📁 Available Excel Files

The following Excel files have been created in the `src/data/` folder:

### 1. categories.xlsx
**Purpose**: Main product categories
**Fields**:
- `id` - Unique category identifier
- `name` - Category display name
- `slug` - URL-friendly category name
- `icon` - Emoji or icon for category
- `banner` - Banner image URL (optional)
- `meta_title` - SEO title
- `meta_description` - SEO description
- `status` - TRUE/FALSE (active/inactive)
- `created_at` - Creation date

**Sample Data**: 6 main categories (Cakes, Flowers, Gifts, Plants, Chocolates, Combos)

### 2. subcategories.xlsx
**Purpose**: Sub-categories under main categories
**Fields**:
- `id` - Unique subcategory identifier
- `name` - Subcategory display name
- `slug` - URL-friendly subcategory name
- `category_id` - Links to categories.id
- `category_name` - Parent category name (for reference)
- `icon` - Emoji or icon for subcategory
- `banner` - Banner image URL (optional)
- `meta_title` - SEO title
- `meta_description` - SEO description
- `status` - TRUE/FALSE (active/inactive)
- `created_at` - Creation date

**Sample Data**: 23 subcategories (By Type, By Occasion, By Flavor, etc.)

### 3. subsubcategories.xlsx
**Purpose**: Detailed categories under subcategories
**Fields**:
- `id` - Unique subsubcategory identifier
- `name` - Subsubcategory display name
- `slug` - URL-friendly subsubcategory name
- `category_id` - Links to categories.id
- `category_name` - Parent category name (for reference)
- `subcategory_id` - Links to subcategories.id
- `subcategory_name` - Parent subcategory name (for reference)
- `banner` - Banner image URL (optional)
- `meta_title` - SEO title
- `meta_description` - SEO description
- `status` - TRUE/FALSE (active/inactive)
- `created_at` - Creation date

**Sample Data**: 109 detailed categories (Birthday Cakes, Red Roses, Photo Gifts, etc.)

### 4. products.xlsx
**Purpose**: Individual product listings
**Fields**:
- `id` - Unique product identifier
- `name` - Product display name
- `slug` - URL-friendly product name
- `category_id` - Links to categories.id
- `category_name` - Category name (for reference)
- `subcategory_id` - Links to subcategories.id
- `subcategory_name` - Subcategory name (for reference)
- `subsubcategory_id` - Links to subsubcategories.id
- `subsubcategory_name` - Subsubcategory name (for reference)
- `price` - Current selling price
- `original_price` - Original price (for discount calculation)
- `description` - Detailed product description
- `short_description` - Brief product summary
- `images` - Main product image URL
- `weight` - Product weight/size
- `serves` - How many people it serves (for cakes)
- `rating` - Product rating (1-5)
- `reviews` - Number of reviews
- `stock_count` - Available quantity
- `in_stock` - TRUE/FALSE (available/out of stock)
- `features` - Comma-separated feature list
- `badges` - Comma-separated badge list
- `meta_title` - SEO title
- `meta_description` - SEO description
- `status` - TRUE/FALSE (active/inactive)
- `created_at` - Creation date

**Sample Data**: 13 sample products across all categories

## 🔗 Data Relationships

```
Categories (1) → Subcategories (Many)
    ↓
Subcategories (1) → Subsubcategories (Many)
    ↓
Subsubcategories (1) → Products (Many)
```

### Key Relationships:
- `subcategories.category_id` → `categories.id`
- `subsubcategories.category_id` → `categories.id`
- `subsubcategories.subcategory_id` → `subcategories.id`
- `products.category_id` → `categories.id`
- `products.subcategory_id` → `subcategories.id`
- `products.subsubcategory_id` → `subsubcategories.id`

## 📤 Upload Instructions

### Step 1: Prepare Your Admin Interface
Ensure your admin panel has bulk upload functionality for:
- Categories
- Subcategories
- Subsubcategories
- Products

### Step 2: Upload Order (IMPORTANT!)
Follow this exact order to maintain referential integrity:

1. **First**: Upload `categories.xlsx`
2. **Second**: Upload `subcategories.xlsx`
3. **Third**: Upload `subsubcategories.xlsx`
4. **Fourth**: Upload `products.xlsx`

### Step 3: Validation Checklist
Before uploading, verify:
- [ ] All ID fields are unique
- [ ] All relationship IDs exist in parent tables
- [ ] Required fields are not empty
- [ ] Image URLs are valid and accessible
- [ ] Prices are in correct format (numbers only)
- [ ] Status fields are TRUE/FALSE
- [ ] Dates are in proper format

### Step 4: Test Upload
1. Start with a small batch (5-10 records per file)
2. Verify data appears correctly in frontend
3. Check all relationships work properly
4. Test search and filtering functionality
5. Proceed with full upload

## 🛠️ Customization Guide

### Adding New Categories
1. Open `categories.xlsx`
2. Add new row with unique ID
3. Fill all required fields
4. Upload via admin panel

### Adding New Products
1. Ensure category hierarchy exists
2. Open `products.xlsx`
3. Add new row with:
   - Unique product ID
   - Valid category_id, subcategory_id, subsubcategory_id
   - All required product information
4. Upload via admin panel

### Modifying Existing Data
1. Download current data from admin panel
2. Make modifications in Excel
3. Re-upload (may need to handle duplicates)

## 🎯 Sample Data Overview

### Categories (6):
- Cakes (birthday, wedding, designer varieties)
- Flowers (roses, bouquets, arrangements)
- Gifts (personalized, occasion-based)
- Plants (indoor, outdoor, lucky plants)
- Chocolates (dark, milk, shaped varieties)
- Combos (cake+flower, gift hampers)

### Products (13 samples):
- Royal Designer Wedding Cake
- Chocolate Birthday Cake
- Red Rose Bouquet
- Personalized Photo Mug
- Indoor Money Plant
- Premium Dark Chocolate Box
- Valentine Special Combo
- And more...

## ⚠️ Important Notes

1. **ID Management**: Keep track of highest ID numbers to avoid conflicts
2. **Image URLs**: Ensure all image URLs are accessible and properly formatted
3. **SEO Fields**: Fill meta_title and meta_description for better search rankings
4. **Pricing**: Use consistent currency format (numbers only, no symbols)
5. **Status Fields**: Use TRUE/FALSE (not 1/0 or Yes/No)
6. **Relationships**: Always verify parent records exist before adding children

## 🔧 Troubleshooting

### Common Issues:
1. **Foreign Key Errors**: Check that all referenced IDs exist in parent tables
2. **Duplicate Key Errors**: Ensure all IDs are unique
3. **Invalid Data Format**: Check date, price, and boolean field formats
4. **Missing Required Fields**: Verify all required fields are filled

### Solutions:
1. Use Excel data validation to prevent errors
2. Create lookup tables for ID references
3. Test with small batches first
4. Keep backup of working data

## 📞 Support

If you encounter issues during upload:
1. Check this documentation first
2. Verify data format and relationships
3. Test with smaller datasets
4. Contact technical support with specific error messages

---

**Generated on**: 2024-10-08
**Version**: 1.0
**Files**: categories.xlsx, subcategories.xlsx, subsubcategories.xlsx, products.xlsx