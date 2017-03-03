//--------------------------------------------------
// REFERENCE
//--------------------------------------------------

var baseUrl = 'https://openapi.etsy.com/v2/listings/active.js'
var apiKey = '9sfgsyb7qbqbo1c79sraetsl'
    // format: https://openapi.etsy.com/v2/listings/active?api_key=9sfgsyb7qbqbo1c79sraetsl
    // search url: https://openapi.etsy.com/v2/listings/active?keywords=teeth&api_key=9sfgsyb7qbqbo1c79sraetsl

//--------------------------------------------------
// MODELS
//--------------------------------------------------

var MultiCollection = Backbone.Collection.extend({
    url: 'https://openapi.etsy.com/v2/listings/active.js',

    parse: function(apiResponse) {
        return apiResponse.results
    }

})

var SingleModel = Backbone.Model.extend({

})

//--------------------------------------------------
// VIEWS
//--------------------------------------------------

var MultiView = Backbone.View.extend({
    initialize: function() {
        document.querySelector('.container').innerHTML = '<img src="magnify.gif">'
        this.listenTo(this.collection, 'sync', this.render)
    },

    render: function() {
        var containerNode = document.querySelector('.container')
        var htmlString = ''
        this.collection.forEach(function(inputModel) {
            htmlString += '<div class="itemContainer"' + inputModel.get('listing_id') + '">'
             			+ '<div class="title">' + inputModel.get('title') + '</div>'
             			+ '<img src="' + inputModel.get('Images')[0].url_170x135 + '">'
             			+ '<div class="price">' + '$' + inputModel.get('price') + '</div>'
             			+ '</div>'
            containerNode.innerHTML = htmlString
        })
    }
})

var SingleView = Backbone.View.extend({

})

//--------------------------------------------------
// CONTROLLER
//--------------------------------------------------

var EtsyRouter = Backbone.Router.extend({
    routes: {
        "home": "showMultiView",
        "search/:query": "performSearch",
        "details/:id": "showSingleView",
        "*default": "takeMeHome"
    },

    showMultiView: function() {
        var homeInstance = new MultiCollection()
        homeInstance.fetch({
            dataType: 'jsonp',
            data: {
                includes: "Images",
                "api_key": '9sfgsyb7qbqbo1c79sraetsl'
            }
        })
        new MultiView({
            collection: homeInstance
        })
    },

    performSearch: function(query) {
        var newSearch = new MultiCollection()
        newSearch.fetch({
            dataType: 'jsonp',
            data: {
                includes: "Images",
                "api_key": "9sfgsyb7qbqbo1c79sraetsl",
                keywords: query
            }
        })
        new MultiView({
            collection: newSearch
        })
    },

    showSingleView: function(id) {
        
    },

    takeMeHome: function() {
    	location.hash = 'home'
    }
})

//--------------------------------------------------
// SEARCH
//--------------------------------------------------

var searchNode = document.querySelector('.search')
searchNode.addEventListener('keydown', function(eventObj) {
        if (eventObj.keyCode === 13) {
            var input = eventObj.target.value 
            location.hash = 'search/' + input 
            eventObj.target.value = ''
        }
    })

//--------------------------------------------------
// START POINT
//--------------------------------------------------

new EtsyRouter()

Backbone.history.start()