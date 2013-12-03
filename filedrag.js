(function() {
    
    var fileManager = new FileReader();
    var _binStart = "";
    var _binEnd = "";
    startTime=new Date().getTime();
	

	function $id(id) {
		return document.getElementById(id);
	}


	// file drag hover
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}


	// file selection
	function FileSelectHandler(e) {

		// cancel event and hover styling
		FileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {
			ParseFile(f, i);
		}

	}

	// output file information
	function ParseFile(file, id) {

        var newFile = new File({fileid:id,fileobj:file,filehash:"Dummy",filestop:0,fileiter:1 });
        files.add(newFile);  

        // added to process the hash of the files:
        var hash = new megaHash(file,newFile.cid,1,function OutputHash(msg) {
                                	files.get(newFile.cid).set({filehash:msg});
                                });
	}


	// initialize
	function Init() {

		var fileselect = $id("fileselect"),
			filedrag = $id("filedrag"),
			submitbutton = $id("submitbutton");

		// file select
		fileselect.addEventListener("change", FileSelectHandler, false);

		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			// file drop
			filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectHandler, false);
			filedrag.style.display = "block";

			// remove submit button
			submitbutton.style.display = "none";
		}

	}

	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		Init();
	}


})();