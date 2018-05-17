import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Line } from 'react-chartjs-2';
import axios from 'axios';



class App extends Component {
    constructor(props) {
        super(props);
        this.getStockDet = this.getStockDet.bind(this);

        this.state = {           
            data: {
                //labels: [],
                //datasets: [
                //    {
                //        //label: 'Stocks',
                //        //fill: false,
                //        //lineTension: 0.1,
                //        //backgroundColor: 'rgba(75,192,192,0.4)',
                //        //borderColor: 'rgba(75,192,192,1)',
                //        //borderCapStyle: 'butt',
                //        //borderDash: [],
                //        //borderDashOffset: 0.0,
                //        //borderJoinStyle: 'miter',
                //        //pointBorderColor: 'rgba(75,192,192,1)',
                //        //pointBackgroundColor: '#fff',
                //        //pointBorderWidth: 1,
                //        //pointHoverRadius: 5,
                //        //pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                //        //pointHoverBorderColor: 'rgba(220,220,220,1)',
                //        //pointHoverBorderWidth: 2,
                //        //pointRadius: 1,
                //        //pointHitRadius: 10,
                //        //data: []
                //    }
                //]
            },
            threemonthsdata: {}
        }     
    };
    componentDidMount() {
        this.displayChart("goog", true);        
    }
    getStockDet(e) {
        var stock = e.target.value;
        if (stock !=="")
        this.displayChart(stock,false);
    }
    getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
    displayChart(stock, addLabels) {
        var companyName = "";
        var url1 = "https://api.iextrading.com/1.0/stock/" + stock + "/company";
        axios.get(url1)
            .then(res => {
                var data2 = res.data;
                companyName = data2.companyName;                     
                var lbl = stock + " - " + companyName;
                //console.log(lbl);

                var data1 = this.state.data;
                var url = "https://api.iextrading.com/1.0/stock/" + stock + "/chart";
                axios.get(url)
                    .then(res => {
                        var data2 = res.data;
                        data1.datasets.push({ "label": lbl, data: [], borderColor: this.getRandomColor() });
                        data1.datasets[data1.datasets.length - 1].data = [];                       
                        for (var i = 0; i < data2.length; i++) {
                            if (addLabels === true)
                                data1.labels.push(data2[i].date);
                            data1.datasets[data1.datasets.length - 1].data.push(data2[i].high);
                        }
                        this.setState({ data: data1 });
                    })


                //3 months
                var threemonthsdata = this.state.threemonthsdata;
                var url2 = "https://api.iextrading.com/1.0/stock/" + stock + "/chart/1y";
                axios.get(url2)
                    .then(res => {
                        var data2 = res.data;
                        threemonthsdata.datasets.push({ "label": lbl, data: [], borderColor: this.getRandomColor() });
                        threemonthsdata.datasets[threemonthsdata.datasets.length - 1].data = [];                        
                        for (var i = 0; i < data2.length; i++) {
                            if (addLabels === true)
                                threemonthsdata.labels.push(data2[i].date);
                            threemonthsdata.datasets[threemonthsdata.datasets.length - 1].data.push(data2[i].high);
                        }
                        this.setState({ threemonthsdata: threemonthsdata });
                    });

            })
            .catch(error => {
                alert("Please check the stock name");
            });                            
    }
    render() {
      
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React Chart Demo</h1>
        </header>
        <div className="App-intro">
                <input type="text" placeholder="Enter Stock Name" onBlur={this.getStockDet} />
                <div className='divStyle'>
                <label> Last 30 Days</label>
                <Line data={this.state.data}  height={300} options={{
                    maintainAspectRatio: false
                }} />
                </div>
                <div className="divStyle">
                <label> Last 1 Year </label>
                <Line data={this.state.threemonthsdata} height={300} options={{
                    maintainAspectRatio: false
                    }} />
                </div>
                
            </div>
        
      </div>
    );
  }
}

export default App;
