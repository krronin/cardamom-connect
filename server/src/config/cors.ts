// Enable CORS for all routes
export const corsOptions = {
  origin: 'http://localhost:5173',                  // Allow requests only from this origin
  methods: 'GET,POST,PATCH,DELETE',                 // Allow only GET and POST methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
};
