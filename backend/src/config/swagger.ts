export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Scalable Real Estate Platform API',
    version: '1.0.0',
    description:
      'Production-grade RESTful API for 99acres & NoBroker inspired real estate platform. Supports 50,000+ indexed listings, JWT authentication with token rotation, anti-spam lead management, and fast faceted search.',
    contact: {
      name: 'Engineering Team',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token in the format: Bearer <token>',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          role: { type: 'string', enum: ['user', 'agent', 'builder'] },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Property: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          owner_id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          property_type: {
            type: 'string',
            enum: ['Apartment', 'Independent House', 'Villa', 'Plot', 'Commercial', 'Builder Floor'],
          },
          listing_type: { type: 'string', enum: ['Sell', 'Rent'] },
          price: { type: 'number' },
          bedrooms: { type: 'integer' },
          bathrooms: { type: 'integer' },
          area_sqft: { type: 'number' },
          furnishing: { type: 'string', enum: ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'] },
          city: { type: 'string' },
          locality: { type: 'string' },
          address: { type: 'string' },
          pincode: { type: 'string' },
          images: { type: 'array', items: { type: 'string' } },
          amenities: { type: 'array', items: { type: 'string' } },
          is_featured: { type: 'boolean' },
          status: { type: 'string', enum: ['active', 'sold', 'inactive'] },
          views_count: { type: 'integer' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          owner_name: { type: 'string' },
          owner_email: { type: 'string' },
          owner_phone: { type: 'string' },
        },
      },
      Inquiry: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          property_id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          message: { type: 'string' },
          status: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          total: { type: 'integer' },
          page: { type: 'integer' },
          limit: { type: 'integer' },
          totalPages: { type: 'integer' },
          hasNextPage: { type: 'boolean' },
          hasPrevPage: { type: 'boolean' },
        },
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Rahul Sharma' },
                  email: { type: 'string', example: 'rahul@example.com' },
                  password: { type: 'string', minLength: 6, example: 'secret123' },
                  phone: { type: 'string', example: '+91 9876543210' },
                  role: { type: 'string', enum: ['user', 'agent', 'builder'], default: 'user' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Registration successful' },
          400: { description: 'Validation error' },
          409: { description: 'Email already exists' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Login and get JWT token pair',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'rahul@example.com' },
                  password: { type: 'string', example: 'secret123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        summary: 'Rotate refresh token and get a new access token',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Token refreshed' },
          401: { description: 'Expired or revoked token' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        summary: 'Get current user profile',
        tags: ['Authentication'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Profile returned' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/properties': {
      get: {
        summary: 'Search & filter properties (supports 50,000+ indexed listings)',
        tags: ['Properties'],
        parameters: [
          { name: 'city', in: 'query', schema: { type: 'string' }, description: 'City name (e.g. Bangalore, Mumbai)' },
          { name: 'propertyType', in: 'query', schema: { type: 'string' } },
          { name: 'listingType', in: 'query', schema: { type: 'string', enum: ['Sell', 'Rent'] } },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'bedrooms', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Full text trigram search query' },
          { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['price_asc', 'price_desc', 'created_at_desc', 'views_desc'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
        ],
        responses: {
          200: { description: 'Properties list with pagination' },
        },
      },
      post: {
        summary: 'Create a new property listing (Multipart or JSON)',
        tags: ['Properties'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['title', 'description', 'property_type', 'price', 'area_sqft', 'city', 'locality'],
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  property_type: { type: 'string' },
                  listing_type: { type: 'string', default: 'Sell' },
                  price: { type: 'number' },
                  bedrooms: { type: 'integer', default: 1 },
                  bathrooms: { type: 'integer', default: 1 },
                  area_sqft: { type: 'number' },
                  furnishing: { type: 'string' },
                  city: { type: 'string' },
                  locality: { type: 'string' },
                  address: { type: 'string' },
                  pincode: { type: 'string' },
                  amenities: { type: 'string', description: 'JSON string array of amenities' },
                  images: { type: 'array', items: { type: 'string', format: 'binary' } },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Property created' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/properties/{id}': {
      get: {
        summary: 'Get property details by ID (increments views count)',
        tags: ['Properties'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Property detail' },
          404: { description: 'Property not found' },
        },
      },
      put: {
        summary: 'Update own property listing',
        tags: ['Properties'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Property updated' },
          403: { description: 'Forbidden (not listing owner)' },
        },
      },
      delete: {
        summary: 'Delete own property listing',
        tags: ['Properties'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Property deleted' },
          403: { description: 'Forbidden (not listing owner)' },
        },
      },
    },
    '/api/properties/{id}/similar': {
      get: {
        summary: 'Get similar properties recommendations based on city, budget band (+-20%), and configuration',
        tags: ['Properties'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 4 } },
        ],
        responses: {
          200: { description: 'Similar properties list' },
        },
      },
    },
    '/api/inquiries': {
      post: {
        summary: 'Send inquiry to property owner (Anti-spam rate limiting & duplicate prevention)',
        tags: ['Inquiries / Leads'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['property_id', 'name', 'email', 'phone', 'message'],
                properties: {
                  property_id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  phone: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Inquiry delivered' },
          429: { description: 'Duplicate inquiry or spam rate limit triggered' },
        },
      },
    },
    '/api/inquiries/my-leads': {
      get: {
        summary: 'Get all inquiries/leads received for properties listed by the authenticated owner',
        tags: ['Inquiries / Leads'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'List of leads received' },
          401: { description: 'Unauthorized' },
        },
      },
    },
  },
};
