//--------------------------------------------------
// REFERENCE
//--------------------------------------------------

var baseUrl = 'https://openapi.etsy.com/v2/listings/active.js'
var searchUrl = 'https://openapi.etsy.com/v2/listings/'
var apiKey = '9sfgsyb7qbqbo1c79sraetsl'

//--------------------------------------------------
// MODELS
//--------------------------------------------------

var MultiCollection = Backbone.Collection.extend({
    url: baseUrl,

    parse: function(apiResponse) { // obtain json data for home page
        return apiResponse.results
    }
})

var SingleModel = Backbone.Model.extend({
        url: searchUrl,

    parse: function(apiResponse) { // obtain jason data for details page
        return apiResponse.results[0]
    }
})

//--------------------------------------------------
// VIEWS
//--------------------------------------------------

var MultiView = Backbone.View.extend({ // render home page with all listings
    initialize: function() {
        document.querySelector('.container').innerHTML = '<img src="magnify.gif">' // loading gif
        this.listenTo(this.collection, 'sync', this.render) // when the collection syncs with the server, run render function
    },

    render: function() { // build html for home page
        document.querySelector('.hero').style = "height: 325px;" // maintains hero image on home page after hash change
        var containerNode = document.querySelector('.container')
        var htmlString = ''
        this.collection.forEach(function(inputModel) {
            htmlString += '<a href="#details/' + inputModel.get('listing_id') + '">'
                        + '<div class="itemContainer"' + inputModel.get('listing_id') + '">'
                        + '<img class = "image" src="' + inputModel.get('Images')[0].url_170x135 + '">'
             			+ '<div class="title">' + inputModel.get('title') + '</div>'
             			+ '<div class="price">' + '$' + inputModel.get('price') + '</div>'
             			+ '</div>' + '</a>'
            containerNode.innerHTML = htmlString
        })
    }
})

var SingleView = Backbone.View.extend({ // render view for details page
    initialize: function() {
        console.log(this)
        document.querySelector('.hero').style = "display: none;" // hides hero image on detail view
        document.querySelector('.container').innerHTML = '<img src="magnify.gif">' // loading gif
        this.listenTo(this.model, 'sync', this.render) // when the model syncs with the server, run render function
    },

    render: function() { // build html for details page
        var containerNode = document.querySelector('.container')
        var htmlString = ''
        htmlString += '<div class="detailPage">'
                    + '<div class="leftSide">'
                    + '<img class ="detailImg" src="' + this.model.get('Images')[0].url_570xN + '">'
                    + '<div class="detailShop">' + 'Shop: ' + this.model.get("Shop").shop_name + '</div></div>'
                    + '<div class="rightSide">'
                    + '<div class ="detailTitle">' + this.model.get('title') + '</div>'
                    + '<div class="detailDescription">' + this.model.get('description') + '</div>'
                    + '<a href="https://www.etsy.com/listing/' + this.model.get("listing_id") + '"' + 'target="_blank"><button type="button" class="buyMeBtn">' + '$' + this.model.get("price") + '</button></a>'
                    + '<a href="' + this.model.get("Shop").url + '"' + 'target="_blank"><button type="button" class="myStoreBtn">' + 'My Store' + '</button></a>'
                    + '</div>'
        containerNode.innerHTML = htmlString
    }
})

//--------------------------------------------------
// CONTROLLER
//--------------------------------------------------

var EtsyRouter = Backbone.Router.extend({
    // define url routes
    routes: {
        "home": "showMultiView",
        "search/:query": "performSearch",
        "details/:id": "showSingleView",
        "*default": "takeMeHome"
    },
    // route for home page
    showMultiView: function() {
        var homeInstance = new MultiCollection()
        homeInstance.fetch({ // send request for all etsy listings
            dataType: 'jsonp',
            data: {
                includes: "Images,Shop",
                "api_key": apiKey
            }
        })
        new MultiView({
            collection: homeInstance
        })
    },
    // route for queries
    performSearch: function(query) {
        var newSearch = new MultiCollection()
        newSearch.fetch({ // send request for particular etsy listings
            dataType: 'jsonp',
            data: {
                includes: "Images,Shop",
                "api_key": apiKey,
                keywords: query
            }
        })
        new MultiView({
            collection: newSearch
        })
    },
    // route for details page
    showSingleView: function(id) {
        var singleInstance = new SingleModel()
        singleInstance.url += id + '.js'
        singleInstance.fetch({ // send request for details of esty listing
            dataType: 'jsonp',
            data: {
                includes: "Images,Shop",
                "api_key": apiKey
            }
        })
        new SingleView({
            model: singleInstance
        })
    },
    // default to home page upon inital load
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
