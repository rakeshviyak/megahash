(function() {
    
    var fileManager = new FileReader();
    var _binStart = "";
    var _binEnd = "";
    startTime=new Date().getTime();
	

	function $id(id) {
		return document.getElementById(id);
	}


	// // output information
	// function Output(msg) {
	// 	var m = $id("messages");
	// 	m.innerHTML = msg + m.innerHTML;
	// }
    
	// function OutputHash(eId, msg) {
 //        $("#"+eId+" .hash").html(msg);
 //        endTime=new Date().getTime();
 //        console.log(endTime-startTime);
	// }


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

		// Output(
		// 	"<p id='"+ id +"'>File information: <strong>" + file.name +
		// 	"</strong> type: <strong>" + file.type +
		// 	"</strong> size: <strong>" + file.size +
		// 	"</strong> <span style='color:green;'>hash: <strong class='hash'>" +
		// 	"</strong></span> " +
  //           "</p>"
		// );
        var newFile = new File({fileid:id,filename:file.name,filesize:file.size,filehash:"Dummy" });
        files.add(newFile);  

		
        // added to process the hash of the files:
        var hash = new hashMe(file, function OutputHash(msg,action) {
                                	// $("#"+ id +" .hash").html("");
                                	// $("#"+ id +" .hash").html(msg);
                                	updateFile=files.where({filename:file.name,filesize:file.size,fileid:id});
                                	updateFile[updateFile.length-1].set({filehash:msg});
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