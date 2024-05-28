import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {useSocket} from '../context/socketProvider';
import {useNavigation} from '@react-navigation/native';

const Lobby = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userRoom, setUserRoom] = useState('');
  const socket = useSocket();
  const navigation = useNavigation();

  const onFormSubmit = () => {
    console.log('check', socket);
    console.log(userEmail, userRoom);
    socket.emit('room:join', {email: userEmail, room: userRoom});
  };

  const handleJoinRoom = useCallback(data => {
    console.log('handle join room');
    const {email, room} = data;
    console.log(`data from BE: ${data} => ${email} ${room}`);
    navigation.navigate('Room', {roomId: room});
  }, []);

  useEffect(() => {
    socket.on('room:join', handleJoinRoom);

    return () => {
      socket.off('room:join', handleJoinRoom);
    };
  }, [socket]);

  return (
    <View style={styles.container}>
      <View style={styles.inputSpace}>
        <Text>Email</Text>
        <TextInput
          style={styles.inputField}
          value={userEmail}
          onChangeText={text => setUserEmail(text)}
          placeholder={'Enter Email'}
          placeholderTextColor={'black'}
        />
      </View>
      <View style={styles.inputSpace}>
        <Text>Room</Text>
        <TextInput
          style={styles.inputField}
          value={userRoom}
          onChangeText={text => setUserRoom(text)}
          placeholder={'Enter Room'}
          placeholderTextColor={'black'}
        />
      </View>
      <TouchableOpacity style={styles.btn} onPress={onFormSubmit}>
        <Text style={styles.textCol}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Lobby;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputSpace: {
    width: '80%',
    alignItems: 'center',
    gap: 5,
    margin: 4,
  },
  inputField: {
    borderColor: 'black',
    borderWidth: 2,
    width: '60%',
    padding: 2,
    paddingHorizontal: 10,
    alignItems: 'center',
    color: 'black',
    borderRadius: 6,
  },
  btn: {
    borderColor: 'black',
    color: 'black',
    borderWidth: 2,
    width: '60%',
    borderRadius: 12,
    padding: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  textCol: {
    color: 'black',
  },
});
