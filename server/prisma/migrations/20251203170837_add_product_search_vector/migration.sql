-- Add a generated column to store the searchable text
ALTER TABLE "Product" 
ADD COLUMN "searchVector" tsvector 
GENERATED ALWAYS AS (
  to_tsvector('english',
    name || ' ' ||
    coalesce(description, '')
  )
) STORED;

-- Create the index on the generated column
CREATE INDEX IF NOT EXISTS "Product_search_vector_idx"
ON "Product" USING GIN ("searchVector");

-- Create a separate index for category search
CREATE INDEX IF NOT EXISTS "ProductCategory_category_search_idx"
ON "ProductCategory" ("productId");

CREATE INDEX IF NOT EXISTS "Category_name_slug_idx"
ON "Category" USING GIN (
  to_tsvector('english', name || ' ' || slug)
);