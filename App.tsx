/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import {mediaDevices, RTCView} from 'react-native-webrtc';
import CallAccept from './assets/incoming-call.png';
import CallDecline from './assets/missed-call.png';

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
          <TouchableOpacity onPress={start}>
            <Image source={CallAccept} style={styles.iconStyle} />
          </TouchableOpacity>
          <TouchableOpacity onPress={stop}>
            <Image source={CallDecline} style={styles.iconStyle} />
          </TouchableOpacity>
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
    // flex: 1,
    width: '95%',
    height: '80%',
    alignSelf: 'center',
  },
  footer: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  iconStyle: {
    height: 40,
    width: 40,
    marginHorizontal: 10,
  },
});
