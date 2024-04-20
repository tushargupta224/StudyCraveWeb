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
          <div style="width: 100%; display: flex;">
            <div class="vision-call-button"  :class="{ active: onVideoSession }"
            @click="onVideoSession = !onVideoSession">VisionCall</div>
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
          <div>{{ onVideoSession ? 'VisionCall' : currentSection.name }}</div>
        </div>
        <div class="sub-container" :class="{
          'no-padding': onVideoSession,
        }">
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
import { NLayout, NLayoutSider, NLayoutContent, NButton } from "naive-ui";
import type ChannelMembers from "../../types/channels/channel_member";
import { onSnapshot, doc, collection, query } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useChannelStore } from "../../stores/channel";
import { useAuthStore } from "../../stores/auth";
import { useChatStore } from "../../stores/chat";
import LiveSessionCard from "./LiveSessionCard.vue";
import ChatCollabrateSession from "./ChatCollabrateSession.vue";

export default defineComponent({
  components: {
    ChatSection,
    NLayout,
    NLayoutSider,
    NLayoutContent,
    ChatMemberCard,
    NButton,
    LiveSessionCard,
    ChatCollabrateSession
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
    };
  },
  setup() {
    const channelStore = useChannelStore();
    const chatStore = useChatStore();
    const { user } = useAuthStore();
    const {onVideoSession} = toRefs(useChatStore());

    const chatSections = [
      { id: "discussion", name: "Discussion" },
      { id: "General", name: "General" },
      { id: "off-topic", name: "Off Topic" },
    ];

    const currentSection = ref(chatSections[0]);

    function switchSection(section: any) {
      currentSection.value = section;

      chatStore.onVideoSession = false;
    }

    return {
      user,
      chatStore,
      channelStore,
      chatSections,
      currentSection,
      switchSection,
      onVideoSession
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
  },
  methods: {
    backBtnHandler() {
      this.$router.replace("/home");
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
  },
  unmounted() {
    this.unsubscribeChannel();
    this.unsubscribeChannelMembers();
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
  margin-top: 16px;
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
  background: linear-gradient(90deg, #22948A 0%, #E1FCAB 100%);
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
