<template>
	<div>

		<div>
			<b>{{ auth.email }}</b><hr>
			<b>User online : </b>
			<div>
				<p v-for="user in usersOnline">
					<i style="cursor: pointer;" @click="roomChat(user)">
						{{ user.email }}
					</i>
				</p>
			</div>
		</div>

		<div v-if="receiver.user">
			<b>Send to : {{ receiver.user.email }}</b>
			<div id="messages" style="height: 150px; overflow: auto;">
				<p v-for="msg in messages">
					<i>{{ msg.sender }} : </i>{{ msg.message }}
				</p>
			</div>

			<input 
				v-if="loadingRoom"
				type="text"
				value="Loading.." 
				disabled>

			<input 
				v-else
				type="text" 
				v-model="message" 
				@keyup.enter="sendMessage()">

		</div>

	</div>
</template>

<script>
	export default {
	  	name: 'ChatRoom',
	  	props: {
	  		auth: {
	  			type 	: Object,
      			default : null
	  		}
	  	},
	  	data () {
	    	return {
	    		users : [],

	    		receiver : {
	    			user : null,
	    			room : null
	    		},
	    		message  : '',
	    		messages : [],

	    		loadingRoom : false
	    	}
	  	},
	  	computed: {
	  		usersOnline()
	  		{
	  			return this.users.filter(userOn => userOn.id != this.auth.id);
	  		}
	  	},
	  	mounted() {
	  		this.onUsers();
	  		this.listenerUsers();
	    },
	  	methods: {
	  		onUsers()
	  		{	
	  			const auth = {...this.auth, ...{socket_id: this.$socket.id}};
	  			this.$socket.emit('onlineUsers', auth);
	  		},
	  		listenerUsers()
	  		{
	  			this.$socket.on('onlineUsers', (users) => {
		            this.users = users;
		            this.checkOnUser();
		        });
	  		},
	  		checkOnUser()
	  		{
	  			if (typeof this.users.find(userOn => userOn.id == this.auth.id) === 'undefined') 
		    	{
					// relogin
					this.onUsers();
				}
	  		},
	  		roomChat(receiver)
	  		{	
	  			this.offMessage();

	  			this.receiver.user  = receiver;
	  			this.receiver.room	= this.getRoomId(this.auth.id, receiver.id);

	  			this.$socket.emit('chat-message-create-room', {
	  				room : this.receiver.room
	  			}, () => {
	  				// console.log('room ready');
	  				this.listenerMessages();
	  			});
	  		},
	  		getRoomId(id1, id2)
	  		{
	  			return id1 < id2 ? id1+'-'+id2 : id2+'-'+id1;
	  		},
	  		sendMessage()
	  		{
	  			if(this.message == '') return;

	  			this.$socket.emit('chat-message', {
	  				room 		: this.receiver.room,
	  				message 	: this.message,
	  				sender		: this.auth.email
	  			});
	  			
	  			this.message = '';
	  		},
	  		listenerMessages()
	  		{
	  			// first trigger
	  			this.$socket.emit('chat-message', {
	  				room 		: this.receiver.room,
	  				message 	: null
	  			});

	  			// listen
	  			this.$socket.on('chat-message-'+ this.receiver.room, (data) => {
		            this.messages = data;
		            this.scrollTop();
		        });
	  		},
	  		offMessage()
	  		{
	  			if(this.receiver.room)
	  				this.$socket.removeListener('chat-message-'+ this.receiver.room);
	  		},
	  		scrollTop()
	  		{
	  			setTimeout(function(){ 
	  				var objDiv 			= document.getElementById('messages');
					objDiv.scrollTop 	= objDiv.scrollHeight;
	  			}, 200);
	  		}
	  	}
	}
</script>