app.controller("account-ctrl", function($scope, $http, $location) {
	$scope.accs = [];
	$scope.form = {},
		$scope.selection = [];
	$scope.authorities = [];
	$scope.roles = [];
	$scope.initialize = function() {
		// load account
		$http.get("/rest/accounts").then(resp => {
			$scope.accs = resp.data;
		});

		// load roles
		$http.get("/rest/roles").then(resp => {
			$scope.roles = resp.data;
		});

		//load authorities of staffs and directors
		$http.get("/rest/authorities?admin=true").then(resp => {
			$scope.authorities = resp.data;
			console.log(resp.data);
		}).catch(err => {
			$location.path("/unauthorized");
		})

		$scope.reset();
	}

	//Chọn roles
	$scope.toggleRole = function(role) {
		var index = $scope.selection.indexOf(role);
		console.log(index);
		// Đã có role
		if (index > -1) {
			$scope.selection.splice(index, 1);
		}

		// Chưa có role
		else {
			$scope.selection.push(role);
		}
	}

	// Load Role lên form khi nhấn Edit
	$scope.getOneByRole = function(username) {
		$http.get(`/rest/authoritiesOne?username=${username}`).then(resp => {
			$scope.selection = [];
			$scope.roles.forEach(e => {
				resp.data.forEach(e1 => {
					if (e.name == e1.role.name) {
						$scope.selection.push(e);
					}
				})
			})
		})
	}

	// Hiển thị lên form
	$scope.edit = function(item) {
		$scope.form = angular.copy(item);
		$scope.getOneByRole(item.username);
		$(".nav-tabs a:eq(0)").tab('show')
	}

	$scope.moveForm = function() {
		$(".nav-pills button:eq(0)").tab('show')
	}

	$scope.moveList = function() {
		$(".nav-pills button:eq(1)").tab('show')
	}

	// Thêm account
	$scope.create = function() {
		var item = angular.copy($scope.form);
		$http.post(`/rest/accountsManage`, item).then(resp => {
			$scope.accs.push(resp.data);
			console.log(resp.data);
			
			// Thêm phân quyền	
			$scope.selection.forEach(r => {
				var authority = { account: item, role: r };
				$http.post(`/rest/authorities`, authority).then(resp => {
					$scope.accs.push(resp.data);
				}).catch(error => {
					console.log("Error " + error);
				})
			})
			$scope.reset();
			alert("Thêm tài khoản thành công!");
		}).catch(error => {
			console.log("Error ", error);
			alert("Thêm tài khoản thất bại!");
		})

	}

	// Update acc
	$scope.update = function() {
		var item = angular.copy($scope.form);
		$http.put(`/rest/accounts/${item.username}`, item).then(resp => {
			var index = $scope.accs.findIndex(p => p.username == item.username);
			$scope.accs[index] = item;
			// Xóa toàn bộ roles của user hiện tại
			$http.delete(`/rest/authoritiesOne/${item.username}`).then(resp => {
				$scope.selection.forEach(r => {
					var authority = { account: item, role: r };
					$http.post(`/rest/authorities`, authority).then(resp => {
						$scope.accs.push(resp.data);
					}).catch(error => {
						console.log("Error " + error);
					})
				})
			}).catch(error => {
				console.log("Error " + error);
			})
			alert("Cập nhật thành công!");
			console.log(resp.data);
		}).catch(error => {
			alert("Update thất bại!");
			console.log("Error " + error);
		})
	}

	$scope.reset = function() {
		$scope.form = {
			photo: 'user.png',
		}
	}

	//Upload hình
	$scope.imageChanged = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/upload/avatar', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.form.photo = resp.data.name;
		}).catch(err => {
			alert('Lỗi upload Ảnh');
			console.log("Error ", err)
		})
	}
	
	// Khởi đầu
	$scope.initialize();

	$scope.pager = {
		page: 0,
		size: 5,
		get accs() {
			var start = this.page * this.size;
			return $scope.accs.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.accs.length / this.size);
		},
		first() {
			this.page = 0;
		},
		prev() {
			this.page--;
			if (this.page < 0) {
				this.first();
			}
		},
		next() {
			this.page++;
			if (this.page >= this.count) {
				this.last();
			}
		},
		last() {
			this.page = this.count - 1;
		}
	}


})