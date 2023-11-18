<template>
  <div class="video-list">
    <div
      v-for="item in videoList"
      v-bind:video="item"
      v-bind:key="item.id"
      class="video-item"
    >
      <video
        autoplay
        playsinline
        ref="videos"
        :muted="item.muted"
        :id="item.id"
        style="width: 100%; height: 100%; transform: scaleX(-1)"
      ></video>

      <div
        style="
          bottom: 3%;
          left: 50%;
          position: absolute;
          color: white;
          transform: translateX(-50%);
          border-radius: 12px;
          backdrop-filter: blur(14px);
          background-color: rgba(255, 255, 255, 0.2);
          padding: 2px 5px;
        "
      >
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <div
            style="
              width: 25px;
              height: 25px;
              border-radius: 50%;
              border: 1px solid white;
              background-color: transparent;
              margin-right: 5px;
              overflow: hidden;
            "
          >
            <img
              :src="participantDetails(item.id).userAvatar"
              style="width: 100%; height: 100%"
            />
          </div>

          {{ participantDetails(item.id).userName }}
        </div>
      </div>
      <div
        style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          background: white;
        "
        v-if="!participantDetails(item.id).videoEnabled"
      >
        <img
          :src="participantDetails(item.id).userAvatar"
          alt="img"
          style="width: 100%; height: 100%; filter: blur(4px)"
        />
        <img
          :src="participantDetails(item.id).userAvatar"
          alt="img"
          style="
            position: absolute;
            z-index: 5;
            width: 100%;
            height: 100%;
            filter: blur(15px);
          "
        />

        <div
          style="
            position: absolute;
            z-index: 10;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
        >
          <img
            :src="participantDetails(item.id).userAvatar"
            alt="dp"
            style="width: 80px; height: 80px; border-radius: 50%"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, type PropType } from "vue";
import { Socket, io } from "socket.io-client";
import SimpleSignalClient from "simple-signal-client";
import type { ISessionParticipants } from "../../types/channels/ISessionParticipants";

interface CallVideo {
  id: string;
  muted: boolean;
  stream: MediaStream;
  isLocal: boolean;
}

const signalClient = ref();
const socket = ref<Socket>();

const videoList = ref<CallVideo[]>([]);
const videos = ref();

const props = defineProps({
  roomId: {
    type: String,
    default: "public-101",
  },
  participants: {
    type: Array as PropType<ISessionParticipants[]>,
    default: [],
  },
  socketURL: {
    type: String,
    required: true,
  },
  cameraHeight: {
    type: [Number, String],
    default: 160,
  },
  audioEnabled: {
    type: Boolean,
    default: true,
  },
  videoEnabled: {
    type: Boolean,
    default: true,
  },
  enableLogs: {
    type: Boolean,
    default: false,
  },
  peerOptions: {
    type: Object, // NOTE: use these options: https://github.com/feross/simple-peer
    default() {
      return {};
    },
  },
  ioOptions: {
    type: Object, // NOTE: use these options: https://socket.io/docs/v4/client-options/
    default() {
      return {
        rejectUnauthorized: false,
        transports: ["polling", "websocket"],
      };
    },
  },
  deviceId: {
    type: String,
    default: null,
  },
});

const emits = defineEmits([
  "update:audioEnabled",
  "update:videoEnabled",
  "opened-room",
  "joined-room",
  "left-room",
  "share-started",
  "localAudioStatusChange",
  "localVideoStatusChange",
]);

const {
  roomId,
  socketURL,
  audioEnabled,
  videoEnabled,
  ioOptions,
  deviceId,
  peerOptions,
  enableLogs,
  participants,
} = toRefs(props);

const participantDetails = (mediaStreamId: string): ISessionParticipants => {
  const participant = participants.value?.find(
    (t) => t.mediaStreamId === mediaStreamId
  );

  if (!participant) {
    const defaultDetails: ISessionParticipants = {
      userId: "random",
      userName: "Anonymous",
      userAvatar:
        "https://cdn.dribbble.com/users/3474264/screenshots/11222954/background-2_4x.png",
      mediaStreamId: mediaStreamId,
      audioEnabled: true,
      videoEnabled: true,
    };

    return defaultDetails;
  }

  return {
    ...participant,
    userAvatar:
      "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
  };
};

const join = async () => {
  console.log("join");
  socket.value = io(socketURL.value, ioOptions.value);
  signalClient.value = new SimpleSignalClient(socket.value);

  //Initial constraints
  let constraints: MediaStreamConstraints = {
    video: videoEnabled.value,
    audio: audioEnabled.value,
  };

  if (deviceId.value && videoEnabled.value) {
    constraints.video = { deviceId: { exact: deviceId.value } };
  }

  //Get user local stream
  const localStream = await navigator.mediaDevices.getUserMedia(constraints);

  console.log("opened", localStream);
  joinedRoom(localStream, true);

  signalClient.value.once("discover", (discoveryData: any) => {
    console.log("discovered", discoveryData);
    async function connectToPeer(peerID: string) {
      if (peerID == socket.value?.id) return;
      try {
        console.log("Connecting to peer");
        const { peer } = await signalClient.value.connect(
          peerID,
          roomId.value,
          peerOptions.value
        );
        videoList.value.forEach((v) => {
          if (v.isLocal) {
            onPeer(peer, v.stream);
          }
        });
      } catch (e) {
        console.log("Error connecting to peer");
      }
    }
    discoveryData.peers.forEach((peerID: string) => connectToPeer(peerID));
    emits("opened-room", roomId.value);
  });
  signalClient.value.on("request", async (request: any) => {
    console.log("requested", request);
    const { peer } = await request.accept({}, peerOptions.value);
    console.log("accepted", peer);
    videoList.value.forEach((v) => {
      if (v.isLocal) {
        onPeer(peer, v.stream);
      }
    });
  });
  signalClient.value.discover(roomId.value);
};

const onPeer = (peer: any, localStream: MediaStream) => {
  log("onPeer");
  peer.addStream(localStream);
  peer.on("stream", (remoteStream: MediaStream) => {
    joinedRoom(remoteStream, false);
    peer.on("close", () => {
      var newList: CallVideo[] = [];
      videoList.value.forEach(function (item) {
        if (item.id !== remoteStream.id) {
          newList.push(item);
        }
      });
      videoList.value = newList;
      emits("left-room", remoteStream.id);
    });
    peer.on("error", (err: any) => {
      log("peer error ", err);
    });
  });
};

const joinedRoom = (stream: MediaStream, isLocal: boolean) => {
  let found = videoList.value.find((video) => {
    return video.id === stream.id;
  });
  if (found === undefined) {
    let video = {
      id: stream.id,
      muted: isLocal,
      stream: stream,
      isLocal: isLocal,
    };

    videoList.value.push(video);
  }

  setTimeout(function () {
    for (var i = 0, len = videos.value.length; i < len; i++) {
      if (videos.value[i].id === stream.id) {
        videos.value[i].srcObject = stream;
        break;
      }
    }
  }, 500);

  emits("joined-room", stream.id);
};

const leave = () => {
  videoList.value.forEach((v) => v.stream.getTracks().forEach((t) => t.stop()));
  videoList.value = [];
  signalClient.value?.peers().forEach((peer: any) => peer.removeAllListeners());
  signalClient.value?.destroy();
  signalClient.value = undefined;
  (socket.value as any)?.destroy();
  socket.value = undefined;
};

const shareScreen = async () => {
  if (navigator.mediaDevices == undefined) {
    log("Error: https is required to load cameras");
    return;
  }

  try {
    var screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });
    joinedRoom(screenStream, true);
    emits("share-started", screenStream.id);
    signalClient.value.peers().forEach((p: any) => onPeer(p, screenStream));
  } catch (e) {
    log("Media error: " + JSON.stringify(e));
  }
};

const toggleLocalMic = () => {
  const localStream = videoList.value.find((v) => v.isLocal)?.stream;
  if (localStream) {
    const audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    emits("update:audioEnabled", audioTrack.enabled);

    const sessionParticipant = participantDetails(localStream.id);

    if (sessionParticipant) {
      const updated: ISessionParticipants = {
        ...sessionParticipant,
        audioEnabled: audioTrack.enabled,
      };

      emits("localAudioStatusChange", updated);
    }

    replaceTrack(audioTrack, localStream);
  }
};

const toggleLocalVideo = () => {
  const localStream = videoList.value.find((v) => v.isLocal)?.stream;
  if (localStream) {
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    emits("update:videoEnabled", videoTrack.enabled);

    const sessionParticipant = participantDetails(localStream.id);

    if (sessionParticipant) {
      const updated: ISessionParticipants = {
        ...sessionParticipant,
        videoEnabled: videoTrack.enabled,
      };

      emits("localVideoStatusChange", updated);
    }

    replaceTrack(videoTrack, localStream);
  }
};

const replaceTrack = (newTrack: MediaStreamTrack, stream: MediaStream) => {
  const peer = signalClient.value
    .peers()
    .find((p: any) => p.stream?.id === stream.id);
  if (peer) {
    const sender = peer.peer.streams[0]
      .getTracks()
      .find((t: MediaStreamTrack) => t.kind === newTrack.kind);
    sender.replaceTrack(newTrack);
  }
};

const log = (message: string, data?: any) => {
  if (enableLogs.value) {
    console.log(message);
    if (data) {
      console.log(data);
    }
  }
};

defineExpose({
  join,
  leave,
  shareScreen,
  toggleLocalMic,
  toggleLocalVideo,
});
</script>
<style scoped lang="scss">
.video-list {
  background: whitesmoke;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background: url("https://cdn.dribbble.com/users/3474264/screenshots/11222954/background-2_4x.png");
  overflow: hidden;
}

.video-list div {
  padding: 0px;
}

.video-item {
  background-color: transparent;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 10px;
  width: 386px;
  height: 290px;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  border: 2px solid #363062;

  &.mic-on {
    border: 2px solid #ffc72c;
    box-shadow: #ffc72c 0px 0px 50px;
  }
}
</style>
