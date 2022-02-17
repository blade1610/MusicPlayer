const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const cd = $('.cd')
const heading = $('header h2')
const songCurrentTime = $('.song-current-time')
const songDuration = $('.song-duration')
const audio = $('#audio')
const player = $('.player')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const spectrum = $('.spectrum')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [{
            name: 'Nevada',
            artist: 'Vicetone',
            path: './music/Nevada - Vicetone_ Cozi Zuehlsdorff.mp3'
        }, {
            name: 'Monody',
            artist: 'TheFatRat',
            path: './music/Monody - TheFatRat_ Laura Brehm.mp3'
        }, {
            name: 'Reality',
            artist: 'Lost Frequencies',
            path: './music/Reality - Lost Frequencies_ Janieck Devy.mp3'
        }, {
            name: 'Summertime',
            artist: 'K-391',
            path: './music/Summertime - K-391.mp3'
        },
        {
            name: 'Unstoppable',
            artist: 'Sia',
            path: './music/Unstoppable - Sia.mp3'
        },
        {
            name: 'Beautiful In White',
            artist: 'Shane Filan',
            path: './music/Beautiful In White - Shane Filan.mp3'
        }, {
            name: 'Beautiful In White',
            artist: 'Shane Filan',
            path: './music/Beautiful In White - Shane Filan.mp3'
        }, {
            name: 'Beautiful In White',
            artist: 'Shane Filan',
            path: './music/Beautiful In White - Shane Filan.mp3'
        }, {
            name: 'Beautiful In White',
            artist: 'Shane Filan',
            path: './music/Beautiful In White - Shane Filan.mp3'
        }, {
            name: 'Beautiful In White',
            artist: 'Shane Filan',
            path: './music/Beautiful In White - Shane Filan.mp3'
        },
        {
            name: 'Tat nuoc dau dinh',
            artist: 'LynkLee, BinZ',
            path: './music/Tat Nuoc Dau Dinh Cowvy Version_ - Lynk.mp3'
        }
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index===this.currentIndex ? 'active' : ''}" data-index='${index}'>
                <div class="thumb"
                    style="background-image: url('https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.artist}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
               
            </div>
            `

        })
        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this = this
        const cdWith = cd.offsetWidth

        // Xu ly animation cd quay
        const cdAnimation = cd.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 10000,
            iterations: Infinity
        })
        cdAnimation.pause()
            // Xu ly Zoom Cd
        document.onscroll = function() {
                const scrollTop = window.scrollY || document.documentElement.scrollTop
                const newCdWidth = cdWith - scrollTop
                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
                cd.style.opacity = newCdWidth / cdWith
            }
            // Xu ly nhan nut Play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else audio.play()

        }

        // Khi bai hat chay 
        audio.onplay = function() {
                _this.isPlaying = true
                player.classList.add('playing')
                    // spectrum.classList.add('active')
                cdAnimation.play()

            }
            // Khi bai hat dung 
        audio.onpause = function() {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdAnimation.pause()
            }
            // tien do bai hat 
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
            // hien thi thoi gian hien tai bai hat
            let secondsConvert = Math.floor((audio.currentTime % 60));
            let minutesConvert = Math.floor(((audio.currentTime / 60) % 60));
            if (secondsConvert < 10) {
                songCurrentTime.innerHTML = minutesConvert + ':0' + secondsConvert;
            } else {
                songCurrentTime.innerHTML = minutesConvert + ':' + secondsConvert;
            }


        }

        //Xu ly khi tua 
        progress.onchange = function(e) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            }
            //  bai hat tiep theo 
        nextBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong()

                } else {

                    _this.nextSong()
                }
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            }
            // bai hat truoc
        prevBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong()

                } else {

                    _this.prevSong()
                }
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            }
            // xu ly bai hat ngau nhien
        randomBtn.onclick = function() {
                _this.isRandom = !_this.isRandom
                randomBtn.classList.toggle("active", _this.isRandom)
            }
            // xu ly bai hat repeat
        repeatBtn.onclick = function() {
                _this.isRepeat = !_this.isRepeat
                repeatBtn.classList.toggle("active", _this.isRepeat)
            }
            // Xu ly khi het bai, repeat
        audio.onended = function() {
                if (_this.isRepeat) {
                    audio.play()
                } else {
                    nextBtn.click()
                }
            }
            // lang nghe hanh vi click vao playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
                // Xu ly khi click vao song
            if (songNode && !e.target.closest('.option')) {
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.scrollToActiveSong()
                _this.render()
                audio.play()
            }
        }
    },
    // Hien active song
    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 200)
    },
    // hien bai hat hien tai
    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name
        audio.src = this.currentSong.path

    },
    // thoi gian bai hat 
    songTime: function() {
        let secondsConvert
        let minutesConvert

        audio.ondurationchange = function() {
            // songDuration = Math.floor(audio.duration)
            secondsConvert = Math.floor((audio.duration % 60));
            minutesConvert = Math.floor(((audio.duration / 60) % 60));
            if (secondsConvert < 10) {
                songDuration.innerHTML = minutesConvert + ':0' + secondsConvert;
            } else {
                songDuration.innerHTML = minutesConvert + ':' + secondsConvert;
            }
        }

    },

    // bai hat tiep theo
    nextSong: function() {
        this.currentIndex++
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0
            }
        this.loadCurrentSong()
    },
    // bai hat truoc
    prevSong: function() {
        this.currentIndex--
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1
            }
        this.loadCurrentSong()
    },
    // che do ngau nhien
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function() {
        //Dinh nghia thuoc tinh cho Object
        this.defineProperties()
            // Lang nghe, xu ly cac su kien DOM Events
        this.handleEvents()
            //Tai thong tin bai hat dau tien vao UI
        this.loadCurrentSong()
            // thoi gian bai hat hien tai
        this.songTime()
            // Render playlist
        this.render()
    },
}
app.start()