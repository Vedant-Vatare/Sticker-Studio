CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_perfect_search_idx"
ON "Product" USING GIN (
  to_tsvector('english',
    name || ' ' ||
    coalesce(description, '') || ' ' ||
    coalesce((
      SELECT string_agg(c.name || ' ' || c.slug, ' ')
      FROM "ProductCategory" pc
      JOIN "Category" c ON pc."categoryId" = c.id
      WHERE pc."productId" = "Product".id
    ), '')
  )
);