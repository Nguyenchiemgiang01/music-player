
const $=document.querySelector.bind(document)
const $$=document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY= 'GIANG_PLAYER'

const cd=$('.cd')
const heading=$('header h2')
const cdThumb=$('.cd-thumb')
const audio=$('#audio')
const playBtn=$('.btn-toggle-play')
const player =$('.player')
const progress=$('.progress')
const btnnextsong=$('.btn-next')
const btnbacksong=$('.btn-prev')
const btnrepeat=$('.btn-repeat')
const btnrandomsong=$('.btn-random')
const songitem=$('.song')
const playlist=$('.play-list')



const app={
    current_index:0,
    isPlaying:false,
    isHoldProgressBar:false,
    isRandom:false,
    isRepeat:false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},
    song:[
    {
        name: 'Có ai hẹn hò cùng em chưa',
        singer: 'Quân AP',
        path: './assets/music/coaihenhocungemchua.mp3',
        image: './assets/img/song1.jpg',

    },
    {
        name: 'Khác biệt',
        singer: 'Khắc Việt',
        path: './assets/music/KhacBiet.mp3',
        image: './assets/img/song2.jpg',

    },
    {
        name: 'Chia tay là giải pháp',
        singer: 'Ngô Quyền Linh - Cover',
        path: './assets/music/ChiaTayLaGiaiPhap.mp3',
        image: './assets/img/song3.jpg',

    },
    {
        name: 'Suýt nữa thì',
        singer: 'Andiez',
        path: './assets/music/SuytNuaThi.mp3',
        image: './assets/img/song4.jpg',

    },
    {
        name: 'Thế giới trong em',
        singer: 'Hương Ly',
        path: './assets/music/TheGioiTrongEm.mp3',
        image: './assets/img/song5.jpg',

    },
],
    setConfig:function(key,value){
        this.config[key]=value
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },


    render:function(){
        const htmls=this.song.map((song,index)=>{
            return `<div class="song ${index===this.current_index?'show':''}" data-index="${index}">
            <div class="thumb" style="background-image: url(' ${song.image} ');">
                
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        })

        $('.play-list').innerHTML=htmls.join('')
    },
    defineProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.song[this.current_index]
            }
        })
    },
    handelEvent:function(){
        
        const cd_width=cd.offsetWidth
     

        //xu ly phoong to thu nho cd
        document.onscroll=function(){
            const scrollTop=window.scrollY||document.documentElement.scrollTop
            const newWidth=cd_width-scrollTop
            cd.style.width=newWidth>0 ?newWidth+'px':0
            cd.style.opacity=newWidth/cd_width
        }

        // xu lý cd quay 
       const cdThumbAnimate= cdThumb.animate([
            {transform:'rotate(360deg)'}
        ],
        {
            duration:10000,//10s
            iterations:Infinity// vô hạn 
        }

        )

        cdThumbAnimate.pause()
        // xu ly khi kich play
        playBtn.onclick=function(){
            if(app.isPlaying){
                audio.pause()
            }else{
                audio.play()
              
            }
            // khi bai hat play 
            audio.onplay=function(){
                app.isPlaying=true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
            audio.onpause=function(){
                app.isPlaying=false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }
           
        }   
        
        btnrepeat.onclick=function(){
            app.isRepeat=!app.isRepeat
            app.setConfig('isRepeat',app.isRepeat)
            btnrepeat.classList.toggle('active',app.isRepeat)
          
        }
        btnnextsong.onclick=function(){
            if(app.isRandom)
            {
                app.randomSong()
            }else{
                app.nextSong()
            }
            app.render()
            audio.play()
            app.scrollToActiveSong()
        }
        btnbacksong.onclick=function(){
            if(app.isRandom)
            {
                app.randomSong()
            }else{
                app.backSong()
            }
            app.render()
            audio.play()
        }
        btnrandomsong.onclick=function(){

            app.isRandom=!app.isRandom
            btnrandomsong.classList.toggle('active',app.isRandom)
            app.setConfig('isRandom',app.isRandom)
            
        }
        
        // khi tien do bai hat thay doi
        audio.ontimeupdate=function(){
            if(audio.duration){
                const progressPercent=Math.floor(audio.currentTime/audio.duration*100)
                progress.value=progressPercent
                
            }
        } 
        // xu ly khi tua song
        
        progress.onmousedown=function(e){
            const seekTime = (e.offsetX / this.offsetWidth) * audio.duration
            audio.currentTime=seekTime
            app.isHoldProgressBar=true
        }
        progress.onmouseup = function(e) {
            if (app.isHoldProgressBar) {
                const seekTime = (e.offsetX / this.offsetWidth) * audio.duration;
                audio.currentTime = seekTime;
            }
        }

        // xu ly bai hat khi audio ended
        audio.onended=function(){
            if (app.isRepeat){
               
                audio.play()
            }else{
                btnnextsong.click()
            }
           
        }
        // lắng nghe hành vi click vào playlist
        playlist.onclick=function(e){
            const songNode=e.target.closest('.song:not(.show)')
            if(songNode ||  e.target.closest('.option')){
                // xử lý khi click vào song
                if (songNode){
                    app.current_index=Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    audio.play()
                    app.render()
                    
                }
                // xử lý khi click vào song option
            }
        }
    },

    loadCurrentSong:function(){
        

        heading.textContent=this.currentSong.name
        cdThumb.style.backgroundImage=`url('${this.currentSong.image}')`
        audio.src=this.currentSong.path
    },
    loadConfig:function(){
        this.isRandom=this.config.isRandom
        this.isRepeat=this.config.isRepeat
    },
    repeatSong:function(){
        this.loadCurrentSong()
    },
    nextSong:function(){
        this.current_index++
        if(this.current_index>=this.song.length){
            this.current_index=0
        }

        this.loadCurrentSong()
    },
    backSong:function(){
        this.current_index--
        if (this.current_index<0){
            this.current_index=this.song.length-1
        }
        this.loadCurrentSong()
    },
    randomSong:function(){
        let newIndex
        do{
            newIndex=Math.floor(Math.random() * this.song.length)
        }while (newIndex===this.current_index)
         this.current_index=newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong:function(){
        setTimeout(()=>{
            $('.song.show').scrollIntoView({
                behavior:'smooth',
                block:'nearest',
            })
        },200)
    },
    
    start:function(){
        //gắn cấu hình từ config vào object
        this.loadConfig()

        //lắng nghe các sự kiện DOM event
        this.handelEvent()
        //render playlist
        this.render()
        //định nghĩa các thuộc tính cho object
        this.defineProperties()

        //tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        btnrepeat.classList.toggle('active',this.isRepeat)
        btnrandomsong.classList.toggle('active',this.isRandom)
    },

}

app.start()