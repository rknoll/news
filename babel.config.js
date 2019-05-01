const browsers = [
  '> 1%',
  'last 3 versions',
  'ios > 8',
  'not ie < 10'
];
const node = 'current';

const getCommonConfig = (targets = {}) => [
  [
    '@babel/env',
    {
      targets,
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
    presets: getCommonConfig(process.env.IS_WEBPACK === 'true' ? { browsers } : { node }),
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ]
  };
};

module.exports = config;
