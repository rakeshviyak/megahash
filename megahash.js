/*jslint browser: true*/
/*global $, jQuery*/
/*jshint multistr: true */

/*******************
********************

HTML5 / Javascript: 
get hash of files using drag and drop

Developed by Marco Antonio Alvarez => https://github.com/rakeshviyak/megahash

*******************/

var hashMe = function (file, callbackFunction) {
    
    var thisObj = this,
        _binStart = "",
        _binEnd = "",
        callback = "",
        _buff=[],
        strSize=0,
        chunkSize=2097152,
        currentChunk=0,
        chunks=0,
        fileManager = new FileReader();
        
    this.setBinAndHash = function (binData) {
        this._binEnd=binData;
        this._binEnd && this.md5sum(this._binStart, this._binEnd);
    };
    
    this.md5sum = function (start, end) {

        // this._buff.extendArray(rstr2binl(end));
        this._buff=(rstr2binl(end));
        if(this.currentChunk< this.chunks){
            this.state=binl_md51(this._buff, (this.strSize* 4 * 8)+(end.length*8),this.state,this.strSize);
            // console.log(binl_md5(rstr2binl(end),end.length*8));
        }
        if(this.currentChunk==this.chunks){
            this.state=binl_md51_tail(this._buff, (this.strSize* 4 * 8)+(end.length*8),this.state,this.strSize,this.currentChunk);
            // console.log(binl_md5(rstr2binl(end),end.length*8));
        }
        
        // this.strSize+=524288;
        this.strSize+=0;

        // this._hash = rstr2hex(rstr_md5(start + end));
        
        console.log(this._binStart);
        
        if(this.currentChunk==this.chunks){
            this._hash = rstr2hex(binl2rstr(this.state));
            this._binStart=this._hash;
            this._buff="";

            callback(this._hash);
        }
        if(this.currentChunk<this.chunks){
            this.loadChuck();
        }

    };
    
    this.getHash = function() {
        return this._hash;
    };
    
    this.calculateHashOfFile = function (file) {
      
        fileManager.onload = function (f) {
            this._binEnd=f.target.result;
            // this._binStart && this._binEnd && this.md5sum(this._binStart, this._binEnd);      
            thisObj.setBinAndHash(f.target.result );
        };
        
        
        this._binStart="";
        this._buff=[];
        this.strSize=0;
        this.chunks = Math.ceil(file.size / chunkSize);
        this.currentChunk = 0;
        this.state=[1732584193, -271733879, -1732584194, 271733878];
        this.loadChuck();
        
    };

    this.loadChuck=function(){
        var chunkTime=new Date().getTime();
        var calcHash=this._binStart;
        var start=this.currentChunk*chunkSize;
        var end= ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        var sliceFile=file.slice(start,end);
        fileManager.readAsBinaryString(sliceFile);
        this.currentChunk += 1;
        callback(this.hashstatus((this.currentChunk/this.chunks)*100));
        console.log(file.name+":"+start+","+end+" chunk "+ this.currentChunk+"of "+this.chunks+":"+(new Date().getTime()-chunkTime)+"ms , Hash:"+this._binStart);
    };
    

    Array.prototype.extendArray = function (other_array) {
         // you should include a test to check whether other_array really is an array 
        other_array.forEach(function(v) {this.push(v)}, this);
    };

    this.hashstatus= function(status){
        str='<div class="progress progress-striped active"> \
                <div class="progress-bar"  role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" \
                style="width:'+status+'%">\
                    <span class="sr-only">'+status+'% Complete</span>\
                </div>\
            </div>';
        return str;
    };

    callback = callbackFunction;
    this.calculateHashOfFile(file);
    
};