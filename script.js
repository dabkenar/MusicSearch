Vue.prototype.$appName = 'Music Search'

new Vue({
  beforeCreate: function() {
    console.log(this.$appName)
  }
})

var resultView = new Vue({
  el: '#app',
  data: {
    artist1: './img/1.jpg',
    numResults: 0,
    queryInput: '',
    queryWords: [],
    queryParsed: '',
    results: [],
    requestDump: [],
    filters:[],
    tab1: true,
    filteredResults: false,
  },
  methods: {
    request_api () {
      axios
      .get('https://itunes.apple.com/search?term=' + this.queryInput + '&origin=*')
      .then(response => {
        console.log(response.data); //Print API response to console
        this.numResults = response.data.resultCount; //Set number of returned items
        this.results = []; //Reset results array
        this.filters = [];
        this.filteredResults = false;
        this.requestDump = [];

        for (let i in response.data.results) { //Push API response to results array
          this.requestDump.push(response.data.results[i]);
          if (this.log_filter(response.data.results[i].primaryGenreName)) {
            this.filters.push({genre: response.data.results[i].primaryGenreName, active: false});
          }
        }
        
        this.results = this.requestDump.slice();
        
        if (this.numResults === 0) { //If No results are found print this message
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
    add_filter (filter) {
      console.log("Filter Added");
      if (!this.filteredResults) {
        this.results = [];
        this.filteredResults = true;
      }
      for (let i in this.requestDump) {
        if (this.requestDump[i].primaryGenreName == filter) {
          this.results.push(this.requestDump[i]);
        }
      }
    },
    remove_filter (filter) {
      console.log("Filter removed");
      let newResults = [];
      for (let i in this.results) {
        if (this.results[i].primaryGenreName != filter) {
          console.log("keep this one!");
          newResults.push(this.results[i]);
        }
      }
      this.results = [];
      this.results = newResults.slice();
      if (this.results.length === 0) {
        this.results = this.requestDump.slice();
        this.filteredResults = false;
      }
    },
    log_filter (filter) {
      for (let i in this.filters) {
        if (filter == this.filters[i].genre) {
          return false;
        }
      }
      return true;
    }
  }
})

Vue.component('genre-filter', {
  props: ['filter'],
  template:
  `<button v-if="!filter.active" class="btn btn-primary" style="margin:2px;" v-on:click="toggle_filter(); resultView.add_filter(filter.genre)" >{{filter.genre}}</button>
   <button v-else class="btn btn-info" style="margin:2px;" v-on:click="toggle_filter(); resultView.remove_filter(filter.genre)" >{{filter.genre}}</button>`,
  methods: {
    toggle_filter () {
      this.filter.active = !this.filter.active;
    },
  }
}) 

Vue.component('search-result', {
  props: ['result', 'tab1'],
  template:
`    <div id="search-result" class = "col-lg-6 col-md-6 col-sm-6" style='margin-bottom: 50px; display: inline; height: 250px' >
      <div class="col-sm-4" style='max-width:200px;margin-right: 30px'>
        <img style='width: 120%; display: inline; ' :src="get_artist_info(result, 6)">
      </div>

      <div>
        <div id="toggle-tabs" class="col-sm-6" style='max-height: 250px;'>
            <ul class="nav nav-tabs">
              <li href="#tab1-content" class="active"><a data-toggle="tab" v-on:click="switch_tab">Description</a></li>
              <li><a href="#tab2-content" data-toggle="tab" v-on:click="switch_tab">Artist Info.</a></li>
            </ul>
            <div v-if="tab1" id="tab1-content">
              <span>
                  <b>Artist Name: </b>{{get_artist_info(result, 1)}}
              </span><br/>
              <span>
                  <b>Album Name: </b>{{get_artist_info(result, 2)}}
              </span><br/>
              <span>
                  <b>Price: </b>\$\{{get_artist_info(result, 3)}}
              </span><br/>
              <span>
                  <b>Type: </b>{{get_artist_info(result, 4)}}
              </span><br/>
              <span>
                  <b>Preview: </b>
                  <a v-bind:href="get_artist_info(result, 5)">link</a>
              </span>
            </div>
            <div v-if="!tab1" id="tab2-content">
              <span>{{get_artist_info(result, 7)}}</span>
            </div>
        </div>
      </div>
    </div>`,
  methods: {
    get_artist_info (result, type) {
      let returnVal = '';
      switch(type) {
        case 1:
          returnVal = result.artistName;
          break;
        case 2:
          returnVal = result.collectionName;
          break;
        case 3:
          returnVal = result.collectionPrice;
          break;
        case 4:
          returnVal = result.kind;
          break;
        case 5:
          returnVal = result.previewUrl;
          break;
        case 6:
          returnVal = result.artworkUrl100;
          break;
        case 7:
          returnVal = result.trackId;
          break;
      }
      if (returnVal === '') {
        returnVal = 'No information provided';
      }
      return returnVal;
    },
    switch_tab () {
      this.tab1 = !this.tab1;
    }
  }
})

