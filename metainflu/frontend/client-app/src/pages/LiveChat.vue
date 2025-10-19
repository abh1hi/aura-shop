<!-- File: src/views/LiveChat.vue -->
<template>
    <div class="chat-container">
        <div class="chat-window">
            <div class="chat-header">Live Chat with AURA Support</div>
            <div class="chat-log" ref="chatLog">
                <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
                    <div class="message-bubble">{{ message.text }}</div>
                </div>
            </div>
            <div class="chat-input">
                <input type="text" v-model="newMessage" @keypress.enter="sendMessage" placeholder="Type your message...">
                <button @click="sendMessage">Send</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

const newMessage = ref('');
const chatLog = ref(null);
const messages = ref([
    { type: 'received', text: 'Hello! How can I help you today?' }
]);

const sendMessage = () => {
    const text = newMessage.value.trim();
    if (text) {
        messages.value.push({ type: 'sent', text });
        newMessage.value = '';
        
        scrollToBottom();

        setTimeout(() => {
            messages.value.push({ type: 'received', text: 'Thanks for your message! An agent will be with you shortly.' });
            scrollToBottom();
        }, 1000);
    }
};

const scrollToBottom = () => {
    nextTick(() => {
        if (chatLog.value) {
            chatLog.value.scrollTop = chatLog.value.scrollHeight;
        }
    });
};

</script>

<style scoped>
.chat-container {
    font-family: 'Poppins', sans-serif;
    background-color: var(--light-gray);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
.chat-window {
    width: 100%;
    max-width: 400px;
    height: 600px;
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.chat-header {
    background-color: var(--c5);
    color: white;
    padding: 1rem;
    text-align: center;
    font-weight: 500;
}
.chat-log {
    flex-grow: 1;
    padding: 1rem;
    overflow-y: auto;
}
.message {
    margin-bottom: 1rem;
    display: flex;
}
.message.sent {
    justify-content: flex-end;
}
.message.sent .message-bubble {
    background-color: var(--c5);
    color: white;
    border-bottom-right-radius: 5px;
}
.message.received .message-bubble {
    background-color: #eee;
    color: var(--text-color);
    border-bottom-left-radius: 5px;
}
.message-bubble {
    padding: 0.8rem 1rem;
    border-radius: 15px;
    max-width: 80%;
}
.chat-input {
    display: flex;
    padding: 1rem;
    border-top: 1px solid var(--light-gray);
}
.chat-input input {
    flex-grow: 1;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 0.8rem 1rem;
    font-size: 1rem;
}
.chat-input button {
    background-color: var(--c5);
    color: white;
    border: none;
    border-radius: 20px;
    padding: 0.8rem 1.5rem;
    margin-left: 0.5rem;
    cursor: pointer;
}
</style>

