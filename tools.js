const fetch = require("node-fetch");

/**
 * Iterates though all the responses from a json endpoint,
 * then follows the next link and keeps going
 * @param {string} target the url to fetch data from
 * @returns {AsyncIterableIterator<T>}
 * @template T
 */
async function* throughAll(target){
    console.log(">",target);
    while (target){
        
        const rsp = await fetch(target);
        const link = rsp.headers.get("link")
        if (link){
            const match = link.match(/<([^>]+)>; rel="next"/)
            target = match && match[1];
        }

        const reply = await rsp.json();
        if(reply.message){
            throw {apiError:reply.message,apiErrorCode:rsp.status}
        }
        yield* reply;
    }
}

/**
 * Returns just the first value of an AsyncIterableIterator
 * @param {AsyncIterableIterator<T>} asii
 * @template T
 */
async function first(asii){
    for await(const n of asii){
        return n;
    }
}

/**
 * Catches errors from the promise, if they are github errors they are written to the provided result stream.
 * If any error occours then  `{_abort_:true}` is returned to signal as such.
 * 
 * @param {any} res Result stream to write to if an error occours
 * @param {Promsie<T>} p
 * @return Promise<T | {_abort_:true}>
 * @template T
 */
function grab(res,p){
    return p.catch(e=>{
        console.error("Error:",e)
        if(e.apiError && e.apiErrorCode){
            res.writeHead(e.apiErrorCode);
            res.end(e.apiError);
        }
        return {_abort_:true};
    })
}

module.exports = {throughAll,first,grab};