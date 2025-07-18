<template>
  <section id="demo" class="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
    <div class="max-w-7xl mx-auto">
      <!-- Section header -->
      <div class="mx-auto max-w-2xl text-center mb-16">
        <h2 class="text-base font-semibold leading-7 text-indigo-400">Live Demo</h2>
        <p class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          See MCPFactory in action
        </p>
        <p class="mt-6 text-lg leading-8 text-gray-300">
          Watch how any API transforms into a fully-functional MCP server in real-time.
        </p>
      </div>

      <!-- Demo container with terminal-like UI -->
      <div class="relative overflow-hidden rounded-2xl bg-gray-800/50 shadow-2xl ring-1 ring-white/10">
        <!-- Browser chrome -->
        <div class="flex items-center gap-x-4 border-b border-gray-700 bg-gray-900/75 px-4 py-3">
          <div class="flex gap-x-1.5">
            <div class="h-3 w-3 rounded-full bg-gray-600"></div>
            <div class="h-3 w-3 rounded-full bg-gray-600"></div>
            <div class="h-3 w-3 rounded-full bg-gray-600"></div>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-x-2 rounded-md bg-gray-800 px-3 py-1 text-sm text-gray-400">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              mcpfactory.com/studio
            </div>
          </div>
          <div class="flex items-center gap-x-2 text-xs text-gray-500">
            <span>Live</span>
            <div class="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
          </div>
        </div>

        <!-- Content area -->
        <div class="p-6 lg:p-8">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <!-- Input panel -->
            <div>
              <div class="mb-4 flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-300">Input: OpenAPI Spec</h3>
                <select v-model="selectedExample" class="rounded-md bg-gray-800 px-3 py-1 text-sm text-gray-300 ring-1 ring-gray-700 focus:ring-indigo-500">
                  <option value="weather">Weather API</option>
                  <option value="database">SQL Database</option>
                  <option value="python">Python Module</option>
                </select>
              </div>
              <div class="relative">
                <pre class="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-300"><code>{{ examples[selectedExample].input }}</code></pre>
                <button class="absolute right-2 top-2 rounded-md bg-gray-800 p-1.5 text-gray-400 hover:text-gray-200">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Output panel -->
            <div>
              <div class="mb-4 flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-300">Output: MCP Server</h3>
                <span class="rounded-full bg-green-400/10 px-2.5 py-0.5 text-xs font-medium text-green-400 ring-1 ring-green-400/20">
                  Auto-generated
                </span>
              </div>
              <div class="relative">
                <pre class="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-300"><code>{{ examples[selectedExample].output }}</code></pre>
                <button class="absolute right-2 top-2 rounded-md bg-gray-800 p-1.5 text-gray-400 hover:text-gray-200">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Action bar -->
          <div class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-700 pt-6">
            <div class="flex flex-wrap items-center gap-4 text-sm">
              <span class="flex items-center gap-x-2 text-gray-400">
                <svg class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                MCP Protocol v1.0
              </span>
              <span class="flex items-center gap-x-2 text-gray-400">
                <svg class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Type-safe
              </span>
              <span class="flex items-center gap-x-2 text-gray-400">
                <svg class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Instant deploy
              </span>
            </div>
            <button @click="$router.push('/dashboard')" class="btn-primary text-sm">
              Try it yourself →
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const selectedExample = ref('weather')

const examples = {
  weather: {
    input: `{
  "openapi": "3.0.0",
  "info": {
    "title": "Weather API",
    "version": "1.0.0"
  },
  "paths": {
    "/weather/{city}": {
      "get": {
        "summary": "Get current weather",
        "parameters": [{
          "name": "city",
          "in": "path",
          "required": true,
          "schema": { "type": "string" }
        }],
        "responses": {
          "200": {
            "description": "Weather data"
          }
        }
      }
    }
  }
}`,
    output: `// Auto-generated MCP Server
import { MCPServer, Tool } from '@mcpfactory/sdk';

const server = new MCPServer({
  name: 'weather-api',
  version: '1.0.0'
});

server.addTool({
  name: 'get_weather',
  description: 'Get current weather for a city',
  inputSchema: {
    type: 'object',
    properties: {
      city: { 
        type: 'string',
        description: 'City name'
      }
    },
    required: ['city']
  },
  handler: async ({ city }) => {
    const response = await fetch(\`/weather/\${city}\`);
    return await response.json();
  }
});

export default server;`
  },
  database: {
    input: `-- SQL Schema
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2),
  stock INTEGER DEFAULT 0
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);`,
    output: `// Auto-generated MCP Server
import { MCPServer } from '@mcpfactory/sdk';
import { db } from './database';

const server = new MCPServer({
  name: 'product-database',
  version: '1.0.0'
});

server.addTool({
  name: 'query_products',
  description: 'Search and filter products',
  inputSchema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      minPrice: { type: 'number' },
      maxPrice: { type: 'number' },
      inStock: { type: 'boolean' }
    }
  },
  handler: async (params) => {
    return await db.products.find(params);
  }
});

server.addTool({
  name: 'create_order',
  description: 'Create a new order',
  inputSchema: {
    type: 'object',
    properties: {
      productId: { type: 'integer' },
      quantity: { type: 'integer' }
    },
    required: ['productId', 'quantity']
  },
  handler: async ({ productId, quantity }) => {
    return await db.orders.create({
      product_id: productId,
      quantity
    });
  }
});

export default server;`
  },
  python: {
    input: `# data_analyzer.py
import pandas as pd
import numpy as np

class DataAnalyzer:
    """Analyze datasets with statistical methods"""
    
    def summarize(self, df: pd.DataFrame) -> dict:
        """Get statistical summary of dataframe"""
        return {
            'shape': df.shape,
            'columns': df.columns.tolist(),
            'stats': df.describe().to_dict()
        }
    
    def correlate(self, df: pd.DataFrame, 
                  method: str = 'pearson') -> dict:
        """Calculate correlation matrix"""
        return df.corr(method=method).to_dict()
    
    def detect_outliers(self, df: pd.DataFrame, 
                        column: str, 
                        threshold: float = 3) -> list:
        """Detect outliers using z-score method"""
        z_scores = np.abs((df[column] - df[column].mean()) 
                         / df[column].std())
        return df[z_scores > threshold].index.tolist()`,
    output: `// Auto-generated MCP Server
import { MCPServer } from '@mcpfactory/sdk';
import { PythonBridge } from '@mcpfactory/python-bridge';

const server = new MCPServer({
  name: 'data-analyzer',
  version: '1.0.0'
});

const analyzer = new PythonBridge('./data_analyzer.py');

server.addTool({
  name: 'summarize_data',
  description: 'Get statistical summary of dataframe',
  inputSchema: {
    type: 'object',
    properties: {
      data: { 
        type: 'array',
        description: 'Dataset as array of objects'
      }
    },
    required: ['data']
  },
  handler: async ({ data }) => {
    return await analyzer.call('summarize', { df: data });
  }
});

server.addTool({
  name: 'calculate_correlation',
  description: 'Calculate correlation matrix',
  inputSchema: {
    type: 'object',
    properties: {
      data: { type: 'array' },
      method: { 
        type: 'string',
        enum: ['pearson', 'spearman', 'kendall'],
        default: 'pearson'
      }
    },
    required: ['data']
  },
  handler: async ({ data, method }) => {
    return await analyzer.call('correlate', { 
      df: data, 
      method 
    });
  }
});

server.addTool({
  name: 'detect_outliers',
  description: 'Detect outliers using z-score method',
  inputSchema: {
    type: 'object',
    properties: {
      data: { type: 'array' },
      column: { type: 'string' },
      threshold: { 
        type: 'number',
        default: 3
      }
    },
    required: ['data', 'column']
  },
  handler: async ({ data, column, threshold }) => {
    return await analyzer.call('detect_outliers', {
      df: data,
      column,
      threshold
    });
  }
});

export default server;`
  }
}
</script>