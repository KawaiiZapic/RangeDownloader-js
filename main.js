/**
 *
 * RangeDownloader.js by Zapic @ 2021
 * https://github.com/KawaiiZapic/RangeDownloader-js/
 *
 * Please DO NOT remove this copyright message, as the basic respect for original author.
 *
 */

var RangeDownloader = (function() {
    var RangeDownloader = function (param) {
        this.url = param.url || null;
        if(!this.url){throw Error("Invaild url.");}
        this.onerror = param.onerror || null;
        this.onload = param.onload || null;
        this.onprogress = param.onprogress || null;
    };
    RangeDownloader.prototype.start = function () {
        if(this.loaded){return;}
        var _self = this;
        this.abortController = new AbortController();
        fetch(this.url,{
            headers: {
                "Range": "bytes="+this.downloadedSize.toString() + "-"
            },
            signal: this.abortController.signal,
        }).then(function (resp){
             _self.supportPartial = (resp.status == 206);
            _self.totalSize = parseInt(resp.headers.get("Content-Length"));
            _self.totalSize = _self.totalSize == NaN ? parseInt(resp.headers.get("Content-Range").split("/")[1]) : _self.totalSize;
            _self.running = true;
            return resp.body.getReader();
        }).then(async function (reader){
            var ok = false;
            while(!ok){
                var con = await reader.read();
                ok = con.done;
                if(typeof con.value == "undefined"){break;}
                _self.chucks.push(con.value);
                _self.downloadedSize += con.value.byteLength;
                typeof _self.onprogress == "function" ? _self.onprogress(_self) : 0;
            }
            if(ok){
                typeof _self.onload == "function" ? _self.onload(_self) : 0;
            }
            _self.running = false;
            _self.loaded = true;
        }).catch(function (err){
            if(_self.running == true) {
                typeof _self.onerror == "function" ? _self.onerror(_self,Error(err)) : 0;
                throw Error(err);
            }
            _self.running = false;
        });
    }
    RangeDownloader.prototype.pause = function () {
        this.running = false;
        this.abortController != null ? this.abortController.abort() : 0;
        this.chucks = this.supportPartial ? this.chucks : [];
        this.downloadedSize = this.supportPartial ? this.downloadedSize : 0;
    }
    RangeDownloader.prototype.cancel = function () {
        this.running = false;
        this.abortController != null ? this.abortController.abort() : 0;
        this.chucks = [];
        this.downloadedSize = 0;
        this.totalSize = 0;
        this.supportPartial = false;
    }
    RangeDownloader.prototype.getResultAsBlob = function (release) {
        return new Blob(this.chucks);
    }
    RangeDownloader.prototype.running = false;
    RangeDownloader.prototype.url = "";
    RangeDownloader.prototype.onerror = null;
    RangeDownloader.prototype.onprogress = null;
    RangeDownloader.prototype.onload = null;
    RangeDownloader.prototype.supportPartial = false;
    RangeDownloader.prototype.chucks = [];
    RangeDownloader.prototype.totalSize = 0;
    RangeDownloader.prototype.downloadedSize = 0;
    RangeDownloader.prototype.abortController = null;
    RangeDownloader.prototype.loaded = false;
    return RangeDownloader;
})();
