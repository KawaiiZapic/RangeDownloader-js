var RangeDownloader = (function() {
    var RangeDownloader = function (param) {
        this.url = param.url || null;
        if(!this.url){throw Error("Invaild url.");}
        this.bufferSize = param.bufferSize || this.bufferSize;
        this.onerror = param.onerror || null;
        this.onload = param.onload || null;
        this.onprogress = param.onprogress || null;
    };
    RangeDownloader.prototype.start = function () {
        var _self = this;
        this.xhr = new XMLHttpRequest();
        var xhr = this.xhr;
        xhr.open("GET",this.url);
        var nextRange = (this.downloadedSize + this.bufferSize) > this.totalSize ? this.totalSize : (this.downloadedSize + this.bufferSize);
        nextRange = this.downloadedSize == 0 ? this.bufferSize : nextRange;
        xhr.setRequestHeader("Range","bytes=" + this.downloadedSize.toString() + "-" + nextRange);
        xhr.responseType = "arraybuffer";
        xhr.onload = function () {
            if(!_self.supportPartial){
                _self.chucks = [];
                _self.downloadedSize = 0;
            }
            _self.chucks.push(xhr.response);
            _self.lastLoaded = 0;
            _self.running = xhr.status < 400 && _self.downloadedSize < _self.totalSize;
            if(_self.downloadedSize >= _self.totalSize) {
                typeof _self.onload == "function" ? _self.onload() : 0;
            }
            if(_self.running === true) {
                _self.start();
            }
        }
        xhr.onerror = function (e) {
            _self.running = false;
            typeof _self.onerror == "function" ? _self.onerror(e) : 0;
        }
        xhr.onprogress = function (e) {
            _self.downloadedSize += e.loaded - _self.lastLoaded;
            _self.lastLoaded = e.loaded;
            typeof _self.onprogress == "function" ? _self.onprogress(e) : 0;
        }
        xhr.onreadystatechange = function () {
            if(xhr.readyState == 3){
                _self.supportPartial = xhr.status == "206";
                _self.totalSize = xhr.status == "206" ? parseInt(xhr.getResponseHeader("Content-Range").split("/")[1]) : parseInt(xhr.getResponseHeader("Content-Length")) || -1;
            }
            
        }
        xhr.send();
    }
    RangeDownloader.prototype.pause = function () {
        this.xhr != null ? this.xhr.abort() : 0;
        this.running = false;
    }
    RangeDownloader.prototype.cancel = function () {
        this.xhr != null ? this.xhr.abort() : 0;
        this.chucks = [];
        this.running = false;
        this.downloadedSize = 0;
        this.totalSize = 0;
        this.supportPartial = false;
    }
    RangeDownloader.prototype.getReasultAsBlob = function () {
        return new Blob(this.chucks);
    }
    RangeDownloader.prototype.running = false;
    RangeDownloader.prototype.url = "";
    RangeDownloader.prototype.bufferSize = 163840;
    RangeDownloader.prototype.onerror = null;
    RangeDownloader.prototype.onprogress = null;
    RangeDownloader.prototype.onload = null;
    RangeDownloader.prototype.supportPartial = false;
    RangeDownloader.prototype.chucks = [];
    RangeDownloader.prototype.xhr = null;
    RangeDownloader.prototype.totalSize = 0;
    RangeDownloader.prototype.downloadedSize = 0;
    RangeDownloader.prototype.lastLoaded = 0;
    return RangeDownloader;
})();
