const app = angular.module("shopping-cart-app",[]);

app.controller("shopping-cart-ctrl",function($scope, $http){

	$scope.cart = {
		items: [],
		add(id){
			var item = this.items.find(item => item.id == id);
			if(item){
				item.qty++;
				this.saveToLocalStorage();
			}
			else{
				$http.get(`/rest/products/${id}`).then(resp => {
					resp.data.qty = 1;
					this.items.push(resp.data);
					this.saveToLocalStorage();
				})
			}
		},
		
//		Lưu mặt hàng vào local storage		
		saveToLocalStorage(){
			var json = JSON.stringify(angular.copy(this.items));
			localStorage.setItem("cart",json);
		},
		
//		Tính tổng số lượng các mặt hàng trong giỏ
		get count(){
			return this.items
			.map(item => item.qty)
			.reduce((total, qty) => total += qty, 0);
		},
		
//      Tổng thành tiền các mặt hàng trong giỏ		
		get amount(){
			return this.items
			.map(item => item.qty * item.price)
			.reduce((total, qty) => total += qty, 0);
		},
		
		//Tổng thành tiền có ship các mặt hàng trong giỏ		
		get amountship(){
			return this.items
			.map(item => item.qty * item.price + 10)
			.reduce((total, qty) => total += qty, 0);
		},
		
//		Đọc giỏ hàng từ local storage		
		loadFormLocalStorage(){
			var json = localStorage.getItem("cart");
			this.items = json ? JSON.parse(json):[];
		},
		
// 		Xóa sản phẩm khỏi giỏ hàng		
		remove(id){
			var index = this.items.findIndex(item => item.id == id);
			this.items.splice(index, 1);
			this.saveToLocalStorage();
		},
		
//		Xóa sạch giỏ hàng		
		clear(){
			this.items=[]
			this.saveToLocalStorage();
		}
	}
	$scope.cart.loadFormLocalStorage();
	
//  Đặt hàng	
	$scope.order = {
		createDate: new Date(),
		address:"",
		account:{username:$("#username").text()},
		get orderDetails(){
			return $scope.cart.items.map(item => {
				return{
					product:{id: item.id},
					price: item.price,
					quantity: item.qty
				}
			});
		},
		purchase(){
			var order = angular.copy(this);
			// thực hiện đặt hàng
			$http.post("/rest/orders",order).then(resp => {
				alert("Đặt hàng thành công");
				$scope.cart.clear();
				location.href="/order/detail/" + resp.data.id;
			}).catch(error => {
				alert("Đặt hàng lỗi!")
				console.log(error)
				
			})
		}
	}
})

// Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
	
