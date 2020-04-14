const fs = require("fs");
const Guard = require("./Guard.js");
const {grab,first} = require("./tools.js")
const {gistsWithFile} = require("./github.js")

/**
 * Binds the endpoints to the passed backend
 * @param {T} endPointEngine the express like backend that can handle the endpoint binding
 * 
 * @template {object} T An Express like backend
 * @returns {T} the passed backend
 */
module.exports = function(endPointEngine){
    return endPointEngine
        .get('/',(req,res)=>{
            fs.createReadStream("index.html").pipe(res);
        })
        .get('/gists/:username/:filename',async (req,res)=>{
            const {username,filename} = req.params

            if(Guard(res,!username,"user not set")
                .and(!filename,"targetFile not set")
                .write()
            ) {return}

            const {file,_abort_,_empty_} = await grab(res,first(gistsWithFile(username,filename)))
            if (_abort_) {return}
            if (_empty_) {
                res.writeHead(404);
                res.end(`file "${filename}" not found under user "${username}"`);
                return;
            }

            if (file.truncated === false){
                res.end(file.content);
            } else {
                res.writeHead(303,{Location:file.raw_url});
                res.end();
            }
        })
        .get('/gists/:username/:filename/html',async (req,res)=>{
            const {username,filename} = req.params

            if(Guard(res,!username,"user not set")
                .and(!filename,"targetFile not set")
                .write()
            ) {return}

            const {gist,file,_abort_,_empty_} = await grab(res,first(gistsWithFile(username,filename)))
            if (_abort_) {return}
            if (_empty_) {
                res.writeHead(404);
                res.end(`file "${filename}" not found under user "${username}"`);
                return;
            }

            const url = gist.html_url;
            //This is my best guess at how github generates the file slugs
            const fileSlug = file.filename.toLowerCase().replace(/[^a-z0-9_-]+/i,"-")
            res.writeHead(303,{Location:`${url}#file-${fileSlug}`});
            res.end();   
        })
}