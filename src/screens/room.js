import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useCallback, useEffect, useRef} from 'react';
import {useSocket} from '../context/socketProvider';
import {mediaDevices, RTCView} from 'react-native-webrtc';
import peer from '../service/peer';
import Video, {VideoRef} from 'react-native-video';

const Room = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [stream, setStream] = useState(null);
  const [remoteSteam, setRemoteStream] = useState(null);

  const handleUserJoin = useCallback(({email, id}) => {
    console.log(`room joined ${email}`);
    setRemoteSocketId(id);
  }, []);

  useEffect(() => {
    socket.on('user:joined', handleUserJoin);
    socket.on('incomming:call', handleIncommngCall);
    socket.on('call:accepted', handelCallAccepted);
    socket.on('peer:nego:needed', handleNegoNeededIncoming);
    socket.on('peer:nego:final', handleNegoFinal);
    return () => {
      socket.off('user:joined', handleUserJoin);
      socket.off('incomming:call', handleIncommngCall);
      socket.off('call:accepted', handelCallAccepted);
      socket.off('peer:nego:final', handleNegoFinal);
    };
  }, [
    socket,
    handleUserJoin,
    handleIncommngCall,
    handelCallAccepted,
    handleNegoNeededIncoming,
    handleNegoFinal,
  ]);

  const handleNegoNeededIncoming = useCallback(
    async ({from, offer}) => {
      const ans = await peer.getAnswer(offer);
      socket.emit('peer:nego:done', {to: from, ans});
    },
    [socket],
  );

  const handleNegoFinal = useCallback(async ({ans}) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener('track', async ev => {
      const remoteStream = ev.streams;
      console.log('GOT TRACKS!!!!!');
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  const sendStream = useCallback(() => {
    for (const track of stream.getTracks()) {
      peer.peer.addTrack(track, stream);
    }
  }, [stream]);

  const handelCallAccepted = useCallback(
    ({from, ans}) => {
      peer.setLocalDescription(ans);
      console.log('call accepted');
      sendStream();
    },
    [sendStream],
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit('peer:nego:needed', {offer, to: remoteSocketId});
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener('negotiationneeded', handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleCallClick = useCallback(async () => {
    const localstream = await mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    try {
      const offer = await peer.getOffer();
      socket.emit('user:call', {to: remoteSocketId, offer});
      setStream(localstream);
    } catch (error) {
      console.log('error==========> ', error);
    }
  }, [remoteSocketId, socket]);

  const handleIncommngCall = useCallback(
    async ({from, offer}) => {
      const localstream = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setStream(localstream);
      console.log('incomming call ', from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit('call:accepted', {to: from, ans});
    },
    [socket],
  );

  const videoRef = useRef(null);
  //   const background = require('./background.mp4');
  return (
    <View>
      <View>
        <Text style={styles.textStyle}>Room</Text>
      </View>
      <View>
        <Text style={styles.textStyle}>
          {remoteSocketId ? 'Connected' : 'No one in the room'}
        </Text>
      </View>
      {stream && (
        <TouchableOpacity onPress={sendStream} style={{backgroundColor: 'red'}}>
          <Text>Send Stream</Text>
        </TouchableOpacity>
      )}
      {remoteSocketId && (
        <TouchableOpacity onPress={handleCallClick}>
          <Text style={styles.textStyle}>Call</Text>
        </TouchableOpacity>
      )}
      {stream && (
        <>
          <Text>Local Stream</Text>
          <RTCView streamURL={stream.toURL()} style={styles.playerStyle} />
        </>
      )}
      {console.log('remote stream====> ', remoteSteam)}
      {remoteSteam && (
        <>
          <Text>Remote Stream</Text>
          {/* <RTCView streamURL={remoteSteam.toURL()} style={styles.playerStyle} /> */}
          <Video
            // Can be a URL or a local file.
            source={remoteSteam}
            // Store reference
            ref={videoRef}
            style={styles.backgroundVideo}
          />
        </>
      )}
    </View>
  );
};

export default Room;

const styles = StyleSheet.create({
  textStyle: {
    color: 'black',
  },
  playerStyle: {
    width: '100%',
    height: '50%',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 300,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
