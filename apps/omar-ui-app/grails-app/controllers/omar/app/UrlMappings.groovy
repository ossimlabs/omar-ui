package omar.app

class UrlMappings {

    static mappings = {
	"/views/**"(controller: 'views', action: 'renderView')

        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        //"/"(view:"/index")
        //"/" ( controller:'omar', action:'index' )
        //"/"(uri: '/omar/index')
        "/"(redirect: '/omar/index#/map')
        "500"(view:'/error')
        "404"(view:'/notFound')
    }
}
