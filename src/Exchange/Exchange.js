import { Component } from 'react';
import Song from '../Song/Song';
import NewSong from '../NewSong/NewSong';
import RotationContext from '../RotationContext';
import config from '../config';
import Loading from '../Loading/Loading';
import moment from 'moment';
import './Exchange.css';

export default class Exchange extends Component {
    static contextType = RotationContext

    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.exId,
            title: '',
            description: '',
            date_created: '',
            created_by: '',
            songs: [],
            users: [],
            new_song: null
        }
    }

    componentDidMount() {
        const options = {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        }

        fetch(`${config.API_ENDPOINT}/users/`, options)
            .then(res => {
                if (!res.ok) {
                return res.json().then(err => { throw err })
                }
                return res.json()
            })
            .then(users => {
                this.setState({
                    users
                })
                fetch(`${config.API_ENDPOINT}/exchanges/${this.state.id}`, options)
                    .then(res => {
                        if (!res.ok) {
                            return res.json().then(err => { throw err })
                        }
                        return res.json()
                    })
                    .then(exchange => {
                        const { id, title, description, date_created, created_by, songs } = exchange
                        const songsWithComm = songs.map(song => {
                            song.new_comment = ''
                            return song
                        })
                        this.setState({
                            id,
                            title,
                            description,
                            date_created,
                            created_by,
                            songs: songsWithComm
                        })
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))

            if (this.context.current_user.id === null) {
                this.context.handleReturnPath(this.props.location.pathname)
            }
    }

    updateComment = (comment, songIdx) => {
        const songs = this.state.songs
        songs[songIdx].new_comment = comment
        this.setState({ songs })
    }

    handleCommentSubmit = (e, songIdx) => {
        e.preventDefault()

        const newComment = {
            message: this.state.songs[songIdx].new_comment,
            song_id: this.state.songs[songIdx].id,
            created_by: this.context.current_user.id,
            exchange_id: this.state.id
        }

        const options = {
            'method': 'POST',
            'headers': {
                'content-type': 'application/json',
            },
            'body': JSON.stringify(newComment)
        }

        fetch(`${config.API_ENDPOINT}/comments/`, options)
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => { throw err })
                }
                return res.json()
            })
            .then(comment => {
                const songs = this.state.songs
                songs[songIdx].comments.push(comment)
                songs[songIdx].new_comment = ''
                this.setState({ songs })
                this.context.updateExchanges()
            })
            .catch(err => console.log(err))
    }

    addSongForm() {
        this.setState({
            new_song: {
                title: "",
                url_link: "",
                artist: "",
                album: ""
            }
        })
    }

    updateTitle = (title) => {
        this.setState({
            new_song: {
                ...this.state.new_song,
                title
            }
        })
    }

    updateLink = (url_link) => {
        this.setState({
            new_song: {
                ...this.state.new_song,
                url_link
            }
        })
    }

    updateArtist = (artist) => {
        this.setState({
            new_song: {
                ...this.state.new_song,
                artist
            }
        })
    }

    updateAlbum = (album) => {
        this.setState({
            new_song: {
                ...this.state.new_song,
                album
            }
        })
    }

    handleSongSubmit = (e) => {
        e.preventDefault()

        const { title, url_link, artist, album } = this.state.new_song
        const exchange_id = this.state.id
        const added_by = this.context.current_user.id

        const newSong = {
            title,
            url_link,
            artist,
            album,
            added_by,
            exchange_id
        }

        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newSong)
        }

        fetch(`${config.API_ENDPOINT}/songs/`, options)
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => { throw err})
                }
                return res.json()
            })
            .then(song => {
                song.comments = []
                this.setState({
                    songs: [
                        ...this.state.songs,
                        song
                    ],
                    new_song: null
                })
                this.context.updateExchanges()
            })
            .catch(err => console.log(err))
    }

    copyLink = () => {
        navigator.clipboard.writeText(`https://rotationexchange.com/exchange/${this.state.id}`)
    }

    render() {
        const songs = this.state.songs.map((song, i) => {
            return (
                <Song 
                    users={this.state.users} 
                    song={song} 
                    index={i} 
                    key={i}
                    handleComment={this.updateComment}
                    handleCommentSubmit={this.handleCommentSubmit}
                />
            ) 
        })

        const AddSong = this.state.new_song 
        ? <form id="ex-add-song" autoComplete='off'  onSubmit={e => this.handleSongSubmit(e)}>
            <NewSong 
                index={1}
                form_state={this.state.new_song}
                handleTitle={this.updateTitle}
                handleLink={this.updateLink}
                handleArtist={this.updateArtist}
                handleAlbum={this.updateAlbum}
            />
            <button id="ex-submit-song-btn" type='submit'>Add To Exchange</button>
        </form>
        : <button 
            disabled={this.context.current_user.id === null} 
            id="ex-add-song-btn" 
            onClick={e => this.addSongForm(e)}
        >   
            {this.context.current_user.id === null ? 'Log in to add song' : 'Add Song'}
        </button> 

        const username = this.state.created_by ? this.state.users.find(user => user.id === this.state.created_by).username : ''

        return !this.state.title ? <Loading /> : (
            <main>
                <header id="exchange-header">
                    <h2 id="exchange-title">{this.state.title}</h2>
                    <h5>Created by {username} on {moment(this.state.date_created).format('l')}</h5>
                    <p id="ex-description">{this.state.description}</p>
                    <p>Share this exchange page with a friend!</p>
                    <button onClick={() =>  this.copyLink()} id="copy-btn">Copy Link to Clipboard</button>
                </header>
                {songs}
                {AddSong}
            </main>
        )
    }
}