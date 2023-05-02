<template>
  <div class="msg" :class="{ 'left-msg': !author, 'right-msg': author }">
    <div
      class="msg-img"
      style="
        background-image: url(https://image.flaticon.com/icons/svg/327/327779.svg);
      "
    ></div>

    <div class="msg-bubble">
      <div class="msg-info">
        <div class="msg-info-name">BOT</div>
        <div class="msg-info-time">12:45</div>
      </div>

      <div class="msg-text">
        Hi, welcome to SimpleChat! Go ahead and send me a message. 😄
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ChatMessage',
    props: {
        author: {
            required: true,
            type: Boolean,
        }
    }
})
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";
.msg {
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
}
.msg:last-of-type {
  margin: 0;
}
.msg-img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  background: #ddd;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 50%;
}
.msg-bubble {
  max-width: 450px;
  padding: 15px;
  border-radius: 15px;
  background: $left-msg-bg;
}
.msg-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.msg-info-name {
  margin-right: 10px;
  font-weight: bold;
}
.msg-info-time {
  font-size: 0.85em;
}

.left-msg .msg-bubble {
  border-bottom-left-radius: 0;
}

.right-msg {
  flex-direction: row-reverse;
}
.right-msg .msg-bubble {
  background: $right-msg-bg;
  color: #fff;
  border-bottom-right-radius: 0;
}
.right-msg .msg-img {
  margin: 0 0 0 10px;
}

</style>