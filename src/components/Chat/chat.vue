<template>
  <NLayout has-sider position="absolute">
    <NLayoutSider
      :width="280"
      :nativeScrollbar="false"
      style="background-color: #2f2e41"
    >
      <div class="main-sidebar">
        <div class="channel-main-tile">
          <div class="channel-name">
            <div
              style="font-size: 24px; font-weight: 700; font-family: 'DM Sans'"
            >
              #
            </div>
            <div style="margin-left: 4px">{{ channel.name }}</div>
          </div>
        </div>

        <div>
          <p style="text-align: center; color: #4caf50; font-size: 16px">
            Ongoing:
            <span style="color: #78ff9e; text-decoration: underline">{{
              channel.topic
            }}</span>
          </p>
          <div
            style="
              padding: 2px 3px;
              border: 2px solid #fdd199;
              border-radius: 12px;
              text-align: center;
              color: white;
            "
          >
            <p>{{ channel.description }}</p>
          </div>

          <hr style="color: #fdd199; margin-top: 12px" />
        </div>

        <div class="sub-heading">Channels</div>

        <div
          v-for="(section, i) in chatSections"
          :key="section.id"
          class="section-item"
          :class="{
            active:
              currentSection.id === section.id && !chatStore.onVideoSession,
            'no-margin': i === chatSections.length - 1,
          }"
          @click="switchSection(section)"
        >
          {{ section.name }}
        </div>

        <div class="sub-heading">Members</div>

        <div class="channel-members">
          <ChatMemberCard
            :style="{
              'margin-bottom': i == allMembers.length - 1 ? '0px' : '16px',
            }"
            v-for="(member, i) in allMembers"
            :name="member.name"
            :avatar="member.avatar"
            :isOnline="member.isOnline"
          ></ChatMemberCard>
          <div style="height: 160px"></div>
        </div>
        <div class="btn-container">
          <div style="width: 100%; display: flex; align-items: center">
            <div
              class="vision-call-button"
              :class="{ active: onVideoSession }"
              @click="onVideoSession = !onVideoSession"
            >
              <span style="display: flex; align-items: center; gap: 6px"
                ><span
                  style="
                    width: 20px;
                    height: 20px;
                    color: #fff;
                    font-weight: bold;
                  "
                >
                  <Live20Regular /> </span
                >VisionCall</span
              >
              <span
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <!-- <NAvatarGroup :options="avatarOptions" :size="40" :max="2">
                  <template #avatar="{ options: { name, src } }">
                    <n-avatar color="#FFB178" :src="src"/>
                  </template>
                  <template #rest="{ options: restOptions, rest }">
                    <n-avatar color="#BDFFEF"
                      ><p style="color: #050505">+{{ rest }}</p></n-avatar
                    >
                  </template>
                </NAvatarGroup> -->
                <span
                  v-for="(participant, index) in participants.slice(0, 2)"
                  :key="participant.userId"
                  style="display: flex; justify-content: center"
                >
                  <img
                    :src="participant.userAvatar"
                    style="
                      width: 25px;
                      height: 25px;
                      border-radius: 50%;
                      margin-left: -8px;
                      border: 2px solid #fff;
                    "
                  />
                </span>
                <span
                  v-if="participants.length > 2"
                  style="
                    width: 25px;
                    height: 25px;
                    border-radius: 50%;
                    background-color: #fdd199;
                    border: 2px solid #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-left: -8px;
                    font-size: 12px;
                    color: black;
                  "
                >
                  +{{ participants.length - 2 }}
                </span>
                <HeadphonesSoundWave20Regular
                  v-if="participants.length > 0"
                  style="width: 20px; height: 20px; color: #2f2e41"
                />
                <span v-else>
                  <Headphones20Regular
                    style="width: 20px; height: 20px; color: #2f2e41"
                  />
                </span>
              </span>
            </div>
          </div>
          <button class="back-btn-grad" @click="backBtnHandler">
            Back to Home
          </button>
        </div>

        <!-- <button class="exit-btn-grad">Exit Channel</button> -->
      </div>
    </NLayoutSider>
    <NLayoutContent :nativeScrollbar="false">
      <div class="main-container">
        <div class="header">
          <div>{{ onVideoSession ? "VisionCall" : currentSection.name }}</div>
        </div>
        <div
          class="sub-container"
          :class="{
            'no-padding': onVideoSession,
          }"
        >
          <ChatCollabrateSession v-if="onVideoSession" />
          <ChatSection
            :channel="channel"
            :messageCollection="chatSections[0].id"
            v-else-if="currentSection.id === chatSections[0].id"
          />
          <ChatSection
            :channel="channel"
            :messageCollection="chatSections[1].id"
            v-else-if="currentSection.id === chatSections[1].id"
          />
          <ChatSection
            :channel="channel"
            :messageCollection="chatSections[2].id"
            v-else-if="currentSection.id === chatSections[2].id"
          />
        </div>
      </div>
    </NLayoutContent>
  </NLayout>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, type PropType } from "vue";
import ChatSection from "./ChatSection.vue";
import ChatMemberCard from "./ChatMemberCard.vue";
import type Channel from "../../types/channels/channel";
import {
  NLayout,
  NLayoutSider,
  NLayoutContent,
  NButton,
  NAvatar,
  NAvatarGroup,
} from "naive-ui";
import type ChannelMembers from "../../types/channels/channel_member";
import { onSnapshot, doc, collection, query } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useChannelStore } from "../../stores/channel";
import { useAuthStore } from "../../stores/auth";
import { useChatStore } from "../../stores/chat";
import LiveSessionCard from "./LiveSessionCard.vue";
import ChatCollabrateSession from "./ChatCollabrateSession.vue";
import {
  Headphones20Regular,
  HeadphonesSoundWave20Regular,
  Live20Regular,
} from "@vicons/fluent";

export default defineComponent({
  components: {
    ChatSection,
    NLayout,
    NLayoutSider,
    NLayoutContent,
    ChatMemberCard,
    NButton,
    LiveSessionCard,
    ChatCollabrateSession,
    Headphones20Regular,
    HeadphonesSoundWave20Regular,
    Live20Regular,
    NAvatar,
    NAvatarGroup,
  },
  props: {
    initialChannel: {
      type: Object as PropType<Channel>,
      required: true,
    },
    channelId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      channel: this.initialChannel as Channel,
      members: undefined as ChannelMembers[] | undefined,
      unsubscribeChannel: null as any,
      unsubscribeChannelMembers: null as any,
      unMounted: false,
    };
  },
  setup() {
    const channelStore = useChannelStore();
    const chatStore = useChatStore();
    const { user } = useAuthStore();
    const { onVideoSession } = toRefs(useChatStore());
    const { participants } = toRefs(useChatStore());

    const chatSections = [
      { id: "discussion", name: "Discussion" },
      { id: "General", name: "General" },
      { id: "off-topic", name: "Off Topic" },
    ];

    const currentSection = ref(chatSections[0]);

    function switchSection(section: any) {
      currentSection.value = section;

      chatStore.onVideoSession = false;
      console.log(participants);
    }

    return {
      user,
      chatStore,
      channelStore,
      chatSections,
      currentSection,
      switchSection,
      onVideoSession,
      participants,
    };
  },
  async mounted() {
    this.unsubscribeChannel = onSnapshot(
      doc(db, "channels", this.channelId),
      async (doc) => {
        if (doc.exists()) {
          this.channel = {
            id: doc.id,
            ...doc.data(),
          } as Channel;
        }
      }
    );

    const channelMembersRef = collection(
      db,
      "channels",
      this.channelId,
      "members"
    );
    const membersRefQuery = query(channelMembersRef);

    this.unsubscribeChannelMembers = onSnapshot(
      membersRefQuery,
      (querySnapshot) => {
        const members: ChannelMembers[] = [];

        querySnapshot.forEach((doc) => {
          const member = doc.data() as ChannelMembers;
          member.id = doc.id;
          members.push(member);
        });

        this.members = members;
      }
    );

    window.addEventListener("beforeunload", this.onBeforeUnload);
    window.addEventListener("unload", this.onBeforeUnload);
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.onBeforeUnload);
    window.removeEventListener("unload", this.onBeforeUnload);
  },
  methods: {
    backBtnHandler() {
      this.$router.replace("/home");
    },
    onBeforeUnload() {
      if (this.unMounted) return;
      this.unMounted = true;
      if (this.unsubscribeChannel) this.unsubscribeChannel();
      if (this.unsubscribeChannelMembers) this.unsubscribeChannelMembers();
      if (this.channel?.ownerId === this.user!.id) {
        this.channelStore.updateOwnerStatus(this.channelId, false);
      } else {
        this.channelStore.setUserMemberStatus(
          this.channelId,
          this.user!.id,
          false
        );
      }
    },
  },
  computed: {
    allMembers(): ChannelMembers[] {
      let members: ChannelMembers[] = [];
      if (this.channel) {
        const owner: ChannelMembers = {
          id: this.channel.ownerId,
          userId: this.channel.ownerId,
          name: this.channel.ownerDisplayName,
          avatar: this.channel.ownerAvatar,
          isOwner: true,
          isOnline: this.channel.ownerStatus,
          isJoined: true,
        };
        if (this.members) members = [owner, ...this.members!];
        else members = [owner];
      } else {
        if (this.members) members = this.members;
      }

      // Sort members by isOnline status in descending order
      members.sort((a, b) => {
        if (a.isOnline === b.isOnline) {
          return 0;
        }
        return a.isOnline ? -1 : 1;
      });

      return members;
    },

    avatarOptions() {
      return this.participants.map((participant) => {
        return {
          name: participant.userName,
          src: participant.userAvatar,
        };
      });
    },
    beforeUnmount() {
      this.onBeforeUnload();
    },
  },
});
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Crimson+Text&family=DM+Sans:opsz@9..40&family=Mandali&display=swap");

.main-sidebar {
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  padding-right: 16px;
}

.channel-main-tile {
  margin-top: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(40px);
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;

  .channel-name {
    font-size: 20px;
    font-family: "Mandali";
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}

.sub-heading {
  font-family: "Crimson Text";
  font-size: 16px;
  color: white;
  margin-top: 12px;
  margin-bottom: 16px;
  padding-left: 12px;
}

.section-item {
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  backdrop-filter: blur(40px);
  color: white;
  font-size: 14px;
  font-weight: 700;
  font-family: "DM Sans";
  margin-bottom: 16px;
  cursor: pointer;

  &.no-margin {
    margin-bottom: 0px;
  }

  &.active {
    background: linear-gradient(90deg, #f7354f 0%, #7f02d9 100%);
  }
}

.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(90deg, #fad56f 0%, #fbfee6 100%);
  overflow: hidden;

  .header {
    display: flex;
    padding: 12px 16px;
    font-family: "DM Sans";
    font-weight: 600;
    font-size: 24px;
    color: black;
  }

  .sub-container {
    background: linear-gradient(90deg, #fb1798 0%, #023ef2 100%);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    flex-grow: 1;
    padding: 8px;
    display: flex;
    overflow: hidden;

    &.no-padding {
      padding: 0px;
    }
  }
}

.btn-container {
  position: absolute;
  left: 0px;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 12px;
  padding-top: 12px;
  background-color: rgb(#2f2e41, 0.2);
  backdrop-filter: blur(40px);
}

.back-btn-grad {
  background: linear-gradient(90deg, #fca5b8 0%, #fb21ab 100%);
  box-shadow: 0px 4px 20px rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  padding: 16px 24px;
  height: 48px;
  text-align: center;
  transition: 0.5s;
  color: black;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: 700;
  font-family: "DM Sans";
  font-size: 16px;
}

.vision-call-button {
  background: linear-gradient(90deg, #22948a 0%, #e1fcab 100%);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  backdrop-filter: blur(40px);
  padding: 12px;
  flex-grow: 1;
  margin-inline: 12px;
  margin-bottom: 12px;
  font-weight: 600;
  color: white;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &.active {
    border: 2px solid #fff;
  }
}
</style>
