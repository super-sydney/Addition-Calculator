function interpreter(){ //string of equations, split by line endings (\n)
	let equations = document.getElementById('equations').value.split(/\n|,|\s+/g), 
		solution = '', answers = [];
	equations.forEach(function(val, ind){		
		let temp = val.trim().match(/\d+/g);
		temp[0] = parseInt(temp[0]);
		temp[1] = parseInt(temp[1]);
		if (val.includes('+')){
			answers.push(temp[0]+temp[1]);
		}else if (val.includes('-')){
			answers.push('subtraction doesn\'t work yet'); //FIX THIS
		}else if (val.includes('*')){
			answers.push(mult(temp[0], temp[1]));
		}else if (val.includes('/')){
			answers.push(divide(temp[0], temp[1]));
		}else if (val.includes('^')){
			answers.push(exp(temp[0], temp[1]));
		}else{
			answers.push(val + ' (Something went wrong)');
		}
		solution += (equations[ind] + ' = ' + answers[ind] + '\n');
	});
	document.getElementById('equations').value = solution;
	return answers;

}

function negate(n){ //make n negative (really slow, but idk how else)
	let smallNumber = Number.MIN_SAFE_INTEGER+9007198254740991;
	if (smallNumber + n > 0){
		console.log('this only works with numbers up to '+smallNumber*-1);
		return;
	}
	while (smallNumber + n !== 0){
		smallNumber++;
	}
	return smallNumber;
}

function complement(n, a){
	let compl = n.toString().split('').reverse(), temp = [], carry = 0, r = 0;
	for (var i = 0; i < compl.length; i++){
		if (i === 0){
			while (parseFloat(compl[0]) + r < 10){
				r++;
			}
			if (r === 10){
				carry = 1;
				temp.push(0);
			}else{
				temp.push(r);
			}
		}else{
			if (compl[i] === '.'){
				temp.push('.');
				continue;
			}
			while (parseFloat(compl[i]) + r < 9){
				r++;
			}
			if ((r + carry) === 10){
				temp.push(0);
			}else{
				temp.push(r+carry);
				carry = 0;
			}
		}
		r = 0;
	}
	for (var j = 0; j < a; j++){
		temp.push('9');
	}
	return parseFloat(temp.reverse().toString().replace(/,/g, ''));
}

function subtract(a, b){
	if (a === b){ //5 - 5 = 0, 6 - 6 = 0;
		return 0;
	}else if (a === 0){ //0 - 4 = -4
		return negate(b);
	}else if (b === 0){ //3 - 0 = 3
		return a;
	}else if (a < 0 && b < 0){ //-3 - -4 = -3 + 4 = 4 - 3
		return subtract(Math.abs(b), Math.abs(a));
	}else if (a < 0){ //b isn't smaller than 0, -3 - 4 = - (3 + 4)
		return negate(Math.abs(a) + b);
	}else if (b < 0){ //a isn't smaller than 0, 3 - -4 = 3 + 4
		return a + Math.abs(b);
	}else if (a > b){ //a and b are both greater than 0, 4 - 3 = 1
		if (a.toString().length > b.toString().length){
			var fill = 0;
			while (b.toString().length + fill !== a.toString().length){
				fill++;
			}
			return parseInt((a + complement(b, fill+1)).toString().slice(1));
		}else{
			return parseInt((a + complement(b)).toString().slice(1));
		}
	}else if (b > a){ //3 - 4 = - (4 - 3) = -1
		return negate(subtract(b, a));
	}else{
		console.log('That\'s... weird: ' + (a, b));
	}
}

function fullMult(a, b){ //simple multiplication with loops
	let temp = 0;
	if ((Math.floor(a) === a) && (Math.floor(b) === b)){
		for (var k = 0; k < Math.min(a, b); k++){
			temp += Math.max(a, b);
		}
	}else{
		console.log('This function is only for integers');
	}
	return temp;
}

function mult(a, b){ 
	if (a < 0 && b < 0){
		return mult(Math.abs(a), Math.abs(b));
	}else if (a < 0 || b < 0){
		return negate(mult(Math.abs(a), Math.abs(b)));
	}else{
		let first = Math.max(a, b).toString().split('').reverse(), 
			second = Math.min(a, b).toString().split('').reverse(),
		zeroes = 0, carry = 0, temp = '', ans = 0;

		for (var s = 0; s < second.length; s++){
			
			for (var i = 0; i < zeroes; i++){
				temp += 0;
			}
			zeroes++;

			for (var f = 0; f < first.length; f++){
				let total = second[s]*first[f], tempCarry = 0;
				if (total >= 10 && f+1 !== first.length){
					while (total >= 10){
						tempCarry++;
						total = subtract(total, 10);
					}
				}

				if (f+1 === first.length){
					//console.log(second[s]*first[f], carry);
					temp += (carry + second[s]*first[f]).toString().split('').reverse().toString().replace(/,/g, '');
				}else{
					//console.log(total, carry);
					if (total + carry >= 10){
						while (total + carry >= 10){
							tempCarry++;
							total = subtract(total, 10);
						}
					}
					temp += total+carry;
				}
				carry = tempCarry;
			}
			//console.log(temp);
			ans += parseInt(temp.split('').reverse().toString().replace(/,/g, ''));
			temp = '';
		}
		return ans;
	}
}

function divide(a, b){
	let counter = 0;
	if (a < 0 && b < 0){
		return divide(Math.abs(a), Math.abs(b));
	}else if (a < 0 || b < 0){
		return negate(divide(Math.abs(a), Math.abs(b)));
	}else{
		while (mult(counter, b) < a){
			counter++;
		}
	}
	if (mult(counter, b) > a){
		console.log('The answer isn\'t an integer');
		return;
	}else{
		return counter;
	}
}

function exp(a, b){
	let n = a;
	if (b === 1){
		return a;
	}else if (b === 0){
		return 1;
	}else if (b < 0){
		console.log('the answer isn\'t an integer');
	}else{
		for (var m = 0; m < subtract(b, 1); m++){
			n = mult(n, a);
		}
	}
	return n;
}

/*
https://www.mathsisfun.com/numbers/subtraction-by-addition.html
https://www.reddit.com/r/dailyprogrammer_ideas/comments/6izezh/easy_the_adding_calculator/
*/