// Sitemap generator utility
export function generateSitemap(routes, baseUrl = 'https://mcpfactory.com') {
  const staticRoutes = [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/pricing', priority: 0.9, changefreq: 'weekly' },
    { path: '/docs', priority: 0.8, changefreq: 'weekly' },
    { path: '/about', priority: 0.7, changefreq: 'monthly' },
    { path: '/login', priority: 0.5, changefreq: 'monthly' },
    { path: '/register', priority: 0.6, changefreq: 'monthly' }
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticRoutes.map(route => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return xml
}