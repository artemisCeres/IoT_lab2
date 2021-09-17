'use strict';
//declare function
function fetchTotalMem() {
	// when /totalmem is fetched json is invoked to access memory
fetch('/totalmem')
.then(res=> res.json())
.then(mem =>{
	//saves the value of the item thats name=unit into variable from the html file
	const unit = document.querySelector('input[name=unit]:checked').value;
	//initiates a variable for color classes and sets its initial value to 0
	let colorClass = null;
	//if statement that changes the value of colorClass based on memory usage
	if(mem.percentage < 60){
		colorClass = 'green';
	}else if(mem.percentage >= 90){
		colorClass = 'red';
	}else if (mem.percentage >= 80){
		colorClass = 'orange';
	}
	//initializes variable to store the mamory usage
	let usedMem = mem.totalMem - mem.freeMem;
	//modify value of memory usage in accordance of the value of unit 
	if(unit == 'KB'){
		usedMem /= 1024;
	}else if(unit == 'MB'){
		usedMem /= Math.pow(1024, 2);
	}else if(unit == 'GB'){
		usedMem /= Math.pow(1024, 3);
	}
	//saves the data so far into a variable, sets color class to whatever it needs to be, prints objective and subjective memory usage and the value of unit
	const memHtml = `<span class="${colorClass}">${Math.round(mem.percentage * 100) / 100}%</span>, ${Math.round(usedMem * 100) / 100} ${unit}`;
	//sends the value of previous variable to the html file
	document.getElementById('mem-container').innerHTML= memHtml;

})

}
//calls the initiated function on any button click 
document.querySelectorAll('input[name=unit]:checked').forEach(el =>{
	el.onclick = fetchTotalMem;
});
//calls function then repeats the function call every second
fetchTotalMem();
setInterval(fetchTotalMem, 1000);