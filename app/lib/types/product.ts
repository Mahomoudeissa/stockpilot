export type Product = {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  price: number;
  quantity: number;
  low_stock_threshold: number;
  image_url: string | null;
  category_id: number;
  created_at: string;
  updated_at: string;

  category: {
    name: string;
  } | null;
};
