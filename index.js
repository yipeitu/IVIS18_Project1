
var causes = ["Information Visualization", "statistical", "mathematics", "drawing and artistic", "computer usage", "programming", "computer graphics programming", "HCI programming", "user experience evaluation", "communication", "collaboration", "code repository"]
var majors = ["Computer Science", "Human-Computer Interaction", "Media Technology", "Other"]
var majorNumbers = [0, 0 , 0, 0]
var objInterest = {};
var items;
var mainInterest;
var interestNum;
var interestGroups = {};
var skillGroups = {};
var dataCSV;
var interestColor = {};
const groupNum = 10;
const teamNum = 8;

function alphaOnly(a) {
	a = a.replace("\\", "").replace("ing", "");
    var b = '';
    for (var i = 0; i < a.length; i++) {
        if (a[i] >= 'A' && a[i] <= 'z') b += a[i];
    }
    if(["program", "cod", "android", "development", "web"].indexOf(b) !== -1){
    	return "program";
    }
    if(["gaming", "game", "gam"].indexOf(b) !== -1){
    	return "games";
    }
    if(["travelling", "traveling"].indexOf(b) !== -1){
    	return "travel";
    }
    if(["videos", "tv", "series"].indexOf(b) !== -1){
    	return "video";
    }
    if(["designer", "paint"].indexOf(b) !== -1){
    	return "design";
    }
    if(["tennis", "sport", "basketball"].indexOf(b) !== -1){
    	return "sports";
    }
    if("photography" === b){
    	return "photo";
    }
    return b;
}

function calInterest(interests){
	return_interest = []
	for(j = 0; j < interests.length; j++){
		interest = alphaOnly(interests[j].toLowerCase());
		if(["i", "im", "youre", "the", "a", "dont", "did", "are", "",
			"and", "able", "about", "above", "am", "an", "as", "in", "me",
			"no", "not", "to", "of", "my", "like", "have", "enjoy", "interested",
			"also", "time", "for", "at", "play", "friends", "interest", "interests"].indexOf(interest) !== -1){
			continue;
		}
		if(Object.keys(objInterest).indexOf(interest) === -1){
			objInterest[interest] = 1;
		} else {
			objInterest[interest] += 1;
		}
		if(return_interest.indexOf(interest) === -1){
			return_interest.push(interest);
		}
	}
	return return_interest;
};

d3.csv("https://yipeitu.github.io/IVIS18_Project1/data.csv",function(error,data){
    if(error){
        console.log(error);
    }else{
    	data.sort(function(first, second){ return(second.percent-first.percent)})
    	for(i=0; i < data.length; i++){
    		if(majors.indexOf(data[i].major) !== -1){
    			majorNumbers[majors.indexOf(data[i].major)] += 1
    		}
    		else{
    			majorNumbers[majors.length-1] += 1
    		}
    		data[i].interest = calInterest(data[i]["interest and hobbies"].split(" "))
    	}
    	items = Object.keys(objInterest).map(function(key) {
		    return [key, objInterest[key]];
		});

		// Sort the array based on the second element
		items.sort(function(first, second) {
		    return second[1] - first[1];
		});
		var itemsPopular = items.slice(0, 11)
		mainInterest = itemsPopular.map(function(element){ return element[0];})
		interestNum = itemsPopular.map(function(element){ return element[1];})
    	for(i=0; i < data.length; i++){
    		var dataSet = data[i].interest.filter((n) => mainInterest.includes(n));
    		if(dataSet.length > 0){
    			data[i].interest = dataSet
    		}
    	}


    	// data.map(function(element){ return element.interest});
    	var temp = 0;
    	for(var j=0; j < data.length; j++){
			if(data[j].hasOwnProperty("group")){
				continue;
			}
			for(var i = 0; i < mainInterest.length; i++){
				var currentInterest = mainInterest[i]
    			if(Object.keys(interestGroups).indexOf(currentInterest) === -1){
    				interestGroups[currentInterest] = [];
    				skillGroups[currentInterest] = 0
    			}
				// full
				if(interestGroups[currentInterest].length >= teamNum){
					continue;
				}
				index = data[j].interest.indexOf(currentInterest)
				// top interest
				if(index === 0){
					data[j].group = currentInterest;
					interestGroups[currentInterest].push(data[j]);
					skillGroups[currentInterest] += parseInt(data[j].total);
					temp+= 1
				}
			}
		};
		for(var j=0; j < data.length; j++){
			if(data[j].hasOwnProperty("group")){
				continue;
			}
			for(var i = 0; i < mainInterest.length; i++){
				var currentInterest = mainInterest[i]
    			if(Object.keys(interestGroups).indexOf(currentInterest) === -1){
    				interestGroups[currentInterest] = [];
    			}
				// full
				if(interestGroups[currentInterest].length >= teamNum){
					continue;
				}
				index = data[j].interest.indexOf(currentInterest)
				// top interest
				if(index !== -1){
					data[j].group = currentInterest;
					interestGroups[currentInterest].push(data[j]);
					skillGroups[currentInterest] += parseInt(data[j].total);
					temp += 1
				}
			}
		};
		
    	for(var j=0; j < data.length; j++){
			if(data[j].hasOwnProperty("group")){
				continue;
			}
			
			var orderSkills = Object.keys(skillGroups).map(function(key) {
			    return [key, skillGroups[key]];
			});

			// Sort the array based on the second element
			orderSkills.sort(function(first, second) {
			    return first[1] - second[1];
			});
			for(var i = 0; i < orderSkills.length; i++){
				var currentInterest = orderSkills[i][0]
    			if(Object.keys(interestGroups).indexOf(currentInterest) === -1){
    				interestGroups[currentInterest] = [];
    			}
				// full
				if(temp < data.length-1 && interestGroups[currentInterest].length >= 7){
					continue;
				}
				data[j].group = currentInterest;
				interestGroups[currentInterest].push(data[j]);
				skillGroups[currentInterest] += parseInt(data[j].total);
				temp += 1
				break;
			}
    	}
    	dataCSV = data;
    	
    }
});





//(2)加载csv数据
d3.csv("https://yipeitu.github.io/IVIS18_Project1/data.csv",function(error,data){
    if(error){
        console.log(error);
    }else{
    	

    	var pie = d3.layout.pie(interestNum);

    	var h = 800;
    	var w = 800;
    	var outerRadius = 400;
    	var innerRadius = 50;

    	// 用svg的path绘制弧形的内置方法
        var arc=d3.svg.arc()//设置弧度的内外径，等待传入的数据生成弧度
            .outerRadius(outerRadius)
            .innerRadius(innerRadius);

        var svg=d3.select("body")
            .append("svg")
            .attr("width",w)
            .attr("height",h);
        svg.append("text")
        .attr("x", (w / 2))             
        .attr("y", 20)
        .attr("text-anchor", "middle")  
        .style("font", "bold 16px Arial") 
        .text("Most popular hobbies");

        // 颜色函数
        var color=d3.scale.category20();
        //创建序数比例尺和包括10中颜色的输出范围

        // 准备分组,把每个分组移到图表中心
        var arcs=svg.selectAll("g.arc")
            .data(pie(interestNum))
            .enter()
            .append("g")
            .attr("class","arc")
            //移到图表中心
            .attr("transform","translate("+(outerRadius)+","+(outerRadius+30)+")");//translate(a,b)a表示横坐标起点，b表示纵坐标起点

        // 为组中每个元素绘制弧形路路径
        arcs.append("path")//每个g元素都追加一个path元素用绑定到这个g的数据d生成路径信息
            .attr("fill",function(d,i){//填充颜色
                return color(i);
            })
            .attr("d",arc);//将角度转为弧度（d3使用弧度绘制）

        // (6)nameset和numset组合生成文本
        arcs.append("text")//每个g元素都追加一个path元素用绑定到这个g的数据d生成路径信息
            .attr("transform",function(d){ 
                return "translate("+arc.centroid(d)+")";//计算每个弧形的中心点（几何中心）
            })
            .attr("text-anchor","middle")
            .text(function(d,i){
                return mainInterest[i]+":"+d.value;//这里已经转为对象了
            });

    }   
});

d3.csv("https://yipeitu.github.io/IVIS18_Project1/data.csv",function(error,data){
    if(error){
        console.log(error);
    }else{
//get the layernames present in the first data element
		var layernames = causes;
		//get idheights, to use for determining scale extent, also get barnames for scale definition
		var idheights = [];
		var barnames = [];
		var groupValue = []
		for(var i = 0; i < mainInterest.length; i++){
			var currentInterest = mainInterest[i]
			var interestValues = {"id": i+1, "name": currentInterest, "layers": {}}
			interestGroups[currentInterest].forEach(function(student){
				causes.forEach(function(cause){
					if(Object.keys(interestValues["layers"]).indexOf(cause) === -1){
						interestValues["layers"][cause] = parseInt(student[cause])
					}
					else{
						interestValues["layers"][cause] += parseInt(student[cause])
					}
				})
			})
			groupValue.push(interestValues)
		}

		for (var i=0; i<groupValue.length; i++) {
		    tempvalues = d3.values(groupValue[i].layers);
		    tempsum = 0;
		    for (var j=0; j<tempvalues.length; j++) {tempsum = tempsum + tempvalues[j];}
		    idheights.push(tempsum);
		    barnames.push(groupValue[i].name);
		};

		var margin = {top: 10, right: 180, bottom: 30, left: 50},
		    width = 1000 - margin.left - margin.right,
		    height = 600 - margin.top - margin.bottom;

		var x = d3.scale.ordinal()
		    .domain(barnames)
		    .rangeRoundBands([0, width], .25);

		var y = d3.scale.linear()
		    .domain([0, d3.max(idheights)])
		    .range([height, 0]);
		    
		var colors = d3.scale.category20();

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");

		var svg = d3.select("body").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.append("text").attr("class","region")
            .text("Groups skill points...")
            .attr("x", 10)
            .attr("y", 14)
            .style("fill", "Black")
            .style("font", "bold 16px Arial")
            .attr("text-anchor","start");

		svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis);

		svg.append("g")
		    .attr("class", "y axis")
		    .call(yAxis);

		svg.selectAll("focalNodeCanvas")
            .data(layernames).enter().append("svg:circle") // Append circle elements
            .attr("cx", 760)
            .attr("cy", function(d, i) { return (i*20+30); } )
            .attr("stroke-width", ".5")
            .style("fill", function(d, i) { return colors(i); })
            .attr("r", 6)
            .attr("color_value", function(d, i) { return colors(i); })

        svg.selectAll("a.legend_link")
            .data(layernames) // Instruct to bind dataSet to text elements
          .enter().append("svg:a") // Append legend elements
            .append("text")
              .attr("text-anchor", "center")
              .attr("x", 770)
              .attr("y", function(d, i) { return (i*20+30); } )
              .attr("dx", 0)
              .attr("dy", "4px") // Controls padding to place text in alignment with bullets
              .text(function(d) { return d;})
              .attr("color_value", function(d, i) { return colors(i); })
              .attr("type_value", function(d, i) { return d; })
              .attr("index_value", function(d, i) { return "index-" + i; })
              .attr("class", function(d) {
                var str = d;
                var strippedString = str.replace(/ /g, "_")
                return "legendText-" + strippedString; })
              .style("fill", "Black")
              .style("font", "normal 14px Arial")

		//add a g element for each bar
		var bargroups = svg.append("g")
		    .attr("class", "bars")
		    .selectAll("g")
		    .data(groupValue, function(d) {return d.id;})
		  .enter().append("g")
		    .attr("id", function(d) {return d.name;});
		//sub-selection for rect elements
		var barrects = bargroups.selectAll("rect")
		    .data(function(d) {
		        //set data as an array of objects [{height: _, y0: _},..]
		        //must compute sum of other elements to get y0 (computed height)
		        var temparray = [];
		        var tempsum = 0;
		        for (var i=0; i<layernames.length; i++) {
		            console.log(layernames[i]);
		            temparray.push(
		                {height: d.layers[layernames[i]],
		                 y0: tempsum + d.layers[layernames[i]]}
		            );
		            tempsum = tempsum + d.layers[layernames[i]];
		        }
		        return temparray;
		    })
		  .enter().append("rect")
		    .attr({
		        "x": function(d,i,j) {return x(barnames[j]);},
		        "y": function(d) {return y(d.y0);},
		        "width": x.rangeBand(),
		        "height": function(d) {return height - y(d.height);}
		    })
		    .style("fill", function(d,i,j) {return colors(i)});
    }   
});

d3.csv("https://yipeitu.github.io/IVIS18_Project1/data.csv",function(error,data){
    if(error){
        console.log(error);
    }else{
    	var width = 960,
		    height = 500;

		var fill = d3.scale.category20();

		for(var i = 0; i < dataCSV.length; i++){
			dataCSV[i].index = i;
		}
		var nodes = dataCSV

		var force = d3.layout.force()
		    .nodes(nodes)
		    .size([width, height])
		    .on("tick", tick)
		    .start();

		var svg = d3.select("body").append("svg")
		    .attr("width", width)
		    .attr("height", height);

		svg.append("text").attr("class","region")
            .text("Groups by hobbies and skill points...")
            .attr("x", 10)
            .attr("y", 14)
            .style("fill", "Black")
            .style("font", "bold 16px Arial")
            .attr("text-anchor","start");

        
		var node = svg.selectAll(".node")
		    .data(nodes)
		  .enter().append("circle")
		    .attr("class", "node")
		    .attr("cx", function(d) { return d.x; })
		    .attr("cy", function(d) { return d.y; })
		    .attr("r", function(d, i) { return d.percent*20})
		    .style("fill", function(d, i) {
		    	interestColor[d.group] = fill(mainInterest.indexOf(d.group));
		    	return interestColor[d.group]; 
		    })
		    .style("stroke", function(d, i) { return d3.rgb(fill(mainInterest.indexOf(d.group))).darker(2); })
		    .call(force.drag)
		    .on("mousedown", function() { d3.event.stopPropagation(); });


		svg.selectAll("focalNodeCanvas")
            .data(mainInterest).enter().append("svg:circle") // Append circle elements
            .attr("cx", 20)
            .attr("cy", function(d, i) { return (i*20+30); } )
            .attr("stroke-width", ".5")
            .style("fill", function(d, i) { return interestColor[d]; })
            .attr("r", 6)
            .attr("color_value", function(d, i) { return interestColor[d]; })

        svg.selectAll("a.legend_link")
            .data(mainInterest) // Instruct to bind dataSet to text elements
          .enter().append("svg:a") // Append legend elements
            .append("text")
              .attr("text-anchor", "center")
              .attr("x", 40)
              .attr("y", function(d, i) { return (i*20+30); } )
              .attr("dx", 0)
              .attr("dy", "4px") // Controls padding to place text in alignment with bullets
              .text(function(d) { return d+": "+interestGroups[d].length;})
              .attr("color_value", function(d, i) { return interestColor[d]; })
              .attr("type_value", function(d, i) { return d; })
              .attr("index_value", function(d, i) { return "index-" + i; })
              .attr("class", function(d) {
                var str = d;
                var strippedString = str.replace(/ /g, "_")
                return "legendText-" + strippedString; })
              .style("fill", "Black")
              .style("font", "normal 14px Arial")


		var label = svg.selectAll(".mytext")
                    .data(nodes)
                    .enter()
                    .append("text")
                    .text(function (d) { return d.Alias; })
                    .style("text-anchor", "middle")
                    .style("fill", "#555")
                    .style("font-family", "Arial")
                    .style("font-size", 12);

		svg.style("opacity", 1e-6)
		  .transition()
		    .duration(1000)
		    .style("opacity", 1);

		d3.select("body")
		    .on("mousedown", mousedown);

		function tick(e) {

		  // Push different nodes in different directions for clustering.
		  var k1 = 6 * e.alpha;
		  var k2 = 8 * e.alpha;
		  var mapping = [
		  [-(2*k1), -(k2)],
		  [-(k1), -(k2)],
		  [k1, -(k2)],
		  [2*k1, -(k2)],
		  [-(2*k1), k2],
		  [-(k1), k2],
		  [k1, k2],
		  [2*k1, k2],
		  [-(2*k1), 2*k2],
		  [-(k1), 2*k2],
		  [k1, 2*k2],
		  [2*k1, 2*k2],
		  ]
 		  nodes.forEach(function(o, i) {
		  	var index = mainInterest.indexOf(o.group)
		    o.y += mapping[index][0]
		    o.x += mapping[index][1]
		  });

		  node.attr("cx", function(d) { return d.x; })
		      .attr("cy", function(d) { return d.y; });
		  label.attr("x", function(d){ return d.x - 10; })
    		   .attr("y", function (d) {return d.y - 10; });
		}

		function mousedown() {
		  nodes.forEach(function(o, i) {
		    o.x += (Math.random() - .5) * 40;
		    o.y += (Math.random() - .5) * 40;
		  });
		  label.attr("x", function(d){ return d.x; })
    		   .attr("y", function (d) {return d.y - 10; });
		  force.resume();
		}
    }
})