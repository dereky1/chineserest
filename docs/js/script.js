$(function () {
	$("#navbarToggle").blur(function(event){
		var screenWidth = window.innerWidth;
		console.log("screenWidth");
		if(screenWidth < 768){
			console.log("screen me");
			$("#navbarNavAltMarkup").collapse('hide');
		}
	});
});


(function (global){
	
	var dc={};
	
	var homeHtml="snippet/home-snippet.html";
	var allCategoriesUrl="https://davids-restaurant.herokuapp.com/categories.json";
	var categoriesTitleHtml="snippet/categories-title-snippet.html";
	var categoryHtml="snippet/category-snippet.html";
	var menuItemsUrl="https://davids-restaurant.herokuapp.com/menu_items.json?category=";
	var menuItemsTitleHtml="snippet/menu-items-title.html";
	var menuItemHtml="snippet/menu-item.html";
	
	var insertHtml = function(selector, html){
		var targetElem=document.querySelector(selector);
		targetElem.innerHTML = html;
	};
	
	var showLoading=function(selector){
		var html = "<div class='text-center'>";
		html += "<img src='images/ajax-loader.gif'></div>";
		insertHtml(selector, html);
	};
	
	var insertProperty=function(string, propName, propValue){
		var propToReplace="{{"+propName+"}}";
		string=string.replace(new RegExp(propToReplace, "g"), propValue);
		return string;
	}
	
	document.addEventListener("DOMContentLoaded", function(event){
		
		showLoading("#main");
		$ajaxUtils.sendGetRequest(homeHtml, function(responseText){
			document.querySelector("#main").innerHTML = responseText;
		}, false);
	});
	
	dc.loadMenuCategories=function(){
		showLoading('#main');
		$ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
	};
	
	dc.loadMenuItems=
		function(categoryShort){
			showLoading("#main");
			$ajaxUtils.sendGetRequest(menuItemsUrl + categoryShort, buildAndShowMenuItemHTML);
		}
	;
	
	function buildAndShowCategoriesHTML(categories){
		$ajaxUtils.sendGetRequest(categoriesTitleHtml, 
			function(categoriesTitleHtml){
				$ajaxUtils.sendGetRequest(categoryHtml, 
				function(categoryHtml){
					var categoriesViewHtml=buildCategoriesViewHtml(categories,categoriesTitleHtml,categoryHtml);
					insertHtml("#main", categoriesViewHtml);
				},
				false);
			},
		false);
	}
	
	function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml){
		var finalHtml=categoriesTitleHtml;
		finalHtml += "<section class='row'>";

		for(var i=0; i<categories.length; i++){
			var html=categoryHtml;
			var name="" + categories[i].name;
			var short_name=categories[i].short_name;
			html=insertProperty(html, "name", name);
			html=insertProperty(html, "short_name", short_name);
			finalHtml += html;
		}
		
		finalHtml += "</section>";
		return finalHtml;
	}
	
	function buildAndShowMenuItemHTML(categoryMenuItems){
		$ajaxUtils.sendGetRequest(menuItemsTitleHtml,
			function(menuItemsTitleHtml){
				$ajaxUtils.sendGetRequest(menuItemHtml,
					function(menuItemHtml){
						var menuItemsViewHtml=buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml);
						insertHtml("#main", menuItemsViewHtml);
					},
					false);
			},
			false)
		;
	}
	
	function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml){
		menuItemsTitleHtml=insertProperty(menuItemsTitleHtml,"name",categoryMenuItems.category.name);
		menuItemsTitleHtml=insertProperty(menuItemsTitleHtml,"special_instructions",categoryMenuItems.category.special_instructions);
		
		var finalHtml=menuItemsTitleHtml;
		finalHtml+="<section class='row'>";
			
		var menuItems = categoryMenuItems.menu_items;
		
		for(var i=0;i<menuItems.length;i++){
			var html=menuItemHtml;
			html=insertProperty(html,"img_name","L1");
			html=insertProperty(html,"short_name",menuItems[i].short_name);
			html=insertItemPrice(html,"price_small",menuItems[i].price_small);
			html=insertItemPortionName(html,"small_portion_name",menuItems[i].small_portion_name);
			html=insertItemPrice(html,"price_large",menuItems[i].price_large);
			html=insertItemPortionName(html,"large_portion_name",menuItems[i].large_portion_name);
			html=insertProperty(html,"name",menuItems[i].name);
			html=insertProperty(html,"description",menuItems[i].description);
			
			if(i%2!=0){
				html+="<div class='clearfix d-none d-md-block d-xl-none'></div>"
			}
			finalHtml+=html;
		}
		finalHtml += "</section>";
		return finalHtml;
	}
	
	function insertItemPrice(html,pricePropName,priceValue){
		if(!priceValue){
			return insertProperty(html,pricePropName, "");
		}
		
		priceValue="$"+priceValue.toFixed(2);
		html=insertProperty(html,pricePropName,priceValue);
		return html;
	}
	
	function insertItemPortionName(html,portionPropName,portionValue){
		if(!portionValue){
			return insertProperty(html,portionPropName,"");
		}
		
		portionValue="("+portionValue+")";
		html=insertProperty(html,portionPropName,portionValue);
		return html;
	}
	
	global.$dc=dc;
		
})(window);