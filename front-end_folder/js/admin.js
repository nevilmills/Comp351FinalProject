fetch("https://manroopkaur.ca/API/v1/adminstats").then(
 	res=>{
 	res.json().then(
 	data=>{
 		console.log(data);
 		if(data.length > 0){
 			let temp = "";
 			data.forEach((u)=>{
 				temp +="<tr>"
 				temp += "<td>"+u.method+"</td>";
 				temp += "<td>"+u.endpoint+"</td>";
 				temp += "<td>"+u.requests+"</td></tr>";
 			});
 		    document.getElementById("data").innerHTML = temp;
 		}
 	}
 	);
    }
 );