// format: https://openapi.etsy.com/v2/listings/active?api_key=9sfgsyb7qbqbo1c79sraetsl
// search url: https://openapi.etsy.com/v2/listings/active?keywords=teeth&api_key=9sfgsyb7qbqbo1c79sraetsl

var baseUrl = 'https://openapi.etsy.com/v2/listings/active.js?api_key='
var apiKey = '9sfgsyb7qbqbo1c79sraetsl'
console.log(Backbone)

var Router = Backbone.Router.extend({
	routes: {
		"home": "#homePage#",
		"search/:query": "#searchPage#",
		"details/:id": "#detailsPage#",
		"*default": "#goHome#"
	}
})

var instance = new Router()

Backbone.history.start()
































var instance = new Router()

Backbone.history.start()