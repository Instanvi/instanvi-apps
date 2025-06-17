module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'nx affected --target=lint --uncommitted',
    'nx affected --target=format --uncommitted',
    'nx affected --target=test --uncommitted'
  ],
  '*.{json,md,html,css,scss}': [
    'nx affected --target=format --uncommitted'
  ]
};