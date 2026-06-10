export type SizeChartType = 'men' | 'women' | 'none';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  description: string;
  tag: string;
  sizes: string[];
  sizeLabel: string;
  images: string[];
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
    sizeLabel: 'Size',
    images: [],
    sizeChartType: 'men',
  },
  {
    id: 'irtiqa-tee-women',
    name: 'IRTIQA EP Tee',
    subtitle: "Women's Round Neck",
    price: 599,
    description: 'Limited edition round neck tee. IRTIQA printed in red on black. 100% heavy cotton. Fitted silhouette, true to size.',
    tag: 'Apparel',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
    sizeLabel: 'Size',
    images: [],
    sizeChartType: 'women',
  },
  {
    id: 'irtiqa-phone-cover',
    name: 'IRTIQA Phone Cover',
    subtitle: 'iPhone Hard Case',
    price: 299,
    description: 'Limited edition hard case. IRTIQA in red on black. Slim profile, full camera cutout protection. Select your model at checkout.',
    tag: 'Accessories',
    sizes: [
      'Apple iPhone XR',
      'Apple iPhone 11',
      'Apple iPhone 11 Pro',
      'Apple iPhone 11 Pro Max',
      'Apple iPhone 12',
      'Apple iPhone 12 Mini',
      'Apple iPhone 12 Pro',
      'Apple iPhone 12 Pro Max',
      'Apple iPhone 13',
      'Apple iPhone 13 Mini',
      'Apple iPhone 13 Pro',
      'Apple iPhone 13 Pro Max',
      'Apple iPhone 14',
      'Apple iPhone 14 Plus',
      'Apple iPhone 14 Pro',
      'Apple iPhone 14 Pro Max',
      'Apple iPhone 15',
      'Apple iPhone 15 Plus',
      'Apple iPhone 15 Pro',
      'Apple iPhone 15 Pro Max',
    ],
    sizeLabel: 'Model',
    images: [],
    sizeChartType: 'none',
  },
]
