const {throughAll} = require("./tools.js")
const BASE_URL = "https://api.github.com";

/**
 * Fetches all of a user's gists
 * @param {string} username The user to lookup
 */
function usersGists(username){
    return throughAll(`${BASE_URL}/users/${username}/gists`);
}

/**
 * Returns all of a user's gists that contain the specified file
 * @param {string} username The user to lookup
 * @param {string} targetFile The file to search for
 */
async function* gistsWithFile(username,targetFile){
    const gists = usersGists(username);
    for await(const gist of gists){
        for (const file of Object.values(gist.files)){
            if(targetFile === file.filename){
                yield {file,gist};
            }
        }
    }
}

module.exports = {gistsWithFile,usersGists}