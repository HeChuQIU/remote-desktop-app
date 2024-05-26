<script setup lang="ts">
import {onMounted} from 'vue';
import {HubConnectionBuilder} from "@microsoft/signalr";

let connection = new HubConnectionBuilder().withUrl("http://localhost:5000/chatHub").build();

onMounted(() => {
  //Disable the send button until connection is established.
  document.getElementById("sendButton").disabled = true;

  connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you
    // should be aware of possible script injection concerns.
    li.textContent = `${user} says ${message}`;
  });

  connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
  }).catch(function (err) {
    return console.error(err.toString());
  });

  document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
      return console.error(err.toString());
    });
    event.preventDefault();
  });
});
</script>

<template>
  <div class="container">
    <div class="row p-1">
      <div class="col-1">User</div>
      <div class="col-5"><input type="text" id="userInput"/></div>
    </div>
    <div class="row p-1">
      <div class="col-1">Message</div>
      <div class="col-5"><input type="text" class="w-100" id="messageInput"/></div>
    </div>
    <div class="row p-1">
      <div class="col-6 text-end">
        <input type="button" id="sendButton" value="Send Message"/>
      </div>
    </div>
    <div class="row p-1">
      <div class="col-6">
        <hr/>
      </div>
    </div>
    <div class="row p-1">
      <div class="col-6">
        <ul id="messagesList"></ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>