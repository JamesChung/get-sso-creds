import { expect, test } from '@oclif/test'

describe('select', () => {
  test
    .stdout()
    .command(['select'])
    .it('runs loading', ctx => {
      expect(ctx.stdout).to.contain('Loading')
    })

  // test
  //   .stdout()
  //   .command(['select', '--name', 'jeff'])
  //   .it('runs hello --name jeff', ctx => {
  //     expect(ctx.stdout).to.contain('hello jeff')
  //   })
})
