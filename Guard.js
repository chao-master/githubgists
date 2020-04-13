class Guard {
    constructor(res,errorCode=400){
        this.errorCode = errorCode
        this.errorList = []
        this.failed = false
        this.res = res;
        this.hasWritten = false;
    }

    /**
     * Adds a guard
     * @param {boolean} failOn The logic that causes the test to fail if true
     * @param {string=} errorMessage If given, the error message that is written if the test fails
     */
    and(failOn,errorMessage){
        if (failOn){
            this.failed = true;
            if(errorMessage){
                this.errorList.push(errorMessage);
            }
        }
        return this;
    }

    /**
     * If any of the guards have failed, then this method writes the errors to the
     * result stream. The method then returns if any of the guards failed.
     * The method will however not write to the output stream if it is called a second time.
     * @param {boolean} [end=true] If the stream should be closed after writing to it
     */
    write(end=true){
        if(!this.hasWritten){
            this.hasWritten = true;
            if(this.failed){
                if(this.errorCode){
                    res.writeHead(errorCode)
                }
                for(const err of this.errorList){
                    res.write(err);
                    res.write("\n");
                }
                if(end){
                    res.end();
                }
            }
        }
        return this.failed;
    }
}

/**
 * @param {any} res Response stream to write to
 * @param {number} [errorCode=400] Error code to use
 *//**
 * @param {any} res Response stream to write to
 * @param {boolean} failOn The logic that causes the test to fail if true
 * @param {string} errorMessage The error message to show if the test fails
 * @param {number} [errorCode=400] Error code to use
 */
module.exports = function(res,failOn,errorMessage,errorCode){
    if(errorCode === undefined && errorMessage === undefined){
        return new Guard(res,failOn) //read failOn as errorcode
    }
    const g = new Guard(res,errorCode)
    if(errorMessage !== undefined){
        g.and(failOn,errorMessage)
    }
    return g;
}