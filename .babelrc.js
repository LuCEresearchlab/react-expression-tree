const presets = [
  [
    "react-app"
  ]
]

const plugins = [
  "@babel/plugin-proposal-object-rest-spread",
  "@babel/plugin-proposal-optional-chaining",
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-proposal-class-properties",
  "transform-react-remove-prop-types",
  [
    'babel-plugin-import',
    {
      libraryName: '@material-ui/core',
      libraryDirectory: 'esm',
      camel2DashComponentName: false,
    },
    'core',
  ],
  [
    'babel-plugin-import',
    {
      libraryName: '@material-ui/icons',
      libraryDirectory: 'esm',
      camel2DashComponentName: false,
    },
    'icons',
  ],
];

module.exports = {presets, plugins};