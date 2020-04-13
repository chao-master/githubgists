class Finder{
    constructor(method,path,req,res){
        this.method = method;
        this.path = path;
        this.req = req;
        this.res = res;
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