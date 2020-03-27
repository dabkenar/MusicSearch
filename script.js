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
  },
  methods: {
    mounted () {
      axios
      .get('https://itunes.apple.com/search?term=' + this.queryInput + '&origin=*')
      .then(response => {
        console.log(response.data);
        this.numResults = response.data.resultCount;
      });
    },
    parse_query () {
      this.reset_query();
      this.queryWords = this.queryInput.split(" ");
      for (i = 0; i < this.queryWords.length; i++) {
        this.queryParsed += this.queryWords[i];
        if (i != this.queryWords.length - 1) {
          this.queryParsed += '+';
        }
      }
    },
    execute_search () {
      this.parse_query();
      this.mounted();
    },
    reset_query () {
      this.queryWords = [];
      this.queryParsed = '';
    }
  }
})
