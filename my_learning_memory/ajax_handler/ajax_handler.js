var http_request=false;

function ajax_handler(variable){
	http_request=false;
	if(window.XMLHttpRequest){
		http_request=new XMLHttpRequest();
		if(http_request.overrideMimeType){
			http_request.overrideMimeType('text/xml');
		}
	}else if(window.ActiveXObject){
		try{ //6.0+
			http_request=new ActiveXObject("Msxml2.XMLHTTP");
		}catch(e){
			try{ //5.5+
				http_request=new ActiveXObject("Microsoft.XMLHTTP");
			}catch (e){
			}
		}
	}
	if(!http_request){
		alert('Giving up :( Cannot create a XMLHTTP instance');
		return false;
	}
	
	http_request.onreadystatechange=show_area;
	http_request.open('GET','ajax_handler/ajax_reply.php?variable='+variable,true);
	http_request.send(null);
}

function show_area(){
	if(http_request.readyState==4){
		if(http_request.status==200){
			//$('#search').val('');//將輸入框清空
			
			//var show_area = document.getElementById('show_area');
			var div = document.getElementById("show_area");
			for(var count_child = 0; count_child < div.childNodes.length; count_child++){
				div.removeChild(div.childNodes[count_child]);
			}
			
			my_learning_memory = http_request.responseText;
			//var div = document.getElementById("show_area");
			//var note = JSON.parse(JSON.stringify(my_learning_memory));
			var note = JSON.parse(my_learning_memory);
			
			for(var count = 0; count < note.length; count++){
				//if(count_important == parseInt(note[count]['important'])){
				
					if(note[count]['already_display'] == false){
						
						var day_panel_group = document.createElement("div");
						day_panel_group.className = "panel-group";
						
						var day_panel_primary = document.createElement("div");
						day_panel_primary.className = "panel ";
						day_panel_primary.className += "panel-primary";
						
						
						var day_panel_heading = document.createElement("div");
						day_panel_heading.className = "panel-heading";
						day_panel_heading.innerHTML = '日期: ' + note[count]['date'];
						
						var day_panel_body = document.createElement("div");
						day_panel_body.className = "panel-body";
						
						/*div.appendChild(day_panel_group);
						day_panel_group.appendChild(day_panel_primary);
						day_panel_primary.appendChild(day_panel_heading);
						day_panel_primary.appendChild(day_panel_body);*/
						
						
						for(var count_sub = 0; count_sub < note.length; count_sub++){
							//if(count_important == parseInt(note[count_sub]['important'])){
								if(note[count_sub]['already_display'] == false && note[count_sub]['date'] == note[count]['date'] && note[count_sub]['visible'] == '1'){
									
									var note_panel_group = document.createElement("div");
									note_panel_group.className = "panel-group";
									
									var note_panel_primary = document.createElement("div");
									note_panel_primary.className = "panel ";
									note_panel_primary.className += "panel-primary";
									
									
									var note_panel_heading = document.createElement("div");
									note_panel_heading.className = "panel-heading";
									note_panel_heading.innerHTML = '標題: ' + note[count_sub]['title'] + ' / 最後更新: ' + note[count_sub]['last_update'] + '<br />TAG: ' + note[count_sub]['tag_name'];
									
									var note_panel_body = document.createElement("div");
									note_panel_body.className = "panel-body";
									note_panel_body.innerHTML = note[count_sub]['content'];
									
									
									div.appendChild(day_panel_group);
									day_panel_group.appendChild(day_panel_primary);
									day_panel_primary.appendChild(day_panel_heading);
									day_panel_primary.appendChild(day_panel_body);
									
									day_panel_body.appendChild(note_panel_group);
									note_panel_group.appendChild(note_panel_primary);
									note_panel_primary.appendChild(note_panel_heading);
									note_panel_primary.appendChild(note_panel_body);
									
									note[count_sub]['already_display'] = true;
								}
							//}
						}
						
					}
				//}
			}
			
			//$('#show_area').append(note);//將結果顯示出來
		}
	}
}