/*jslint browser: true*/
/*global $, jQuery*/
/*jshint multistr: true */

/*******************
********************

HTML5 / Javascript: 
get hash of files using drag and drop

=> https://github.com/rakeshviyak/megahash

*******************/

var megaHash = function (file,fileid,iter,callbackFunction) {
    
    var thisObj = this,
        _hash="",
        _binEnd = "",
        _binStart = "",
        callback = "",
        _buff=[],
        chunkSize=2097152,
        currentChunk=0,
        chunks=0,
        i=0,
        fileManager = new FileReader();
        
    this.setBinAndHash = function (binData) {
        this._binEnd=binData;
        this._binStart=this._hash;
        this._hash="";
        this._binEnd && this.md5sum(this._binStart,this._binEnd);
    };

    this.md5sum = function (start,end) {

        this._buff=(rstr2binl(start+end));
        if(this.currentChunk< this.chunks){
            this.state=binl_md51(this._buff,this.state);
            this.loadChuck(0);
        }
        else if(this.currentChunk==this.chunks){
            this.state=binl_md51_tail(this._buff,(start.length+end.length)*8,this.state,(this.currentChunk-1)*524288*4*8);
            this._hash = rstr2hex(binl2rstr(this.state));
            if(this.i<iter){
                this.i+=1;
                this.initHash();
                this.chunks = Math.ceil((this._hash.length+file.size) / chunkSize);
                this.loadChuck(this._hash.length);
            }
            else{
                this.endHash(this._hash);
            }
        }
    };
    
    
    this.calculateHashOfFile = function (file) {
      
        fileManager.onload = function (f) {
            this._binEnd=f.target.result;
            thisObj.setBinAndHash(f.target.result );
        };
        
        this.initHash();
        this.i=1;
        this._hash="";
        this.chunks = Math.ceil(file.size / chunkSize);
        this.loadChuck(0);
        
    };

    this.loadChuck=function(offset){
        var start=(this.currentChunk > 0)? (this.currentChunk*chunkSize)-offset:0;
        var end= ((start + chunkSize) >= file.size) ? file.size : start + chunkSize - offset;
        var sliceFile=file.slice(start,end);
        fileManager.readAsBinaryString(sliceFile);
        
        this.currentChunk += 1;
        callback(this.hashStatus(((((this.i-1)*this.chunks)+this.currentChunk)/(this.chunks*iter))*100));
        
        if($('#'+fileid).data('stop')==1){
            this.currentChunk=99999999;
            this.i=999999999;
            this.endHash("File Hash is canceled");
        }
        console.log(file.name+":"+start+","+end+" chunk "+ this.currentChunk+"of "+this.chunks+" Hash:"+this._hash);
    };
    
    this.hashStatus= function(status){
        str='Calculating...<button class="cancel btn btn-primary" data-id='+fileid+'>Cancel</button>\
                <div class="progress progress-striped active"> \
                <div class="progress-bar"  role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" \
                style="width:'+status+'%">\
                <span class="sr-only">'+status+'% Complete</span>\
                </div>\
            </div>';
        return str;
    };

    this.initHash= function(msg){
        this._buff=[];
        this.currentChunk = 0;
        this.state=[1732584193, -271733879, -1732584194, 271733878];
    };

    this.endHash= function(msg){
        this._buff=[];
        files.get(fileid).set({filestop:2});
        callback(msg);
    };

    callback = callbackFunction;
    this.calculateHashOfFile(file);
    
};

