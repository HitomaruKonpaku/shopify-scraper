import axios from 'axios'
import { mkdirSync, writeFileSync } from 'fs'
import { json2csv } from 'json-2-csv'
import path from 'path'

function writeCsv(arr: any[]) {
  const dir = process.env.DATA_DIR || '.'
  const file = path.join(dir, `data_${Date.now()}.csv`)
  mkdirSync(dir, { recursive: true })
  const str = json2csv(arr)
  writeFileSync(file, str)
  console.log('csv file:', file)
}

function makeProductItems(data: any) {
  const arr = []

  data.variants.forEach((variant, i) => {
    const tmp = {
      'Handle': data.handle,
      'Title': !i ? data.title : '',
      'Body (HTML)': !i ? data.body_html : '',
      'Vendor': !i ? data.vendor : '',
      'Type': !i ? data.product_type : '',
      'Tags': !i ? data.tags.join(',') : '',
      'Published': data.published_at,
      'Option1 Name': data.options?.[0]?.name || '',
      'Option1 Value': variant.option1 || '',
      'Option2 Name': data.options?.[1]?.name || '',
      'Option2 Value': variant.option2 || '',
      'Option3 Name': data.options?.[2]?.name || '',
      'Option3 Value': variant.option3 || '',
      'Variant SKU': variant.sku,
      'Variant Grams': variant.grams,
      'Variant Inventory Tracker': '',
      'Variant Inventory Policy': 'deny',
      'Variant Fulfillment Service': 'manual',
      'Variant Price': variant.price,
      'Variant Compare At Price': '',
      'Variant Requires Shipping': variant.requires_shipping,
      'Variant Taxable': variant.taxable,
      'Variant Barcode': '',
      'Image Src': data.images[0].src || '',
      'Image Position': data.images[0].position || '',
      'Image Alt Text': '',
      'Gift Card': false,
      'SEO Title': '',
      'SEO Description': '',
      'Google Shopping / Google Product Category': '',
      'Google Shopping / Gender': '',
      'Google Shopping / Age Group': '',
      'Google Shopping / MPN': '',
      'Google Shopping / AdWords Grouping': '',
      'Google Shopping / AdWords Labels': '',
      'Google Shopping / Condition': '',
      'Google Shopping / Custom Product': '',
      'Google Shopping / Custom Label 0': '',
      'Google Shopping / Custom Label 1': '',
      'Google Shopping / Custom Label 2': '',
      'Google Shopping / Custom Label 3': '',
      'Google Shopping / Custom Label 4': '',
      'Variant Image': variant.featured_image?.src,
      'Variant Weight Unit': '',
      'Variant Tax Code': '',
      'Cost per item': '',
      'Status': 'active',
    }
    arr.push(tmp)
  })

  return arr
}

async function fetchProducts(baseUrl: string, page: number) {
  const url = new URL(baseUrl)
  url.searchParams.append('page', page.toString())
  console.log('fetchProducts', url.href)
  const { status, statusText, data } = await axios.get(url.href, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    },
    validateStatus: () => true,
  })
  if (status !== 200) {
    console.warn('status', status)
    console.warn('statusText', statusText)
    return []
  }
  return data.products
}

async function fetchAllProducts(baseUrl: string) {
  const res = []

  for (let page = 1; true; page++) {
    const items = await fetchProducts(baseUrl, page)
    if (!items.length) {
      break
    }

    res.push(...items)

    if (process.env.PAGE_ALL !== '1') {
      break
    }
  }

  return res
}

async function bootstrap() {
  const baseUrl = process.argv[2] || 'https://shop.hololivepro.com/en/products.json'
  console.debug('baseUrl', baseUrl)
  const products = await fetchAllProducts(baseUrl)
  const items = products
    .map((v) => makeProductItems(v))
    .flat()
  writeCsv(items)
}

bootstrap()
