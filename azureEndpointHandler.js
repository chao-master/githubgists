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

function invoker(method,path,req,res){
    return new Finder(method,path,req,res);
}

module.exports = {invoker}