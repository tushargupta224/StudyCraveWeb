<template>
  <div>
    <aside class="chat-aside">
      <div
        style="
          background-color: darkslateblue;
          height: 100px;
          padding: 15px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
        "
      >
        <div class="aside-header">Channel Name <span>∞</span></div>
        <div class="aside-topic">Channel Topic</div>
      </div>

      <div class="chat-online">Online Members</div>
      <div
        class="chat-online-member"
        v-for="active in actives"
        :key="active.id"
      >
        <div class="chat-online-avatar"></div>
        {{ active.name }}
        <div class="chat-online-icon"></div>
      </div>
    </aside>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "sideBar",
  data() {
    return {
      actives: [
        { id: 1, name: "Kunal" },
        { id: 2, name: "Tushar" },
        { id: 3, name: "Harsh" },
        { id: 4, name: "Mayank" },
        { id: 5, name: "Sonu" },
        { id: 6, name: "Tanya" },
        { id: 7, name: "Swarna" },
      ],
    };
  },
});
</script>
<style lang="scss" scoped>
.chat-aside {
  max-width: 600px;
  height: 98vh;
  width: 300px;
  background-color: #ddd;
  overflow-y: auto;
  overflow-x: hidden;
}
span {
  // color: yellow;
  background: -webkit-linear-gradient(#1e9600, #fff200, #ff0000);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.aside-header {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 12px;
}
.aside-topic {
  font-size: 0.6rem;
  font-weight: bold;
  font-style: italic;
}
.chat-online {
  font-size: 1rem;
  font-weight: lighter;
  text-decoration: dotted;
  margin-bottom: 12px;
  padding: 12px 12px 0 12px;

  &-member {
    margin: auto;
    width: 90%;
    height: 50px;
    border: 1px solid #a7a7a7;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 12px;
  }
  &-icon {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: green;
    margin-right: 12%;
  }
  &-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #ccc;
  }
}
</style>
