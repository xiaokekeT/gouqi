import * as React from 'react'
import { IPlayerProps as IProps } from '../interfaces'
import Player from '../components/player'
import { connect } from 'react-redux'
import { IPlayerState, IPlayerStatus } from '../reducers/player'
import {
  changeStatusAction,
  nextTrackAction,
  prevTrackAction
} from '../actions'
import {
  View,
  ViewStyle,
  StyleSheet,
  Image,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'
import { centering, Color } from '../styles'
import { get } from 'lodash'
import Icon from 'react-native-vector-icons/MaterialIcons'

class PlayerContainer extends React.Component<IProps, { currentTime: number }> {
  private player: any

  constructor(props: IProps) {
    super(props)
    this.state = {
      currentTime: 0
    }
  }



  componentWillReceiveProps (nextProps: any) {
    
  }

  componentDidMount() {

  }

  render () {
    const {
      track
    } = this.props
    const picUrl = get(track, 'album.picUrl', '')
    const trackName = get(track, 'name', '')
    const albumName = get(track, 'album.name', '')
    return (
      <View style={styles.container}>
        <Player {...this.props} ref={this.mapPlayer}/>
        <View style={styles.wrapper}>
          {this.renderImage(picUrl)}
          {this.renderText(trackName, albumName)}
          {this.renderBtns()}
        </View>
      </View>
    )
  }

  mapPlayer = (component) => {
    this.player = component
  }

  renderImage = (picUrl: string) => {
    const uri = picUrl || 'http://p4.music.126.net/YhnGyy3LtMFhoCvDI59JNA==/2589349883413112.jpg?param=50y50'
    return (
      <View style={centering}>
        <Image
          source={{ uri }}
          resizeMode='contain'
          style={[styles.component, { borderRadius: 20 }]}
        />
      </View>
    )
  }

  renderText = (title: string, subtitle: string) => {
    return (
      <View style={styles.titleContainer}>
        <View>
          <Text style={styles.title}  numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </View>
    )
  }

  renderBtns = () => {
    const {
      status
    } = this.props
    const playIcon = () => {
      return status === 'PLAYING'
        ? <Icon name='pause-circle-outline' size={32} color='#ccc'/>
        : <Icon name='play-circle-outline' size={32} color='#ccc'/>
    }
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={[styles.btn, styles.component]} onPress={this.togglePlayPause}>
          {playIcon()}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.component]} onPress={this.nextTrack}>
          <Icon name='skip-next' size={32} color='#ccc'/>
        </TouchableOpacity>
      </View>
    )
  }

  togglePlayPause = () => {
    const { status } = this.props
    const { currentTime } = this.player.state
    if (status === 'PLAYING') {
      this.props.changeStatus('PAUSED', currentTime)
    } else {
      this.props.changeStatus('PLAYING', currentTime)
    }
  }

  prevTrack = () => {
    this.props.prev()
  }

  nextTrack = () => {
    this.props.next()
  }

}

const styles = {
  container: {
    padding: 10,
    height: 60,
    borderTopColor: '#ededed',
    backgroundColor: 'rgba(249, 249, 249, 0.9)',
    borderTopWidth: StyleSheet.hairlineWidth
  } as ViewStyle,
  wrapper: {
    flex: 1,
    flexDirection: 'row'
  } as ViewStyle,
  component: {
    width: 40,
    height: 40
  } as ViewStyle,
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  } as ViewStyle,
  btn: {
    ...centering,
    marginLeft: 10
  } as ViewStyle,
  title: {
    marginLeft: 10,
    fontSize: 14
  } as TextStyle,
  subtitle: {
    marginLeft: 10,
    fontSize: 12,
    color: '#777'
  } as TextStyle
}

function mapStateToProps (
  {
    player: {
      playlist,
      playingTrack,
      status,
      mode,
      uri
    }
  }: { player: IPlayerState }
) {
  const track = playlist.find(t => t.id === playingTrack)
  return {
    mode,
    status,
    track,
    uri
  }
}

export default connect(
  mapStateToProps,
  (dispatch) => ({
    prev() {
      return dispatch(prevTrackAction())
    },
    next() {
      return dispatch(nextTrackAction())
    },
    changeStatus(status: IPlayerStatus, currentTime?: number) {
      return dispatch(changeStatusAction(status, currentTime))
    }
  })
)(PlayerContainer)
