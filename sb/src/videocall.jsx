
import React, { useEffect, useRef, useState } from 'react';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { Button, Grid, Paper, Typography, IconButton } from '@mui/material';
import { Mic, MicOff, Videocam, VideocamOff, CallEnd } from '@mui/icons-material';

const appID = 2025053425; // Replace with your Zego app ID
const server = 'fc4b34d4f4a384d692dc64e963be35d0'; // Replace with your server address

const VideoCall = ({ roomID, userID, userName, onEndCall }) => {
    const [zg, setZg] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({});
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [error, setError] = useState(null);
  
    const localVideoRef = useRef(null);
  
    useEffect(() => {
      const initializeZego = async () => {
        try {
          console.log('Initializing Zego with App ID:', appID);
          console.log('Server URL:', server);
          console.log('Room ID:', roomID);
          console.log('User ID:', userID);
          console.log('User Name:', userName);
  
          if (!appID || isNaN(appID) || appID <= 0) {
            throw new Error(`Invalid app ID: ${appID}. Please check your environment variables.`);
          }
  
          if (!server) {
            throw new Error('Server URL is not defined. Please check your environment variables.');
          }
  
          if (!userID) {
            throw new Error('User ID is not provided. Please ensure userID is passed to the component.');
          }
  
          const zgEngine = new ZegoExpressEngine(appID, server);
          console.log('Zego Engine initialized successfully');
          setZg(zgEngine);
  
          zgEngine.on('roomStreamUpdate', handleStreamUpdate);
  
          await startCall(zgEngine);
        } catch (error) {
          console.error('Failed to initialize Zego:', error);
          setError(error.message);
        }
      };
  
      initializeZego();
  
      return () => {
        if (zg) {
          zg.off('roomStreamUpdate');
          if (localStream) {
            zg.destroyStream(localStream);
          }
          zg.logoutRoom(roomID);
        }
      };
    }, [roomID, userID, userName]);
  
    const handleStreamUpdate = async (roomID, updateType, streamList) => {
      console.log(`Stream update in room ${roomID}:`, updateType, streamList);
      if (updateType === 'ADD') {
        const newStreams = { ...remoteStreams };
        for (const stream of streamList) {
          try {
            const remoteStream = await zg.startPlayingStream(stream.streamID);
            newStreams[stream.streamID] = remoteStream;
          } catch (error) {
            console.error(`Failed to play stream ${stream.streamID}:`, error);
          }
        }
        setRemoteStreams(newStreams);
      } else if (updateType === 'DELETE') {
        const newStreams = { ...remoteStreams };
        for (const stream of streamList) {
          if (newStreams[stream.streamID]) {
            zg.stopPlayingStream(stream.streamID);
            delete newStreams[stream.streamID];
          }
        }
        setRemoteStreams(newStreams);
      }
    };
  
    const startCall = async (zgEngine) => {
      try {
        console.log(`Logging into room ${roomID} with user ID ${userID}`);
        const loginResult = await zgEngine.loginRoom(roomID, userID, { userName });
        console.log('Login result:', loginResult);
  
        console.log('Creating local stream');
        const stream = await zgEngine.createStream({
          camera: { video: true, audio: true },
        });
        console.log('Local stream created successfully');
  
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
  
        const streamID = `${userID}-${Date.now()}`;
        console.log(`Starting to publish stream with ID: ${streamID}`);
        await zgEngine.startPublishingStream(streamID, stream);
        console.log('Stream published successfully');
      } catch (error) {
        console.error('Failed to start call:', error);
        setError('Failed to start the call. Please check console for details.');
      }
    };
  
    const endCall = async () => {
      try {
        if (localStream) {
          zg.destroyStream(localStream);
          setLocalStream(null);
        }
        for (const streamID in remoteStreams) {
          zg.stopPlayingStream(streamID);
        }
        setRemoteStreams({});
        await zg.logoutRoom(roomID);
        onEndCall();
      } catch (error) {
        console.error('Failed to end call:', error);
        setError('Failed to end the call properly. Please refresh the page.');
      }
    };
  
    const toggleMute = () => {
      if (localStream) {
        localStream.muteAudio(isMuted);
        setIsMuted(!isMuted);
      }
    };
  
    const toggleVideo = () => {
      if (localStream) {
        localStream.muteVideo(isVideoOff);
        setIsVideoOff(!isVideoOff);
      }
    };
  
    if (error) {
      return (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
          <Typography variant="h6" color="error">
            Error: {error}
          </Typography>
          <Button onClick={onEndCall} variant="contained" color="secondary" style={{ marginTop: '20px' }}>
            Go Back
          </Button>
        </Paper>
      );
    }
  
    return (
      <Paper elevation={3} style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Video Call with {userName}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
              <Typography variant="h6">Local Stream</Typography>
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                style={{ width: '100%', height: 'auto' }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
              <Typography variant="h6">Remote Stream</Typography>
              {Object.values(remoteStreams).map((stream, index) => (
                <video
                  key={index}
                  ref={(el) => el && (el.srcObject = stream)}
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
                />
              ))}
            </Paper>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" spacing={2} style={{ marginTop: '20px' }}>
          <Grid item>
            <IconButton onClick={toggleMute} color={isMuted ? 'secondary' : 'primary'}>
              {isMuted ? <MicOff /> : <Mic />}
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={toggleVideo} color={isVideoOff ? 'secondary' : 'primary'}>
              {isVideoOff ? <VideocamOff /> : <Videocam />}
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={endCall} color="secondary">
              <CallEnd />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    );
  };
  
  export default VideoCall;



  
