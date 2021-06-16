module.exports = {
  entry: 'news',
  path: '/news/:id',
  exact: true,
  Component: () => require('@/page/news').default,
}