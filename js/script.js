//--------------------------------------------------
// REFERENCE
//--------------------------------------------------

var baseUrl = 'https://openapi.etsy.com/v2/listings/active.js'
var url = 'https://openapi.etsy.com/v2/listings/'
var apiKey = '9sfgsyb7qbqbo1c79sraetsl'
    // format: https://openapi.etsy.com/v2/listings/active?api_key=9sfgsyb7qbqbo1c79sraetsl
    // search url: https://openapi.etsy.com/v2/listings/active?keywords=teeth&api_key=9sfgsyb7qbqbo1c79sraetsl

//--------------------------------------------------
// MODELS
//--------------------------------------------------

var MultiCollection = Backbone.Collection.extend({
    url: baseUrl,

    parse: function(apiResponse) {
        return apiResponse.results
    }

})

var SingleModel = Backbone.Model.extend({
        url: url,

    parse: function(apiResponse) {
        return apiResponse.results[0]
    }
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
            htmlString += '<a href="#details/' + inputModel.get('listing_id') + '">'
                        + '<div class="itemContainer"' + inputModel.get('listing_id') + '">'
             			+ '<div class="title">' + inputModel.get('title') + '</div>'
             			+ '<img src="' + inputModel.get('Images')[0].url_170x135 + '">'
             			+ '<div class="price">' + '$' + inputModel.get('price') + '</div>'
             			+ '</div>' + '</a>'
            containerNode.innerHTML = htmlString
        })
    }
})

var SingleView = Backbone.View.extend({
    initialize: function() {
        document.querySelector('.container').innerHTML = '<img src="magnify.gif">'
        this.listenTo(this.model, 'sync', this.render)
    },

    render: function() {
        var containerNode = document.querySelector('.container')
        htmlString = ''
        console.log(this)
        htmlString += '<div class="detailPage">'
                    + '<div class ="detailTitle">' + this.model.attributes.title + '</div>'
                    + '<img class ="detailImg" src="' + this.model.attributes.Images[0].url_570xN + '">'
                    + '<div class="detailDescription">' + this.model.attributes.description + '</div>'
                    + '</div>'
        containerNode.innerHTML = htmlString
    }
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
                "api_key": apiKey
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
                "api_key": apiKey,
                keywords: query
            }
        })
        new MultiView({
            collection: newSearch
        })
    },

    showSingleView: function(id) {
        var singleInstance = new SingleModel()
        singleInstance.url += id + '.js'
        singleInstance.fetch({
            dataType: 'jsonp',
            data: {
                includes: "Images",
                "api_key": apiKey
            }
        })
        new SingleView({
            model: singleInstance
        })
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