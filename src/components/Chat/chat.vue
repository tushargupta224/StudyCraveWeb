<template>
  <NLayout has-sider position="absolute">
    <NLayoutSider
      :width="280"
      :nativeScrollbar="false"
      style="background-color: #ffffff"
    >
      <div>
        <div class="channel-card">
          <img
            contain
            style="height: 100px; width: 225px"
            src="https://www.divami.com/blog/wp-content/uploads/2021/10/How-design-engineering-and-product-teams-work-together.png"
          />
          <div
            style="
              background-color: #071952;
              color: white;
              padding: 4px 8px;
              width: 100%;
            "
          >
            <div style="margin-left: 12px; font-weight: 700">
              {{ channel.name }}
            </div>
          </div>
          <div style="background-color: #f2f7a1; padding: 4px 8px; width: 100%">
            <div style="margin-left: 12px">
              {{ channel.description }}
            </div>
          </div>
        </div>
        <div
          v-for="section in chatSections"
          :key="section.id"
          class="section-item"
          :class="{
            active:
              currentSection.id === section.id && !chatStore.onVideoSession,
          }"
          @click="switchSection(section)"
        >
          {{ section.name }}
        </div>
        <LiveSessionCard />
        <div class="members">Members</div>
        <div class="channel-members">
          <ChatMemberCard
            v-for="member in allMembers"
            :name="member.name"
            :avatar="member.avatar"
            :isOnline="member.isOnline"
          ></ChatMemberCard>
          <div style="height: 200px"></div>
        </div>
        <div class="btn-container">
          <button class="back-btn-grad" @click="backBtnHandler">
            Back to Home
          </button>
        </div>

        <!-- <button class="exit-btn-grad">Exit Channel</button> -->
      </div>
    </NLayoutSider>
    <NLayoutContent :nativeScrollbar="false">
      <ChatSection
        :channel="channel"
        :messageCollection="chatSections[0].id"
        v-if="currentSection.id === chatSections[0].id"
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
    </NLayoutContent>
  </NLayout>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from "vue";
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

export default defineComponent({
  components: {
    ChatSection,
    NLayout,
    NLayoutSider,
    NLayoutContent,
    ChatMemberCard,
    NButton,
    LiveSessionCard,
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
.channel-card {
  display: flex;
  flex-direction: column;
  margin: 12px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
    rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
    rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
  align-items: center;
  overflow: hidden;
}

.section-item {
  padding: 0.5rem 1rem;
  margin: 12px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
  cursor: pointer;
}

.section-item.active {
  font-weight: bold;
  color: #ffffff;
  background: #00d2ff; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #3a7bd5,
    #00d2ff
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #3a7bd5,
    #00d2ff
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.members {
  margin-left: 12px;
  padding: 0.5rem;
  font-weight: bold;
  font-size: 1rem;
}

.channel-members {
  padding-bottom: 60px;
  overflow-y: auto;
}

.btn-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 6px;
  background-color: white;
}

.exit-btn-grad {
  background-image: linear-gradient(
    to right,
    #141e30 0%,
    #243b55 51%,
    #141e30 100%
  );
  margin: 4px;
  padding: 15px 48px;
  text-align: center;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  display: block;
  cursor: pointer;
}

.exit-btn-grad:hover {
  background-position: right center; /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
}

.back-btn-grad {
  background-image: linear-gradient(
    to right,
    #000046 0%,
    #1cb5e0 51%,
    #000046 100%
  );
  margin: 4px;
  padding: 15px 45px;
  text-align: center;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  border: none;
  display: block;
  cursor: pointer;
}

.back-btn-grad:hover {
  background-position: right center; /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
}
</style>
