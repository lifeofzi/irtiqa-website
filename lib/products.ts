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
  printroveProductId: number;
  // Maps size/model label → Printrove variant ID
  printroveVariantIds: Record<string, number>;
}

export const PRODUCTS: Product[] = [
  {
    id: 'irtiqa-tee-men',
    name: 'IRTIQA EP Tee',
    subtitle: "Men's Oversized",
    price: 599,
    description: 'Limited edition oversized tee. IRTIQA printed in red on black. 100% heavy cotton. Drops below the hip — wear it loud.',
    tag: 'Apparel',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    sizeLabel: 'Size',
    images: ['/merch-tee-3.jpg', '/merch-tee-2.jpg', '/merch-tee.jpg'],
    sizeChartType: 'men',
    printroveProductId: 857314,
    printroveVariantIds: {
      'XS': 23236498,
      'S':  23236495,
      'M':  23236496,
      'L':  23236492,
      'XL': 23236494,
      '2XL': 23236497,
    },
  },
  {
    id: 'irtiqa-phone-cover',
    name: 'IRTIQA Phone Cover',
    subtitle: 'Glass Phone Case',
    price: 399,
    description: 'Limited edition glass case. IRTIQA in red on black. Slim profile, full camera cutout protection. Select your model at checkout.',
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
      'Apple iPhone 16',
      'Apple iPhone 16 Plus',
      'Apple iPhone 16 Pro',
      'Apple iPhone 16 Pro Max',
      'Apple iPhone 17',
      'Apple iPhone 17 Air',
      'Apple iPhone 17 Pro',
      'Apple iPhone 17 Pro Max',
      'OnePlus 11',
      'OnePlus 11R',
      'OnePlus 12',
      'OnePlus 12R',
      'Samsung Galaxy S22 Ultra',
      'Samsung Galaxy S23',
      'Samsung Galaxy S24',
      'Samsung Galaxy S25',
    ],
    sizeLabel: 'Model',
    images: ['/merch-case.jpg'],
    sizeChartType: 'none',
    printroveProductId: 857315,
    printroveVariantIds: {
      'Apple iPhone XR':          23236526,
      'Apple iPhone 11':          23236500,
      'Apple iPhone 11 Pro':      23236501,
      'Apple iPhone 11 Pro Max':  23236502,
      'Apple iPhone 12':          23236503,
      'Apple iPhone 12 Mini':     23236504,
      'Apple iPhone 12 Pro':      23236505,
      'Apple iPhone 12 Pro Max':  23236506,
      'Apple iPhone 13':          23236499,
      'Apple iPhone 13 Mini':     23236507,
      'Apple iPhone 13 Pro':      23236508,
      'Apple iPhone 13 Pro Max':  23236509,
      'Apple iPhone 14':          23236510,
      'Apple iPhone 14 Plus':     23236511,
      'Apple iPhone 14 Pro':      23236512,
      'Apple iPhone 14 Pro Max':  23236513,
      'Apple iPhone 15':          23236514,
      'Apple iPhone 15 Plus':     23236515,
      'Apple iPhone 15 Pro':      23236516,
      'Apple iPhone 15 Pro Max':  23236517,
      'Apple iPhone 16':          23236518,
      'Apple iPhone 16 Plus':     23236519,
      'Apple iPhone 16 Pro':      23236520,
      'Apple iPhone 16 Pro Max':  23236521,
      'Apple iPhone 17':          23236522,
      'Apple iPhone 17 Air':      23236523,
      'Apple iPhone 17 Pro':      23236524,
      'Apple iPhone 17 Pro Max':  23236525,
      'OnePlus 11':               23236527,
      'OnePlus 11R':              23236528,
      'OnePlus 12':               23236529,
      'OnePlus 12R':              23236530,
      'Samsung Galaxy S22 Ultra': 23236531,
      'Samsung Galaxy S23':       23236532,
      'Samsung Galaxy S24':       23236533,
      'Samsung Galaxy S25':       23236534,
    },
  },
];
