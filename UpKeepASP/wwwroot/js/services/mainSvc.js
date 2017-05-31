/**
 * Created by Joshua Baert on 12/1/2016.
 */

var user = {
	changed: true,
	logout: false
};


angular.module('upKeep').service('mainSvc', function ($http, $q, $state) {
	
	
	function getUser () {
		
		console.log('Getting user.');
		
		let gotUser = false;
		let gotLists = false;
		let gotItems = false;
		
		var ur;
		var ls;
		var it;
		
		let defer = $q.defer();
		
		function giveUser (ur, ls, it) {
			
			if (gotItems && gotLists && gotUser) {
				
				user.id = ur.id;
				user.firstName = ur.first_name;
				user.lastName = ur.last_name;
				user.allowEmail = ur.allow_emails;
				user.allowText = ur.allow_texts;
				user.phoneNumber = ur.phone;
				user.email = ur.email;
				user.lists = [];
				
				ls.forEach((e,i)=>{
					let items = [];
					
					it.forEach((ele,ind)=>{
						if(ele.list_id === e.id) {
							items.push({
								id: ele.id,
								name: ele.item_name,
								date: parseInt(ele.date),
								description: ele.description,
							})
						}
					});
					
					user.lists.push({
						id: e.id,
						name: e.list_name,
						icon: e.icon,
						items: items,
					})
					
				});
				
				defer.resolve(user);
			}
		}
		
		$http.get('/api/user').then((res)=>{
			if (typeof res.data === 'string' || user.logout) {
				console.log('Redirect thrown');
				$state.go('login');
			} else {
				ur = res.data;
				gotUser = true;
				giveUser(ur, ls, it);
			}
			
		});
		$http.get('/api/lists').then((res)=>{
			ls = res.data;
			gotLists = true;
			giveUser(ur, ls, it);
		});
		$http.get('/api/items').then((res)=>{
			it = res.data;
			gotItems = true;
			giveUser(ur, ls, it);
		});
		return defer.promise
	}
	
	
	this.getUser = function () {
		
		var defer = $q.defer();
		
		if (user.changed) {
			user.changed = false;
			getUser().then(function (res) {
				defer.resolve(res);
			});
		} else {
			defer.resolve(user);
		}
		
		return defer.promise
	};
	
	
	this.postList = function (name, icon) {
		user.changed = true;
		var list = {
			userId: user.id,
			name: name,
			icon: icon,
		};
		
		$http.post('/api/lists', list);
	};
	
	this.postItem = function (listId, name, date, description) {
		user.changed = true;
		user.lists.forEach(function (e, i) {
			if (e.id = listId) {
				e.items.push({
					userId: user.id,
					listId: listId,
					name: name,
					date: date,
					description: description,
				})
			}
		});
		$http.post('/api/item', {
			userId: user.id,
			listId: listId,
			name: name,
			date: date,
			description: description,
		});
	};
	
	
	
	this.putUser = function (first, last, email, phone, aEmail, aText) {
		user.changed = true;
		$http.put('/api/user',
			{
				userId: user.id,
				firstName: first,
				lastName: last,
				email: email,
				phoneNumber: phone,
				allowEmail: aEmail,
				allowText: aText,
			});
	};
	
	this.putList = function (listId, name, icon) {
		user.changed = true;
		$http.put('/api/list', {
			listId: listId,
			name: name,
			icon: icon,
		})
	};
	
	this.putItem = function (itemId, name, date, description) {
		user.changed = true;
		$http.put('/api/item', {
			itemId: itemId,
			name: name,
			date: date,
			description: description,
		})
	};
	
	
	this.deleteList = function (listId) {
		user.changed = true;
		user.lists.forEach((e, i) =>{
			if (e.id == listId) {
				user.lists.splice(i,1);
			}
		});
		$http.delete('/api/list/' + listId);
	};
	
	this.deleteItem = function (itemId) {
		user.changed = true;
		console.log('hit Svc with ' + itemId);
		$http.delete('/api/item/' + itemId);
	};
	
	
	this.logout = function () {
		$http.get('/logout').then(function (res) {
			user.logout = true;
			if (typeof res.data === 'string') {
				swal({
					title: 'You are now logged out',
					type: 'success',
					timer: 2000,
					showConfirmButton: false,
				});
				$state.go('login');
			}
		});
	}
	
});



