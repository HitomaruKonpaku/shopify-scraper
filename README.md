# shopify-scraper

## Pull

```sh
docker pull ghcr.io/hitomarukonpaku/shopify-scraper
```

## Run

### First page

Default `URL`: <https://shop.hololivepro.com/en/products.json>

```sh
docker run --rm -it -v ${PWD}/data:/data ghcr.io/hitomarukonpaku/shopify-scraper
```

## All page

```sh
docker run --rm -it -v ${PWD}/data:/data -e PAGE_ALL=1 ghcr.io/hitomarukonpaku/shopify-scraper
```

## Custom url

```sh
docker run --rm -it -v ${PWD}/data:/data ghcr.io/hitomarukonpaku/shopify-scraper <URL>
```

```sh
docker run --rm -it -v ${PWD}/data:/data ghcr.io/hitomarukonpaku/shopify-scraper https://shop.hololivepro.com/products.json
```

```sh
docker run --rm -it -v ${PWD}/data:/data ghcr.io/hitomarukonpaku/shopify-scraper https://shop.hololivepro.com/en/products.json
```

## References

- [ShopifyScraper](https://github.com/practical-data-science/ShopifyScraper)
- [Using CSV files to import and export products](https://help.shopify.com/en/manual/products/import-export/using-csv)
