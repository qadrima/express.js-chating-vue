<template>
    <div id="app">
        <ChatRoom v-if="auth" :auth="auth"/>
        <Login v-else/>
    </div>
</template>

<script>
    import ChatRoom from './components/ChatRoom'
    import Login from './components/Login'

    export default {
        name: 'App',
        components: {
            ChatRoom,
            Login
        },
        data () {
            return {
                auth: null
            }
        },
        created() {
            this.$eventHub.$on('logged-in', this.setCurrentUser);
        },
        methods: {
            setCurrentUser(data)
            {
                this.auth = data;
            }
        }
    }
</script>