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
    tab1: true,
  },
  methods: {
    request_api () {
      axios
      .get('https://itunes.apple.com/search?term=' + this.queryInput + '&origin=*')
      .then(response => {
        console.log(response.data);
        this.numResults = response.data.resultCount;
        this.results = [];
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
    },
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
    }
  }
})

Vue.component('toggle-tabs', {
  data: {
    tab1: true,
  },
  methods: {
    switch_tab () {
      this.tab1 = !this.tab1;
    }
  }
})