import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: [
    {
      'https://login.ichefpos.com/api/graphql/': {
        headers: {
          Authorization: '<TOKEN>',
        },
      },
    },
  ],
  documents: ['src/**/*.gql'],
  generates: {
    './src/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
