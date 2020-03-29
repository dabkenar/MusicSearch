Vue.prototype.$appName = 'Music Search'

new Vue({
  beforeCreate: function() {
    console.log(this.$appName)
  }
})

// Vue.component('search-result', {
//   template:'\
//     <div class = "col-lg-6 col-md-6 col-sm-6" style="margin-bottom: 50px; display: inline; height: 250px">\
//       <div class="col-sm-4" style="max-width:200px;margin-right: 30px">\
//           <img style="width: 120%; display: inline;" v-bind:src="{{artworkUrl60}}">\
//       </div>\
//       <div class="col-sm-6" style=" max-height: 250px;">\
//           <ul class="nav nav-tabs">\
//             <li class="active"><a data-toggle="tab" >Description</a></li>\
//             <li><a data-toggle="tab">Artist Info.</a></li>\
//           </ul>\
//           <div class="tab-content">\
//             <span>\
//                 <b>Artist Name: </b>{{artistName}}\
//             </span><br/>\
//             <span>\
//                 <b>Collection Name: </b>{{collectionName}}\
//             </span><br/>\
//             <span>\
//                 <b>Price: </b>${{collectionPrice}}\
//             </span><br/>\
//             <span>\
//                 <b>Type: </b>{{primaryGenreName}}\
//             </span><br/>\
//             <span>\
//                 <b>Preview: </b>\
//                 <a href="{{previewUrl}}">link</a>\
//             </span>\
//           </div>\
//       </div>\
//     </div>\
//   ',
//   props:['result']
// })

var resultView = new Vue({
  el: '#app',
  data: {
    artist1: './img/1.jpg',
    numResults: 0,
    queryInput: '',
    queryWords: [],
    queryParsed: '',
    results: [],
  },
  methods: {
    request_api () {
      axios
      .get('https://itunes.apple.com/search?term=' + this.queryInput + '&origin=*')
      .then(response => {
        console.log(response.data);
        this.numResults = response.data.resultCount;
        
        for (var i in response.data.results) {
          this.results.push(response.data.results[i]);
        }
        if (this.numResults === 0) {
          alert("No Artists Found");
        }
      });
    },
    parse_query () {
      this.reset_query();
      this.queryWords = this.queryInput.split(" ");
      for (let i = 0; i < this.queryWords.length; i++) {
        this.queryParsed += this.queryWords[i];
        if (i != this.queryWords.length - 1) {
          this.queryParsed += '+';
        }
      }
    },
    execute_search () {
      this.parse_query();
      this.request_api();
    },
    reset_query () {
      this.queryWords = [];
      this.queryParsed = '';
    },
    get_img_url (result) {
      return result.artworkUrl100
    },
    get_preview_url (result) {
      return result.previewUrl;
    }
  }
})
