import importPlugin from 'eslint-plugin-import';

export default [
  {
    // Files to lint
    files: ['**/*.js'],
    
    // Files to ignore
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.min.js',
    ],
    
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Node.js globals
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
      },
    },
    
    plugins: {
      import: importPlugin,
    },
    
    rules: {
      // ===== IMPORT RULES =====
      // Enforce all imports at the top of the file
      'import/first': 'error',
      
      // No duplicate imports
      'import/no-duplicates': 'error',
      
      // Prevent dynamic imports (use static imports only)
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ImportExpression',
          message: 'Dynamic imports (await import()) are not allowed. Use static imports at the top of the file instead.',
        },
      ],

      // ===== CODE QUALITY RULES =====
      // Prefer const over let when variable is not reassigned
      'prefer-const': 'warn',
      
      // No unused variables (relaxed)
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_|^User$' // Allow User to be unused (imported for type safety)
      }],
      
      // Allow console statements (turned off for now)
      'no-console': 'off',
      
      // Require semicolons
      'semi': ['error', 'always'],
      
      // Quotes - turned off for now
      'quotes': 'off',
      
      // No var, use let or const
      'no-var': 'error',
      
      // Prefer arrow functions for callbacks
      'prefer-arrow-callback': 'warn',
      
      // Require === instead of ==
      'eqeqeq': ['error', 'always'],
      
      // No multiple empty lines
      'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 1 }],
    },
  },
  // Exception for loaders - allow dynamic imports for optional dependencies
  {
    files: ['loaders/**/*.js'],
    rules: {
      'no-restricted-syntax': 'off', // Allow dynamic imports in loaders
    },
  },
];

