export type SizeChartType = 'men' | 'women';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  description: string;
  tag: string;
  sizes: string[];
  images: string[];   // paths under /public — empty until real photos are added
  sizeChartType: SizeChartType;
}

export const PRODUCTS: Product[] = [
  {
    id: 'irtiqa-tee-men',
    name: 'IRTIQA EP Tee',
    subtitle: "Men's Oversized",
    price: 599,
    description: 'Limited edition oversized tee. IRTIQA printed in red on black. 100% heavy cotton. Drops below the hip — wear it loud.',
    tag: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    images: [],
    sizeChartType: 'men',
  },
  {
    id: 'irtiqa-tee-women',
    name: 'IRTIQA EP Tee',
    subtitle: "Women's Oversized",
    price: 599,
    description: 'Limited edition oversized tee. IRTIQA printed in red on black. 100% heavy cotton. Relaxed fit, cropped sleeves.',
    tag: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    images: [],
    sizeChartType: 'women',
  },
]
