import { mapGetters,mapMutations,mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
export const playlistMixin = {
	computed :{
		...mapGetters([
			'playList'
		])
	} ,
	mounted() {
		this.handlePlaylist(this.playList)
	},
	activated() {
		this.handlePlaylist(this.playList)
	},
	watch: {
		playList(newVal){
			this.handlePlaylist(newVal)
		}
	},
	methods :{
		handlePlaylist() {
			throw new Error('component must impement handlePlaylist method')
		}
	}
}

export const playerMixin = {
	computed:{
      	iconMode(){
        	return this.mode === playMode.sequence ?'icon-sequence' : this.mode === playMode.loop ?'icon-loop' : 'icon-random'
      	},
	    ...mapGetters([
	        'sequenceList',
	        'currentSong' ,
	        'playList' ,
	        'mode'
	    ])
	},
	methods:{
      changeMode() {
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let list = null
        if(mode === playMode.random){
          list = shuffle(this.sequenceList)
        }else{
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },
      resetCurrentIndex(list){
        let index = list.findIndex((item) => {
          //返回当前歌曲对应的索引
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },		
      ...mapMutations({
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex : 'SET_CURRENT_INDEX',
        setPlayMode : 'SET_PLAY_MODE' ,
        setPlayList : 'SET_PLAY_LIST'
      })
	}
}

export const searchMixin = {
	data() {
		return {
			query :'',
			refreshDelay :100
		}
	},
	computed: {
      ...mapGetters([
        'searchHistory'
      ])
	},
	methods :{
      onQueryChange(query){
        this.query = query 
      },
      addQuery(query){
        this.$refs.searchBox.setQuery(query)
      },
      blurInput(){
        this.$refs.searchBox.blur()
      },
      saveSearch(){
        this.saveSearchHistory(this.query)
      },		
      ...mapActions([
        'saveSearchHistory',
        'delectSearchHistory'
      ])
	}
}