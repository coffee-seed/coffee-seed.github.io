//Отдельный нейрон, хранит в себе входы, функциюактивации и её производную
function neuron(arr,f,df,bias_n=false){
    this.coeff=arr;
    this.error=0;
    this.f=f;
    this.df=df;
    this.bias=bias_n;
    this.value=1;
    if(this.bias==false){
		this.value=0;
	}
    this.dvalue=0;
    var that=this;
    //Нейрон считает функцию активации, получая на вход значения нейронов предидущего слоя
    this.calc=function(input,all=false){
			if(that.bias==false){
				var sinp=0;
				for(var i=0;i<input.length; i++){
					sinp+=input[i].value*that.coeff[i];
					//console.log(that.coeff[i])
				}
				
				that.value=that.f(sinp);
				if(all){
					that.dvalue=that.df(sinp);
				}
			}
			else{
				that.value=1;
			}
			//console.log(that);
            return that.value;
        }
    this.calc_error=function(input,number=false){
		if(that.bias==false){
			if(number===false){
				that.error=that.dvalue*input;
			}
			else{
				var sym_err=0;
				for(var i=0;i<input.length;i++){
					sym_err+=input[i].error*input[i].coeff[number];
				}
				that.error=this.dvalue*sym_err;
			}
		}
    }
    //Нейрон считает производную функции активации, получая на вход значения нейронов предидущего слоя
    this.calcd=function(input){
		if(that.bias==false){
            var sinp=0;
            for(var i=0;i<input.length; i++){
                sinp+=input[i]*that.coeff[i];
            }
            that.dvalue=that.df(sinp);
            return this.df(sinp);
        }
	}
}
//Нейронная сеть на вход получает одномерный массив: длина - количество слоёв, включая входной и выходной, значения - количество нейронов в слое
function neural_network(arr,f,df,coeffinit,bias=false){
	var that=this;
    this.neurons=[];
    this.neurons.push([]);
    this.bias=bias;
    for(var i=0; i<arr[0];i++){
        this.neurons[0].push(new neuron([1],f,df));
    }
    if(this.bias==true){
		this.neurons[0].push(new neuron([1],f,df,true));
	}
    var coeffs=[];
    for(var j=1; j<arr.length;j++){
        this.neurons.push([]);
        for(var z=0; z<arr[j];z++){
            coeffs=[];
            for(var k=0;k<arr[j-1]+that.bias;k++){
                coeffs.push(coeffinit());
            }
            this.neurons[j].push(new neuron(coeffs,f,df));
        }
        if(this.bias==true&j<arr.length-1){
			this.neurons[j].push(new neuron([1],f,df,true));
		}
    }
    
    //Работа нейорнной сети: подать массив входов, получить массив выходов
    this.run = function(input,all=false){
        for(var i=0; i<that.neurons[0].length-that.bias; i++){
            that.neurons[0][i].value=input[i];
        }
        for(i=1; i<that.neurons.length; i++){
			if(that.bias==true&i<that.neurons.length-1){
				for(var j=0;j<that.neurons[i].length-1;j++){
					that.neurons[i][j].calc(that.neurons[i-1],true);
				}
			}
			else{
				for(var j=0;j<that.neurons[i].length;j++){
					that.neurons[i][j].calc(that.neurons[i-1],true);
				}
			}
        }
        var output=[];
        for(i=0;i<that.neurons[that.neurons.length-1].length;i++){
            output.push(that.neurons[that.neurons.length-1][i].value);
        }
        return output;
    }
    this.learn = function(input,real_out,learn_speed,forgot_coeff,t){
        var tmp=0;
        for(var tt=0; tt<t;tt++){
            tmp=parseInt(Math.random()*input.length);
            var output=that.run(input[tmp],true);
            for(var i=0;i<output.length;i++){
                that.neurons[that.neurons.length-1][i].calc_error(input[tmp][i]-real_out[tmp][i],false);
            }
            for(i=that.neurons.length-2; i>0;i--){
                for(var j=0;j<that.neurons[i].length;j++){
                    that.neurons[i][j].calc_error(that.neurons[i+1],j);
                }
            }
            for(i=that.neurons.length-1; i>0;i--){
                for(j=0;j<that.neurons[i].length;j++){
                    for(var k=0; k<that.neurons[i][j].coeff.length;k++){
                        that.neurons[i][j].coeff[k]=that.neurons[i][j].coeff[k]*(1-forgot_coeff)-that.neurons[i][j].error*that.neurons[i-1][k].value;
                    }
                }
            }
        }
    }
}
//Сигмоида, рекомендуемая функция активации
function sigmoid(x){
    return 1/(1+Math.exp(-x));
}
//Производная сигмоиды, рекомендуемой функции активации
function dsigmoid(x){
    return 1/(1+Math.exp(-x))*(1-1/(1+Math.exp(-x)));
}
function init(){
    return Math.random()*0.01;
}
