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
	var allCategoriesUrl="http://davids-restaurant.herokuapp.com/categories.json";
	var categoriesTitleHtml="snippet/categories-title-snippet.html";
	var categoryHtml="snippet/category-snippet.html";
	
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
	
	
	global.$dc=dc;
		
})(window);