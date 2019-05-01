const browsers = [
  '> 1%',
  'last 3 versions',
  'ios > 8',
  'not ie < 10'
];

const getCommonConfig = (targets = {}) => [
  [
    '@babel/env',
    {
      targets: {
        node: 'current',
        ...targets
      },
      useBuiltIns: 'usage',
      corejs: {
        version: 2,
      },
    }
  ],
  '@babel/react',
];

const config = (api) => {
  api.cache(true);

  return {
    presets: getCommonConfig({ browsers }),
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ]
  };
};

module.exports = config;
