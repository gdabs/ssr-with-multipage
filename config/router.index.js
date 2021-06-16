module.exports = {
  entry: 'index',
  path: '/index',
  exact: true,
  Component: () => (require('@/page/index').default),
}