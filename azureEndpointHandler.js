class Res extends WritableStream {
    constructor(context){
        this.res = context.res;
        this.res.isRaw = true;
    }

    _write(chunk, encoding, callback){
        this.res.body += chunk;
    }

    writeHead(statusCode,headers={}){
        this.res.status = statusCode;
        this.res.headers = Object.assign(res.headers||{},headers);
    }
}

class Finder{
    constructor(method,path,context){
        this.method = method;
        this.path = path;
        this.req = context.req;
        this.res = new Res(context)
    }
    check(method,path,handler){
        if (method == this.method && path == this.path){
            await handler(this.req,this.res)
        }
        return this;
    }
    get(path,handler){
        return this.check("get",path,handler);
    }
    post(path,handler){
        return this.check("post",path,handler);
    }
    put(path,handler){
        return this.check("put",path,handler);
    }
    delete(path,handler){
        return this.check("delete",path,handler);
    }
}

function invoker(method,path,context){
    return new Finder(method,path,context);
}

/**
 * Returns a method sutiable for use as an azure function export for doing things
 * 
 * @param {string} method Http method to search for
 * @param {string} path Express-like path to search for
 * @param {string=} endpoints Endpoint file to require and bind to
 */
function bindFor(method,path,endpoints="endpoints.js"){
    return function(context){
        return require(endpoints)(new Finder(method,path,context));
    }
}

module.exports = {invoker,bindFor}