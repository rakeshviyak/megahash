$(window).load(function(){

//Create a model
File = Backbone.Model.extend({
  // idAttribute:'_id',
});

//Create a collection  
Files = Backbone.Collection.extend({
    Model: File,
    url: "#"
});

//Initiate a collection
files = new Files();


var FullTemplateView=Backbone.View.extend({
    events: {
        "click li": function() { $("body").append("<p>clicked</p>") }
    },
    initialize: function() {
        this.rendered=0;
    },
    render:function() {
        var html, $oldel=this.$el, $newel;
        this.rendered++;
        
        // html=this.options.template({
        //     rendered:this.rendered,
        //     collection:files.toJSON()
        // });
        // 
        html="";
        $newel=$(html);
        
        // setElement takes care of this.undelegateEvents
        // but don't forget to unbind any other event manually set
        this.setElement($newel);
        el=this.$el;
        // console.log(el);
        //reinject the element in the DOM
        $oldel.replaceWith($newel);
        var listView = new ListView({collection:files});
        // console.log(listView);
        $('.files').append(listView.render().el);
        return this;
    }
});

var ListView=Backbone.View.extend({

    tagName: 'div',
    className : 'file',

    initialize: function() {
      this.collection.bind('all', _.bind(this.render,this));
      this.template = _.template($('#filelist').html());
    },

    // events: {
    //   "click button": function() { $("body").append("<p>clicked</p>") }
    // },

    events: {
      "click .remove":"remove",
      // "click .edit":"edit"
    },

    remove:function(e){
        e.preventDefault();
        var id = $(e.currentTarget).data("id");

        var item = this.collection.get(id);
        this.collection.remove(item);
        return this;
    },
    
    render:function() {
      var template = this.template,
                el = this.$el;
      $(".file div").remove();
      this.collection.each(function(file){
          f=file.toJSON();
          f['cid']=file.cid;
          console.log(f);
          // j['id']=product.cid;
          // console.log(template);
          el.append(template(f));
      });
      return this;
    }
});


// var f=new Files([
//         {id:"0",filename:"My name",filesize:"1000bytes",hash:"1212312"},
//         {id:"1",filename:"My nawqeqwme",filesize:"100bytes",hash:"1212312"},
//         {id:"2",filename:"Myads name",filesize:"00bytes",hash:"1212312"}
        
// ]);

// files.add(f.toJSON());

var t=new FullTemplateView({
    // collection: f,
    template: Handlebars.compile($("#src").html())
});

$("#container").append( t.render().$el );
$("button").on("click",function(e) {
    e.preventDefault();
    t.render();
});


});