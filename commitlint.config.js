module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      //   TODO Add Scope Enum Here
      // 'scope-enum': [2, 'always', ['yourscope', 'yourscope']], but i am too lazy to add it
      'type-enum': [
        2,
        'always',
        ['feat', 'fix', 'docs', 'chore', 'style', 'refactor', 'ci', 'test', 'revert', 'perf', 'vercel'],
      ],
    },
  }