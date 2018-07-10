# yadda-ng

1. Support variable converters
1. State history
1. Injectable / Configurable competition
1. Default to no language
1. Make argument validation injectable
1. Consider removing MultiConverter
1. Localisation
1. Feature Parser


.define('the $trait $colour fox')

.define(/the (quick|sleek) (brown|red) fox/)

.define('the $trait $colour fox', (trait, colour) => {  
})

.define('the $trait $colour fox', promisify((trait, colour, cb) => {  
}))

.define('the $trait $colour fox', (trait, colour) => {

}, [
  new PassthroughConverter(),
  new HtmlColourConverter(),
])


.define([/the (quick|sleek) fox/, /the (quick), (sleek) fox/, /the (sleek), (quick) fox/, (...traits) => {

})

.define([/the (quick|sleek) fox/, /the (quick), (sleek) fox/, /the (sleek), (quick) fox/, (...traits) => {

}, new CyclicConverter({ converters: [new TraitConverter()] })
