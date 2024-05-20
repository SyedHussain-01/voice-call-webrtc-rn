/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {Button, SafeAreaView, StyleSheet, View, StatusBar} from 'react-native';
import {mediaDevices, RTCView} from 'react-native-webrtc';

function App(): React.JSX.Element {
  const [stream, setStream] = useState<any>(null);
  const start = async () => {
    console.log('start');
    if (!stream) {
      try {
        const s: any = await mediaDevices.getUserMedia({video: true});
        setStream(s);
      } catch (e) {
        console.error(e);
      }
    }
  };
  const stop = () => {
    console.log('stop');
    if (stream) {
      stream.release();
      setStream(null);
    }
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.body}>
        {stream && <RTCView streamURL={stream.toURL()} style={styles.stream} />}
        <View style={styles.footer}>
          <Button title="Start" onPress={start} />
          <Button title="Stop" onPress={stop} />
        </View>
      </SafeAreaView>
    </>
  );
}

export default App;

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#fff',
    ...StyleSheet.absoluteFill,
  },
  stream: {
    flex: 1,
  },
  footer: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
});
