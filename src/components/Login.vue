<template>
	<div>
		<pre>
			{{user}}
		</pre>
		<input 
			type="email" 
			v-model="form.email" 
			placeholder="Enter email.."
			@keyup.enter="setLogin()">
	</div>
</template>

<script>

	export default {
	  	name: 'Login',
	  	data () {
	    	return {
	    		form: {
	    			email: ''
	    		},
	    		user: null,
	    		rootLogin : null
	    	}
	  	},
	  	computed: {
	  		
	  	},
	  	mounted() {
	  		this.initSocket();
	    },
	  	methods: {
	  		initSocket()
	  		{
	  			if(this.$socket.id)
		  		{
		  			this.rootLogin = 'login/'+this.$socket.id;
		  			this.onLogin();
		  		}
		  		else
		  		{
		  			setTimeout(this.initSocket, 100);
		  		}
	  		},
	  		setLogin()
	  		{
	  			this.$socket.emit(this.rootLogin, this.form);
	  		},
	  		onLogin()
	  		{
	  			this.$socket.on(this.rootLogin, (data) => {
		            this.user = data;
		        });
	  		}
	  	}
	}
</script>