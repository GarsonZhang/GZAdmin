
const routeMap = {
    "/ " : "./home/Home",
    "module1" : {
           "url"  : "module1/Home",
           "children" : { 
                  "/add/element/:id" : "module1/xxxxxx",
                 "/modify/element/:id" : "module1/xxxxxx"
           }
    }
}

export default routeMap;