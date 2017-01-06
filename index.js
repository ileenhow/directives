export default function () {
  process.env.NODE_ENV === 'production' || console.log('please use `import xxx from \'directives/xxx\'` directly')
}
