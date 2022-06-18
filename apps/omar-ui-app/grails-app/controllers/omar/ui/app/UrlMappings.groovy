package omar.ui.app

class UrlMappings {

    static mappings = {
    	"/views/**"(controller: 'views', action: 'renderView')

        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/"(redirect: '/omar/index#/map')

        "500"(view:'/error')
        "404"(view:'/notFound')
    }
}
