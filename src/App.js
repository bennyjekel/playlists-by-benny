import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string'


let defaultStyle = {
  color: '#fff'
};

let fakeServerData = {
  user: {
    name: 'Benny',
    playlists:[
      {
        name: 'Adrian songs',
        songs:[
          {name:'Song 1', duration: 1345},
          {name:'Song 2', duration: 213},
          {name:'Songs 3',duration: 312}
        ]
      },
      {
        name: 'Benny fake songs 2',
        songs:[
          {name:'Song 1', duration: 1345},
          {name:'Song 2', duration: 213},
          {name:'Songs 3',duration: 312}
        ]
      },
      {
        name: 'Benny fake songs 3',
        songs:[
          {name:'Hi', duration: 1345},
          {name:'Song 2', duration: 213},
          {name:'Songs 3',duration: 312}
        ]
      },
      {
        name: 'Benny fake songs 4',
        songs:[
          {name:'Song 1', duration: 1345},
          {name:'Song 2', duration: 213},
          {name:'Songs 3',duration: 312}
        ]
      }

    ]
  }

};

class PlaylistCounter extends Component{
  render(){
    return(
      <div style={{...defaultStyle, width:"40%", display: 'inline-block'}}> 
        <h2>{this.props.playlists.length} Playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component{
  render(){
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) =>{
      return songs.concat(eachPlaylist.songs)
    } , [])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum+eachSong.duration
    },0)
    return(
      <div style={{...defaultStyle, width:"40%", display: 'inline-block'}}> 
        <h2>{Math.round(totalDuration/60)} Hours</h2>
      </div>
    );
  }
}

class Filter extends Component{
  render(){
    return(
      <div style={defaultStyle}>
        <img/>
        <input type='text' onKeyUp={event => 
          this.props.onTextChange(event.target.value)}/>
      </div>
    );
  }
}

class Playlist extends Component{
  render(){
    let playlist = this.props.playlists
    return(
      <div style={{...defaultStyle, width: "25%", display: 'inline-block'}}>
        <img src={playlist.imageURL} style={{width: '160px'}}/>
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song =>
          <li>{song.name}</li>)}
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor(){
    super()
    this.state = {
      serverData: {},
      filterString: ''
    }
  }
  componentDidMount(){
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token

    fetch('https://api.spotify.com/v1/me', {
      headers:{'Authorization': 'Bearer ' + accessToken}
    }).then(response=>response.json())
    .then(data=>this.setState({
      user:{
        name:data.display_name
      }
      
    }))

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers:{'Authorization': 'Bearer ' + accessToken}
    }).then(response=>response.json())
    .then(data=>this.setState({

      playlists:data.items.map(item => {
        console.log(data.items)
        return{
        name: item.name,
        imageURL: item.images[0].url,
        songs:[]
      }
    })
    }))
  }
  
  render() {
    let playlistsToRender = 
      this.state.user && 
      this.state.playlists 
      ? this.state.playlists.filter(playlists =>
        playlists.name.toLowerCase().includes(
          this.state.filterString.toLowerCase())) 
      : []
    return (
      <div className="App">
        {this.state.user ?
        <div>
          <h1 style={{...defaultStyle, 'fontsize':'54px'}}>
          {this.state.user.name}'s Playlists 
          </h1>
        
          <PlaylistCounter playlists={playlistsToRender}/> 
          <HoursCounter playlists={playlistsToRender}/>
          <Filter onTextChange={text => {
            this.setState({filterString: text})
          }}/>
          {playlistsToRender.map(playlists => 
            <Playlist playlists={playlists}/>
        )}

        </div> : <button onClick={()=>window.location='http://localhost:8888/login'} 
        style={{padding: '20px', 'font-size': '50px', 'margin-top': '20px'}}>Sign in</button>
        }
      </div>
    );
  }
}



export default App;
