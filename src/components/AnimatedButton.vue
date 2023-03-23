<template>
  <div class="button-container">
    <span class="mask">{{ label }}</span>
    <button
      @click="onclick"
      :class="customClass"
      :type="buttonType"
      class="flex absolute-center button"
    >
      {{ label }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { ButtonHTMLAttributes, PropType } from "vue";

export default defineComponent({
  name: "AnimatedButton",
  inheritAttrs: false,
  props: {
    customClass: {
      type: String,
      default: "filled",
      validator(value: string) {
        return ["filled", "outlined"].includes(value);
      },
    },
    label: {
      type: String,
      required: true,
    },
    buttonType: {
      type: String as PropType<ButtonHTMLAttributes["type"]>,
      validator(value: string) {
        return ["button", "submit", "reset"].includes(value);
      },
    },
  },
  // emits: ["buttonClick"],
  methods: {
    onclick() {
      this.$emit("buttonClick");
    },
  },
});
</script>
<style scoped lang="scss">
@import "../assets/scss/variables.scss";

@mixin button($bcolor, $url, $x1, $y1, $bor, $col) {
  background: $bcolor;
  -webkit-mask: url($url);
  mask: url($url);
  -webkit-mask-size: $x1 $y1;
  mask-size: $x1 $y1;
  border: $bor;
  color: $col;
}

.button-container {
  position: relative;
  margin-left: 0.2rem;
  margin-right: 0.2rem;
  overflow: hidden;
  font-family: "Helvetica";
  font-weight: 700;
  font-size: 14px;
  transition: 0.5s;
  letter-spacing: 1px;
  border: none;
  .button {
    cursor: pointer;
    -webkit-border-radius: 11;
    -moz-border-radius: 11;
    border-radius: 11px;
    padding: 15px 30px 15px 30px;
    font-size: 14px;
    font-weight: 700;
    @include button(
      $bg-white,
      "https://raw.githubusercontent.com/robin-dela/css-mask-animation/master/img/nature-sprite.png",
      2300%,
      100%,
      none,
      $bg-black
    );

    &:hover {
      -webkit-animation: ani 0.7s steps(22) forwards;
      animation: ani 0.7s steps(22) forwards;
      color: $bg-white;
    }
    &.outlined {
      -webkit-border-radius: 11;
      -moz-border-radius: 11;
      border-radius: 11px;
      font-family: Arial;
      font-size: 14px;
      font-weight: 600;
      padding: 15px 30px 15px 30px;
      text-decoration: none;

      @include button(
        $bg-white,
        "https://raw.githubusercontent.com/robin-dela/css-mask-animation/master/img/nature-sprite.png",
        2300%,
        100%,
        solid $light-grey-20 2px,
        $bg-black
      );

      &:hover {
        -webkit-animation: ani 0.7s steps(22) forwards;
        animation: ani 0.7s steps(22) forwards;
        color: $bg-white;
      }
    }
  }
}

.mask {
  color: $bg-white;
  text-align: center;
  width: 100%;
  font-family: "Helvetica";
  font-weight: 700;
  position: absolute;
  padding: 15px 0px 15px 0px;
  font-size: 14px;
  overflow: hidden;
  border-radius: 13px;
  border: none;
  background-color: $bg-black;
  -webkit-animation: ch 0.7s steps(22) forwards;
  animation: ch 0.7s steps(22) forwards;
}

@-webkit-keyframes ch {
  from {
    background-color: transparent;
  }

  to {
    background-color: black;
  }
}

@keyframes ch {
  from {
    background-color: transparent;
  }

  to {
    background-color: black;
  }
}

@-webkit-keyframes ani {
  from {
    -webkit-mask-position: 0 0;
    mask-position: 0 0;
  }

  to {
    -webkit-mask-position: 100% 0;
    mask-position: 100% 0;
  }
}

@keyframes ani {
  from {
    -webkit-mask-position: 0 0;
    mask-position: 0 0;
  }

  to {
    -webkit-mask-position: 100% 0;
    mask-position: 100% 0;
  }
}

@-webkit-keyframes ani2 {
  from {
    -webkit-mask-position: 100% 0;
    mask-position: 100% 0;
  }

  to {
    -webkit-mask-position: 0 0;
    mask-position: 0 0;
  }
}

@keyframes ani2 {
  from {
    -webkit-mask-position: 100% 0;
    mask-position: 100% 0;
  }

  to {
    -webkit-mask-position: 0 0;
    mask-position: 0 0;
  }
}
</style>
