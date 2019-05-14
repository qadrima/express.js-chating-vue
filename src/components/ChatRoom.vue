<template>
	<div>
		<div v-if="login">
			<p>You : {{ user.name }}</p>
			<hr>

			<div>
				<b>User online : </b>
				<div>
					<p v-for="user in usersOnline">
						<i @click="onMessage(user)" style="cursor: pointer;">
							{{ user.name }}
						</i>
					</p>
				</div>
			</div>

			<hr>
			<div v-if="sendTo">
				<b>Send to : {{ sendTo.name }}</b>
				<div id="messages" style="height: 150px; overflow: auto;">
					<p v-for="message in messages"><i>{{ message.sender.name }} : </i>{{ message.sender.message }}</p>
				</div>
				<input type="text" v-model="user.message" @keyup.enter="sendMessage()">
			</div>
			
		</div>

		<div v-else>
			<input 
				type="text" 
				v-model="user.name" 
				placeholder="Enter name.."
				@keyup.enter="onLogin()">
		</div>

	</div>
</template>

<script>

	import io from 'socket.io-client';

	let thisSocket = io('localhost:3001');

	export default {
	  	name: 'ChatRoom',
	  	data () {
	    	return {
	    		login : false,
	    		user : {
	    			id 		: null,
	    			name 	: '',
	    			message : ''
	    		},
	    		users 		: [],
	    		sendTo 		: null,
	    		messages 	: []
	    	}
	  	},
	  	computed: {
	  		usersOnline()
	  		{
	  			if(!this.user.id) return [];

	  			return this.users.filter(userOn => userOn.id != this.user.id);
	  		}
	  	},
	  	mounted() {

	    },
	  	methods: {
	  		sendMessage()
	  		{	
	  			const data = {
	  				sender 		: this.user,
	  				receiver 	: this.sendTo
	  			}

	  			thisSocket.emit('message', data);

	            this.user.message = '';
	  		},
	  		onMessage(sendTo)
	  		{
	  			if(this.sendTo)
	  				this.offMessage();

	  			this.messages 	= [];
	  			this.sendTo 	= sendTo;

	  			thisSocket.on('message-'+this.sendTo.id, (data) => {
		            this.messages.push(data);
		            this.scrollTop();
		        });

		        thisSocket.on('message-'+this.user.id, (data) => {
		            this.messages.push(data);
		            this.scrollTop();
		        });
	  		},
	  		offMessage()
	  		{
	  			thisSocket.removeListener('message-' + this.sendTo.id);
	  		},
	  		onUsers()
	  		{	
	  			this.user.id = thisSocket.id;

	  			thisSocket.emit('onlineUsers', this.user);
	  			thisSocket.on('onlineUsers', (data) => {
		            this.users = data;
		            this.login = true;
		        });
	  		},
	  		onLogin()
	  		{
	  			if(this.user.name == '')
	  				return

	  			this.onUsers();
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