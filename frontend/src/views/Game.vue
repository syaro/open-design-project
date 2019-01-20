<template>
  <div><p id="status">Loading model...</p></div>
</template>

<style lang="scss" scoped>
#status {
  position: fixed;
  bottom: 0;
  right: 0;
  background: white;
  padding: 10px;
}
.pose_status {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba($color: #000000, $alpha: 0.5);
  color: white;
  ul {
    margin: 0;
    padding: 0;
    li {
      list-style: none;
      text-align: left;
    }
  }
}
</style>

<script>
import P5 from "p5";
import "p5/lib/addons/p5.dom";
import { main, setDelegate } from "../pose";
import io from "socket.io-client";

export default {
  mounted() {
    this.socket = io("localhost:3000");
    new P5(main);
    setDelegate(this.updateMessage);
  },
  methods: {
    updateMessage(message) {
      if (message.position) {
        this.socket.emit("position", JSON.stringify(message.position));
      }
      if (message.userId) {
        this.socket.emit("user", JSON.stringify(message.userId));
      }
    }
  }
};
</script>
