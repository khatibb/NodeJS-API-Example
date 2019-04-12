module.exports = {
    'env': {
        'commonjs': true,
        'es6': true,
        'node': true,
        'jest':true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018,
        "ecmaFeatures": {
            "impliedStrict": true
          }
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ],
        "brace-style": ["error", "stroustrup"],
        "prefer-const": ["error"],
        "new-cap": ["off"],
        'padded-blocks': ["error", "always"],
        'array-bracket-spacing': ["error", "always"]
    }
}