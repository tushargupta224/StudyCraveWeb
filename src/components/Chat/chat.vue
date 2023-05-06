<!-- Chat.vue -->
<template>
  <div class="chat">
    <div class="sidebar">
      <div
        v-for="section in chatSections"
        :key="section.id"
        class="section-item"
        :class="{ active: currentSection.id === section.id }"
        @click="switchSection(section)"
      >
        {{ section.name }}
      </div>
    </div>
    <ChatSectionT
      :channel="channel"
      :messageCollection="chatSections[0].id"
      v-if="currentSection.id === chatSections[0].id"
    />
    <ChatSectionT
      :channel="channel"
      :messageCollection="chatSections[1].id"
      v-else-if="currentSection.id === chatSections[1].id"
    />
    <ChatSectionT
      :channel="channel"
      :messageCollection="chatSections[2].id"
      v-else-if="currentSection.id === chatSections[2].id"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from "vue";
import ChatSectionT from "./ChatSectionT.vue";
import type Channel from "../../types/channels/channel";

export default defineComponent({
  components: {
    ChatSectionT,
  },
  props: {
    channel: {
      type: Object as PropType<Channel>,
      required: true,
    },
  },
  setup() {
    const chatSections = [
      { id: "discussion", name: "Discussion" },
      { id: "General", name: "General" },
      { id: "off-topic", name: "Off Topic" },
    ];

    const currentSection = ref(chatSections[0]);

    function switchSection(section: any) {
      currentSection.value = section;
    }

    return {
      chatSections,
      currentSection,
      switchSection,
    };
  },
});
</script>

<style scoped>
.chat {
  display: flex;
  height: 100%;
}

.sidebar {
  width: 200px;
  background-color: #f0f0f0;
  padding: 1rem;
  border-right: 1px solid #ccc;
}

.section-item {
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.section-item.active {
  font-weight: bold;
  background-color: #e0e0e0;
}
</style>
